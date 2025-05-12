class SessionsController < ApplicationController
  protect_from_forgery with: :null_session
  def new
  end
  
  def create
    username = "admin" #params[:username]
    password = "adminpass" #params[:password]
    token = QroomControllerService.new.authenticate(username, password)
    if token
      # Store token in Redis
      RedisDeviceCacheService.store_token(request.session.id, token)
      puts "Logged in successfully"
      puts "Token stored in Redis: #{token}"
      redirect_to root_path, notice: "Logged in successfully"
    else
      puts "Invalid username or password"
      flash.now[:alert] = "Invalid username or password"
      render :new
    end
  end

  def destroy
    # Get token from Redis
    token = RedisDeviceCacheService.get_token(request.session.id)
    
    # Clear all data for this token
    RedisDeviceCacheService.clear_all(token) if token
    
    redirect_to new_session_path, notice: "Logged out successfully"
  end
end
