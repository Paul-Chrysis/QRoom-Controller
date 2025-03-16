class SessionsController < ApplicationController
  protect_from_forgery with: :null_session
  def new
  end
  
  def create
    username = "admin" #params[:username]
    password = "adminpass" #params[:password]
    token = QroomControllerService.new.authenticate(username, password)
    if token
      session[:token] = token
      redirect_to root_path, notice: "Logged in successfully"
      puts "Logged in successfully"
    else
      puts "Invalid username or password"
      flash.now[:alert] = "Invalid username or password"
      render :new
    end
  end

  def destroy
    session.delete(:token)
    redirect_to new_session_path, notice: "Logged out successfully"
  end
end
