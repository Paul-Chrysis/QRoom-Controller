class ScenesController < ApplicationController
  # Add authenticate_user as a before_action and skip it if token is present
  before_action :authenticate_user
  skip_before_action :authenticate_user, if: -> { params[:token].present? }
  
  def show
    # Get token from URL parameter or Authorization header
    token = request.headers['Authorization']&.split(' ')&.last || params[:token]
    
    if token
      # Store token in Redis
      RedisDeviceCacheService.store_token(request.session.id, token)
      
      # Try to get devices from Redis first
      cached_devices = RedisDeviceCacheService.get_devices(token)
      
      if cached_devices.present?
        # Use cached devices
        devices = cached_devices
      else
        # Get devices using the token from API
        service = QroomControllerService.new
        devices = service.get_devices(token)
      end
      
      if devices
        formatted_devices = devices.map do |json_str|
          parsed_device = JSON.parse(json_str)
          { id: parsed_device['_id']['$oid'] }
        end
        
        @markers = formatted_devices.map{|d| d.deep_symbolize_keys}
        
        # Store markers in Redis
        RedisDeviceCacheService.store_markers(token, @markers)
        
        # Log scene access
        start_time = Time.now.to_f * 1000
        
        service = QroomControllerService.new unless defined?(service)
        service.log_interaction({
          taskId: 'scene_access',
          interfaceType: 'ar',
          interactionType: 'view_scene',
          success: true,
          timeElapsed: 0, # Initial scene load
          additionalInfo: "Markers count: #{@markers&.length || 0}"
        }, token)
        
        # Store scene load time in Redis
        RedisDeviceCacheService.store_scene_load_time(token, start_time)
      else
        @markers = []
      end
    else
      @markers = []
    end
    puts "markers: #{@markers}"
  end
  
  def handle_qr
    token = params[:token]
    qr_code = params[:qr_code]
    
    # Get devices from Redis
    devices = RedisDeviceCacheService.get_devices(token)
    
    # Find device matching QR code
    device = devices&.find { |d| d['qr_code'] == qr_code }
    
    if device
      # Send command to device
      service = QroomControllerService.new
      
      # Create state object based on command
      state = { state: params[:command] }
      
      # Update device state
      result = service.update_device_state(device['id'], state, token)
      render json: result
    else
      render json: { error: 'Device not found' }, status: :not_found
    end
  end
end
