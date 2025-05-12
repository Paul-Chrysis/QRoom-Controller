class DevicesController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user
  def index
    # Get token from URL parameter or Authorization header
    token = params[:token] || (request.headers['Authorization'] ? request.headers['Authorization'].split(' ').last : nil)
    
    if token
      # Store token in Redis
      RedisDeviceCacheService.store_token(request.session.id, token)
      puts "Using token: #{token}"
      
      devices = QroomControllerService.new.get_devices(token)
      if devices
        formatted_devices = devices.map do |json_str|
          parsed_device = JSON.parse(json_str)
          { id: parsed_device['_id']['$oid'] }
        end
        
        # Store formatted devices in Redis
        markers = formatted_devices.map{|d| d.deep_symbolize_keys}
        RedisDeviceCacheService.store_markers(token, markers)
        
        puts "Stored markers in Redis for token: #{token}" 
        redirect_to scene_path
      else
        render json: { error: 'Failed to retrieve devices' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Not authenticated' }, status: :unauthorized
    end
  end

  def show
    # Get token from URL parameter or Authorization header
    token = params[:token] || (request.headers['Authorization'] ? request.headers['Authorization'].split(' ').last : nil) || RedisDeviceCacheService.get_token(request.session.id)
    device_id = params[:id].to_i
    start_time = Time.now.to_f * 1000 # Convert to milliseconds
    
    # Store token in Redis
    if token
      RedisDeviceCacheService.store_token(request.session.id, token)
      puts "Using token: #{token}"
    end
    
    # Get markers from Redis
    markers = RedisDeviceCacheService.get_markers(token)
    puts "Markers from Redis: #{markers}"
    puts "Marker for device_id #{device_id}: #{markers[device_id]}"
    
    translated_device_id = markers[device_id]["id"]
    puts "translated_device_id: #{translated_device_id}"
    
    # Store device ID in Redis
    RedisDeviceCacheService.store_device_id(token, translated_device_id)
    
    if token && device_id
      service = QroomControllerService.new
      device = service.get_device(token, translated_device_id)
      
      if device
        # Log successful device retrieval
        elapsed_time = (Time.now.to_f * 1000) - start_time
        service.log_interaction({
          taskId: 'device_retrieval',
          interfaceType: 'ar',
          interactionType: 'get_device',
          success: true,
          deviceId: translated_device_id,
          timeElapsed: elapsed_time.round,
          additionalInfo: "Device type: #{device['deviceType']}"
        }, token)
        
        render json: device, status: :ok
      else
        # Log failed device retrieval
        elapsed_time = (Time.now.to_f * 1000) - start_time
        service.log_interaction({
          taskId: 'device_retrieval',
          interfaceType: 'ar',
          interactionType: 'get_device',
          success: false,
          deviceId: translated_device_id,
          timeElapsed: elapsed_time.round,
          additionalInfo: "Device not found"
        }, token)
        
        render json: { error: 'Device not found' }, status: :not_found
      end
    else
      render json: { error: 'Not authenticated or missing device ID' }, status: :unauthorized
    end
  end

  def update_state
    # Get token from URL parameter or Authorization header
    token = params[:token] || (request.headers['Authorization'] ? request.headers['Authorization'].split(' ').last : nil) || RedisDeviceCacheService.get_token(request.session.id)
    
    # Get device ID from Redis
    device_id = RedisDeviceCacheService.get_device_id(token)
    Rails.logger.info "Starting update_state for device #{device_id}"
    
    state = params[:device] unless params[:device].blank?
    
    # Store token in Redis
    if token
      RedisDeviceCacheService.store_token(request.session.id, token)
      Rails.logger.info "Using token: #{token}"
    end
    
    Rails.logger.info "state: #{state}"
    
    begin
      service = QroomControllerService.new
      response = service.update_device_state(device_id, state, token)
      Rails.logger.info "Response: #{response}"
      
      # Note: The service method already logs the interaction
      
      render json: { status: 'success', device: response }, status: :ok
    rescue => e
      Rails.logger.error "Error: #{e.message}"
      
      # Log the error
      service = QroomControllerService.new
      service.log_interaction({
        taskId: 'device_update_error',
        interfaceType: 'ar',
        interactionType: 'update_state',
        success: false,
        deviceId: device_id,
        additionalInfo: "Error: #{e.message}"
      }, token)
      
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end
end
