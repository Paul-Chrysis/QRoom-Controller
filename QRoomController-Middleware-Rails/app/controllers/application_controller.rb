class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # before_action :check_iframe_origin

  private

  def authenticate_user
    unless session[:token]
      redirect_to new_session_path, alert: "Please log in to continue"
    end
  end
  

  def check_iframe_origin
    allowed_origin = 'http://localhost:5173'  # Replace with your React app's URL

    # Check if the request is coming from the React app
    puts request.referer
    if request.referer.nil? || !request.referer.start_with?(allowed_origin)
      render plain: "Unauthorized access, to access this app go to http://localhost:5173", status: :unauthorized
    end
  end
end
