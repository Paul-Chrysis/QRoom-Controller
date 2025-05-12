# Configure session store for cross-origin iframe embedding
Rails.application.config.session_store :cookie_store,
                                       key: '_qroom_controller_session',
                                       same_site: :none
                                       # Removed secure: true to work without HTTPS
