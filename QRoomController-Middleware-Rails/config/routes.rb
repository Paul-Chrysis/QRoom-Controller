Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  # Authentication routes (commented out since we're using React's authentication)
  # post 'login', to: 'sessions#create'
  get 'login', to: 'sessions#new', as: :new_session
  # get 'logout', to: 'sessions#destroy', as: :destroy_session
  
  # Device routes
  get "devices" => "devices#index", as: :devices
  put 'devices/update_state', to: 'devices#update_state'
  get "devices/:id" => "devices#show", as: :device

  # Scene routes - accessible with token parameter
  get 'scene', to: 'scenes#show', as: :scene
  post 'scenes/handle_qr', to: 'scenes#handle_qr'
  resources :devices
  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  root "devices#index"
end
