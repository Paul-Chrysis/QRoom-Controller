class DevicesController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user
  def index
    puts session[:token]
    token = session[:token] || request.headers['Authorization'].split(' ').last
    if token
      devices = QroomControllerService.new.get_devices(token)
      if devices
        formatted_devices = devices.map do |json_str|
          parsed_device = JSON.parse(json_str)
          { id: parsed_device['_id']['$oid'] }
        end
        session[:devices] = formatted_devices.map{|d| d.deep_symbolize_keys}
        puts "session[:devices]: #{session[:devices]}" 
        redirect_to scene_path
      else
        render json: { error: 'Failed to retrieve devices' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Not authenticated' }, status: :unauthorized
    end
  end

  def show
    token = session[:token] || request.headers['Authorization'].split(' ').last
    device_id = params[:id].to_i
    start_time = Time.now.to_f * 1000 # Convert to milliseconds
    
    puts "session[:devices]: #{session[:devices]}"
    puts "session[:devices][device_id]: #{session[:devices][device_id]}"
    translated_device_id = session[:devices][device_id]["id"]
    puts "translated_device_id: #{translated_device_id}"
    session[:device_id] = translated_device_id
    
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
    Rails.logger.info "Starting update_state for device #{session[:device_id]}"
    device_id = session[:device_id]
    token = session[:token]
    state = params[:device] unless params[:device].blank?
    Rails.logger.info "state: #{state}"
    Rails.logger.info "token: #{token}"
    
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
