// Token service for handling authentication tokens in iframe
// This service receives tokens from the parent React app via postMessage

class TokenService {
  static token = null;

  /**
   * Initialize the token service
   * Listens for postMessage events from the parent window
   */
  static initialize() {
    console.log('TokenService: Initializing');
    
    // Listen for messages from parent window
    window.addEventListener('message', this.handleMessage.bind(this), false);
    
    // Store token from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      this.setToken(tokenFromUrl);
    }
  }

  /**
   * Handle incoming postMessage events
   * @param {MessageEvent} event - The message event
   */
  static handleMessage(event) {
    // Verify origin for security (adjust based on your React app's origin)
    // Only using HTTP now
    if (event.origin !== 'http://localhost:5173') {
      console.warn(`TokenService: Ignoring message from untrusted origin: ${event.origin}`);
      return;
    }
    
    // Check if the message contains a token
    if (event.data && event.data.token) {
      console.log('TokenService: Received token via postMessage');
      this.setToken(event.data.token);
    }
  }

  /**
   * Set the authentication token
   * @param {string} token - The authentication token
   */
  static setToken(token) {
    this.token = token;
    console.log('TokenService: Token set');
    
    // Store token in localStorage for persistence
    try {
      localStorage.setItem('authToken', token);
    } catch (e) {
      console.warn('TokenService: Unable to store token in localStorage', e);
    }
    
    // Dispatch an event so other parts of the app can react to token changes
    const event = new CustomEvent('tokenUpdated', { detail: { token } });
    document.dispatchEvent(event);
    
    // Add token to all fetch requests
    this.setupFetchInterceptor();
  }

  /**
   * Get the current authentication token
   * @returns {string|null} - The current token or null if not set
   */
  static getToken() {
    // If token is not in memory, try to get it from localStorage
    if (!this.token) {
      try {
        this.token = localStorage.getItem('authToken');
      } catch (e) {
        console.warn('TokenService: Unable to retrieve token from localStorage', e);
      }
    }
    
    return this.token;
  }

  /**
   * Setup fetch interceptor to add token to all requests
   */
  static setupFetchInterceptor() {
    // Save the original fetch function
    const originalFetch = window.fetch;
    
    // Override the fetch function
    window.fetch = async (url, options = {}) => {
      // Get the current token
      const token = this.getToken();
      
      // If token exists, add it to the request headers
      if (token) {
        options.headers = options.headers || {};
        options.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Call the original fetch with the modified options
      return originalFetch(url, options);
    };
  }
}

// Initialize the token service when the script loads
document.addEventListener('DOMContentLoaded', () => {
  TokenService.initialize();
});

export default TokenService;
