# app/services/redis_device_cache_service.rb
class RedisDeviceCacheService
  # Default expiration time (12 hours in seconds)
  DEFAULT_EXPIRATION = 12.hours.to_i

  # Device data methods
  def self.store_devices(token, devices)
    key = "devices_#{sanitize_token(token)}"
    $redis.set(key, devices.to_json)
    $redis.expire(key, DEFAULT_EXPIRATION)
  end

  def self.get_devices(token)
    key = "devices_#{sanitize_token(token)}"
    json_data = $redis.get(key)
    return nil unless json_data
    
    JSON.parse(json_data)
  end
  
  def self.clear_devices(token)
    key = "devices_#{sanitize_token(token)}"
    $redis.del(key)
  end
  
  # Token methods
  def self.store_token(session_id, token)
    key = "token_#{session_id}"
    $redis.set(key, token)
    $redis.expire(key, DEFAULT_EXPIRATION)
  end
  
  def self.get_token(session_id)
    key = "token_#{session_id}"
    $redis.get(key)
  end
  
  # Markers/formatted devices methods
  def self.store_markers(token, markers)
    key = "markers_#{sanitize_token(token)}"
    $redis.set(key, markers.to_json)
    $redis.expire(key, DEFAULT_EXPIRATION)
  end
  
  def self.get_markers(token)
    key = "markers_#{sanitize_token(token)}"
    json_data = $redis.get(key)
    return nil unless json_data
    
    JSON.parse(json_data)
  end
  
  # Device ID methods
  def self.store_device_id(token, device_id)
    key = "device_id_#{sanitize_token(token)}"
    $redis.set(key, device_id)
    $redis.expire(key, DEFAULT_EXPIRATION)
  end
  
  def self.get_device_id(token)
    key = "device_id_#{sanitize_token(token)}"
    $redis.get(key)
  end
  
  # Scene load time methods
  def self.store_scene_load_time(token, time)
    key = "scene_load_time_#{sanitize_token(token)}"
    $redis.set(key, time.to_s)
    $redis.expire(key, DEFAULT_EXPIRATION)
  end
  
  def self.get_scene_load_time(token)
    key = "scene_load_time_#{sanitize_token(token)}"
    time_str = $redis.get(key)
    return nil unless time_str
    
    time_str.to_f
  end
  
  # Clear all data for a token
  def self.clear_all(token)
    $redis.del("devices_#{sanitize_token(token)}")
    $redis.del("markers_#{sanitize_token(token)}")
    $redis.del("device_id_#{sanitize_token(token)}")
    $redis.del("scene_load_time_#{sanitize_token(token)}")
  end

  def self.sanitize_token(token)
    token.split(" ").last if token
  end
  private_class_method :sanitize_token
  
end
