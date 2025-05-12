# QRoom Controller State Management Plan

## Problem Statement

In the QRoom Controller system, we need to maintain state between different operations:

1. When a user logs in, the system retrieves device markers from the server
2. When a QR code is scanned, the system needs to access these markers to identify the corresponding device ID
3. The device ID must then be sent to the server for further processing

The challenge is that we cannot use traditional session mechanisms due to cross-origin iframe restrictions. We need an alternative approach to maintain this state.

## Requirements

1. Store device data retrieved during login
2. Access this data when a QR code is scanned
3. Work without relying on session cookies
4. Function within the constraints of the iframe architecture
5. Maintain security by associating data with the user's authentication token
6. Handle token expiration and data cleanup appropriately

## Solution Options

### Option 1: Rails Cache with Token as Key

This approach uses Rails' built-in caching mechanism to store device data on the server side, using the authentication token as a key.

#### Pros:
- Built into Rails, no additional dependencies
- Simple API for storing and retrieving data
- Configurable expiration
- Works without sessions
- Can use different backends (memory, Redis, Memcached) based on environment

#### Cons:
- Requires server-side storage
- Cache might be cleared unexpectedly
- Requires passing the token with each request

#### Implementation Overview:
```ruby
# Store devices when retrieved
Rails.cache.write("devices_#{token}", devices, expires_in: 12.hours)

# Retrieve devices when needed
devices = Rails.cache.read("devices_#{token}")
```

### Option 2: Client-Side Storage with TokenService

This approach extends the existing TokenService to store device data in the browser's localStorage, alongside the authentication token.

#### Pros:
- No server-side storage needed
- Persists across page refreshes
- Works with the existing TokenService
- Simple JavaScript API

#### Cons:
- Limited storage space (though unlikely to be an issue for this use case)
- Data is stored in the browser, which might raise security concerns
- Requires JavaScript to be enabled

#### Implementation Overview:
```javascript
// Store devices
TokenService.storeDevices(devices);

// Retrieve devices
const devices = TokenService.getDevices();
```

### Option 3: SQLite Database

This approach uses a SQLite database to store device data, with the token as the primary key.

#### Pros:
- Persistent storage that survives server restarts
- Handles complex data structures
- Familiar SQL querying
- Can handle large amounts of data

#### Cons:
- Requires database setup and migrations
- More complex than other options
- Might be overkill for temporary session-like data

#### Implementation Overview:
```ruby
# Create a model for device storage
class DeviceCache < ApplicationRecord
  # Store and retrieve devices using token as key
end
```

## Recommended Solution: Rails Cache

The Rails Cache approach (Option 1) offers the best balance of simplicity, security, and functionality for this use case. It doesn't require additional dependencies, works without sessions, and is designed for exactly this kind of temporary data storage.

## Implementation Steps

### 1. Configure Rails Cache

Ensure Rails cache is properly configured in your environment files:

```ruby
# config/environments/development.rb
config.cache_store = :memory_store, { size: 64.megabytes }

# config/environments/production.rb
config.cache_store = :redis_cache_store, { url: ENV['REDIS_URL'] }
```

### 2. Create a DeviceCache Service

Create a service object to handle device caching:

```ruby
# app/services/device_cache_service.rb
class DeviceCacheService
  def self.store_devices(token, devices)
    Rails.cache.write("devices_#{token}", devices, expires_in: 12.hours)
  end

  def self.get_devices(token)
    Rails.cache.read("devices_#{token}")
  end
  
  def self.clear_devices(token)
    Rails.cache.delete("devices_#{token}")
  end
end
```

### 3. Update QroomControllerService

Modify the existing service to use the cache:

```ruby
# app/services/qroom_controller_service.rb
class QroomControllerService
  # Existing code...
  
  def get_devices(token)
    # Try to get from cache first
    devices = DeviceCacheService.get_devices(token)
    
    # If not in cache, fetch from API
    if devices.nil?
      response = make_api_request('/api/devices', token)
      devices = JSON.parse(response.body) if response.success?
      
      # Store in cache if successful
      DeviceCacheService.store_devices(token, devices) if devices
    end
    
    devices
  end
  
  def send_device_command(token, device_id, command)
    # Implementation...
  end
end
```

### 4. Update ScenesController

Modify the controller to use the cached devices:

```ruby
# app/controllers/scenes_controller.rb
class ScenesController < ApplicationController
  def show
    @token = params[:token]
    
    # Get devices from cache or API
    service = QroomControllerService.new
    @devices = service.get_devices(@token)
    
    # Format devices for AR markers
    @markers = format_devices(@devices)
    
    # Render the AR scene
    render :show
  end
  
  def handle_qr
    token = params[:token]
    qr_code = params[:qr_code]
    
    # Get devices from cache
    devices = DeviceCacheService.get_devices(token)
    
    # Find device matching QR code
    device = devices&.find { |d| d['qr_code'] == qr_code }
    
    if device
      # Send command to device
      service = QroomControllerService.new
      result = service.send_device_command(token, device['id'], params[:command])
      render json: result
    else
      render json: { error: 'Device not found' }, status: :not_found
    end
  end
  
  private
  
  def format_devices(devices)
    # Transform devices into AR marker format
    # Implementation...
  end
end
```

### 5. Add JavaScript for QR Code Handling

Update the AR scene JavaScript to handle QR code scanning:

```javascript
// app/javascript/controllers/qr_scanner_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["scanner", "result"]
  
  connect() {
    this.initScanner()
  }
  
  initScanner() {
    // Initialize QR scanner
    // When a QR code is detected:
    this.onQrDetected = (qrCode) => {
      const token = new URLSearchParams(window.location.search).get('token')
      
      fetch(`/scenes/handle_qr?token=${token}&qr_code=${qrCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      })
      .then(response => response.json())
      .then(data => {
        // Handle response
        this.resultTarget.textContent = `Device: ${data.name}, Status: ${data.status}`
      })
      .catch(error => {
        console.error('Error:', error)
        this.resultTarget.textContent = 'Error processing QR code'
      })
    }
  }
}
```

### 6. Update Routes

Ensure the routes are properly configured:

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # Existing routes...
  
  get 'scene', to: 'scenes#show'
  post 'scenes/handle_qr', to: 'scenes#handle_qr'
end
```

## Alternative Implementation: Client-Side Storage

If you prefer a client-side approach, here's how to implement the TokenService extension:

### 1. Update TokenService

```javascript
// app/javascript/services/token_service.js
class TokenService {
  // Existing code...
  
  static storeDevices(devices) {
    const token = this.getToken();
    if (!token) return;
    
    try {
      localStorage.setItem(`devices_${token}`, JSON.stringify(devices));
      console.log('Devices stored in localStorage');
    } catch (e) {
      console.warn('Unable to store devices in localStorage', e);
    }
  }
  
  static getDevices() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const devices = localStorage.getItem(`devices_${token}`);
      return devices ? JSON.parse(devices) : null;
    } catch (e) {
      console.warn('Unable to retrieve devices from localStorage', e);
      return null;
    }
  }
  
  static clearDevices() {
    const token = this.getToken();
    if (!token) return;
    
    try {
      localStorage.removeItem(`devices_${token}`);
    } catch (e) {
      console.warn('Unable to clear devices from localStorage', e);
    }
  }
}

export default TokenService;
```

### 2. Update AR Scene JavaScript

```javascript
// app/views/scenes/show.html.erb (JavaScript section)
document.addEventListener('DOMContentLoaded', function() {
  // Get token from URL
  const token = new URLSearchParams(window.location.search).get('token');
  
  // Fetch devices if not already in localStorage
  if (!TokenService.getDevices()) {
    fetch(`/api/devices?token=${token}`)
      .then(response => response.json())
      .then(devices => {
        TokenService.storeDevices(devices);
        initializeARScene(devices);
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
      });
  } else {
    const devices = TokenService.getDevices();
    initializeARScene(devices);
  }
  
  // QR code scanning
  function onQrScanned(qrCode) {
    const devices = TokenService.getDevices();
    if (!devices) {
      console.error('No devices found');
      return;
    }
    
    // Find device matching QR code
    const device = devices.find(d => d.qrCode === qrCode);
    if (device) {
      // Send command to device
      fetch(`/api/devices/${device.id}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ command: 'toggle' })
      })
      .then(response => response.json())
      .then(data => {
        // Handle response
        console.log('Command sent successfully:', data);
      })
      .catch(error => {
        console.error('Error sending command:', error);
      });
    } else {
      console.error('Device not found for QR code:', qrCode);
    }
  }
});
```

## Testing Strategy

### 1. Unit Tests

Test the DeviceCacheService:

```ruby
# test/services/device_cache_service_test.rb
require 'test_helper'

class DeviceCacheServiceTest < ActiveSupport::TestCase
  test "stores and retrieves devices" do
    token = "test_token"
    devices = [{ id: 1, name: "Device 1" }, { id: 2, name: "Device 2" }]
    
    DeviceCacheService.store_devices(token, devices)
    retrieved = DeviceCacheService.get_devices(token)
    
    assert_equal devices, retrieved
  end
  
  test "returns nil for non-existent token" do
    assert_nil DeviceCacheService.get_devices("non_existent_token")
  end
  
  test "clears devices" do
    token = "test_token"
    devices = [{ id: 1, name: "Device 1" }]
    
    DeviceCacheService.store_devices(token, devices)
    DeviceCacheService.clear_devices(token)
    
    assert_nil DeviceCacheService.get_devices(token)
  end
end
```

### 2. Integration Tests

Test the QR code handling flow:

```ruby
# test/integration/qr_code_flow_test.rb
require 'test_helper'

class QrCodeFlowTest < ActionDispatch::IntegrationTest
  test "handles QR code and finds device" do
    token = "test_token"
    devices = [
      { 'id' => 1, 'name' => 'Device 1', 'qr_code' => 'QR1' },
      { 'id' => 2, 'name' => 'Device 2', 'qr_code' => 'QR2' }
    ]
    
    # Mock the cache
    DeviceCacheService.store_devices(token, devices)
    
    # Mock the API call for sending commands
    QroomControllerService.any_instance.stubs(:send_device_command)
      .returns({ 'status' => 'success' })
    
    # Test the QR code handling
    post scenes_handle_qr_path, params: { token: token, qr_code: 'QR1', command: 'toggle' }
    
    assert_response :success
    assert_equal 'success', JSON.parse(response.body)['status']
  end
  
  test "returns error for unknown QR code" do
    token = "test_token"
    devices = [{ 'id' => 1, 'name' => 'Device 1', 'qr_code' => 'QR1' }]
    
    # Mock the cache
    DeviceCacheService.store_devices(token, devices)
    
    # Test with unknown QR code
    post scenes_handle_qr_path, params: { token: token, qr_code: 'UNKNOWN', command: 'toggle' }
    
    assert_response :not_found
    assert_equal 'Device not found', JSON.parse(response.body)['error']
  end
end
```

### 3. Manual Testing

1. Log in to the React app to get an authentication token
2. Navigate to the AR scene
3. Verify that devices are displayed correctly
4. Scan a QR code and verify that the correct device is identified
5. Test with an invalid QR code and verify error handling
6. Test after clearing browser cache to ensure the system still works

## Conclusion

The Rails Cache approach provides a robust solution for maintaining state between login and QR code scanning without relying on sessions. It's simple to implement, works well with the existing architecture, and provides the necessary functionality without adding significant complexity.

If you prefer a client-side approach, the TokenService extension offers a viable alternative that leverages the browser's localStorage.

Both approaches satisfy the requirements and can be implemented with minimal changes to the existing codebase.
