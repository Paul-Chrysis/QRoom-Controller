class QroomControllerService
  include HTTParty
  base_uri 'http://localhost:8080/api/v1' # Replace with your Spring Boot backend URL
  debug_output $stdout

  def initialize
    @options = { headers: { 'Content-Type' => 'application/json' } }
  end

  def get_devices(token)
    options_with_auth = @options.merge(headers: @options[:headers].merge('Authorization' => "Bearer #{token}"))
    response = self.class.get('/device/devices', options_with_auth)
    log_response(response)
    response.parsed_response
  end

  def get_device(token, device_id)
    options_with_auth = @options.merge(headers: @options[:headers].merge('Authorization' => "Bearer #{token}"))
    response = self.class.get("/device/#{device_id}", options_with_auth)
    log_response(response)
    response.parsed_response
  end

  def update_device_state(device_id, state, token)
    Rails.logger.info "Body: #{state.to_json}"
    start_time = Time.now.to_f * 1000 # Convert to milliseconds for consistency

    response = self.class.put(
      "/device/#{device_id}",
      body: state.to_json,
      headers: headers_with_token(token),
      debug_output: $stdout
    )
    
    # Calculate elapsed time
    elapsed_time = (Time.now.to_f * 1000) - start_time
    
    # Log the interaction
    if response.success?
      log_interaction({
        taskId: 'server_device_update',
        interfaceType: 'ar',
        interactionType: 'state_update',
        success: true,
        deviceId: device_id,
        timeElapsed: elapsed_time.round,
        additionalInfo: "Response code: #{response.code}"
      }, token)
    else
      log_interaction({
        taskId: 'server_device_update',
        interfaceType: 'ar',
        interactionType: 'state_update',
        success: false,
        deviceId: device_id,
        timeElapsed: elapsed_time.round,
        additionalInfo: "Error: #{response.code} - #{response.body}"
      }, token)
    end
    
    response.parsed_response
  end

  def authenticate(username, password)
    body = { username: username, password: password }.to_json
    response = self.class.post('/auth/authenticate', @options.merge(body: body))
    log_response(response)
    if response.success?
      response.parsed_response['token']
    else
      nil
    end
  end

  # Log an interaction to the Spring Boot API
  def log_interaction(log_data, token)
    begin
      # Ensure timestamp is set
      log_data[:timestamp] ||= Time.now.utc.iso8601
      
      response = self.class.post(
        "/logs",
        body: log_data.to_json,
        headers: headers_with_token(token)
      )
      
      Rails.logger.info "Log sent to Spring API: #{log_data.to_json}"
      Rails.logger.info "Log response: #{response.code}"
      
      response.parsed_response
    rescue => e
      Rails.logger.error "Error sending log to Spring API: #{e.message}"
      nil
    end
  end

  private

  def log_response(response)
    Rails.logger.info "Response code: #{response.code}"
    Rails.logger.info "Response body: #{response.body}"
    Rails.logger.info "Response headers: #{response.headers.inspect}"
  end

  def headers_with_token(token)
    {
      'Content-Type': 'application/json',
      'Authorization': "Bearer #{token}"
    }
  end
end
