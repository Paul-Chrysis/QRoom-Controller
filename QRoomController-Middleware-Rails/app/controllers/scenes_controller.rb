class ScenesController < ApplicationController
  def show
    # This action will render the AR scene
    @markers = session[:devices]
    
    # Log scene access
    token = session[:token]
    if token
      start_time = Time.now.to_f * 1000
      
      service = QroomControllerService.new
      service.log_interaction({
        taskId: 'scene_access',
        interfaceType: 'ar',
        interactionType: 'view_scene',
        success: true,
        timeElapsed: 0, # Initial scene load
        additionalInfo: "Markers count: #{@markers&.length || 0}"
      }, token)
      
      # Store scene load time in session for later reference
      session[:scene_load_time] = start_time
    end
  end
end
