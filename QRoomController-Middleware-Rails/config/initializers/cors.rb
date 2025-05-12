Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ->(origin, _env) {
      # Allow localhost, 127.0.0.1, and any 172.* or 192.168.* local IPs
      # Only using HTTP now
      [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.1.100:5173",
        "http://192.168.1.100:3000",
        "http://localhost:3000/",
        "http://192.168.100.5:5173",
        "http://192.168.100.17:5173"
      ].include?(origin) || origin.match?(/^http:\/\/192\.168\.100\.\d+:\d+$/)
    }

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options],
      credentials: true
  end
end
