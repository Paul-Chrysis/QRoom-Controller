class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # before_action :check_iframe_origin

  private

  def authenticate_user
    response.set_header("Permissions-Policy", "xr-spatial-tracking=(self)")
    
    # Get token from URL parameter, Redis, or Authorization header
    token = request.headers['Authorization']&.split(' ')&.last || params[:token] || RedisDeviceCacheService.get_token(request.session.id)
    
    if token
      # Store token in Redis for subsequent requests
      RedisDeviceCacheService.store_token(request.session.id, token)
      puts "Using token: #{token}"
    else
      puts "No token found in Redis or params"
      redirect_to new_session_path, alert: "Please log in to continue"
    end
  end
  

  def check_iframe_origin
    allowed_origins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]
  
    # Dynamically allow local network IPs like http://192.168.x.x:5173 or http://172.x.x.x:5173
    if request.referer
      allowed_origins << request.referer.match(%r{\Ahttp://(192\.168\.\d+\.\d+|172\.\d+\.\d+\.\d+):5173\z})&.to_s
    end
  
    puts "Referer: #{request.referer}"
  
    # Skip origin check if token is provided in URL parameters
    return if params[:token].present?
    
    if request.referer.nil? || !allowed_origins.include?(request.referer)
      render plain: "Unauthorized access, go to http://localhost:5173", status: :unauthorized
    end
  end
  
end
