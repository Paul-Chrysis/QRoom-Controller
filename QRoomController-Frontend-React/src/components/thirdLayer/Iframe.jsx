import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

const Iframe = () => {
  // Get token from Redux store
  const token = useSelector((state) => state.user.token);
  const iframeRef = useRef(null);
  
  // Dynamically determine the base URL based on the current hostname
  const getBaseUrl = () => {
    const hostname = window.location.hostname;
    // If we're accessing via localhost, use localhost for the Rails app
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    // If we're accessing from a different device (like a phone), use the server's IP
    if (hostname === '192.168.100.5' || hostname.match(/^192\.168\./)) {
      return 'http://192.168.100.5:3000';
    }
    // Otherwise, use the current hostname with the Rails port
    return `http://${hostname}:3000`;
  };
  
  const baseUrl = getBaseUrl();
  
  useEffect(() => {
    if (!iframeRef.current || !token) return;
    
    // Function to send token to iframe
    const sendTokenToIframe = () => {
      try {
        iframeRef.current.contentWindow.postMessage({ token }, baseUrl);
        console.log('Token sent to iframe');
      } catch (error) {
        console.error('Error sending token to iframe:', error);
      }
    };
    
    // Send token when iframe loads
    iframeRef.current.onload = sendTokenToIframe;
    
    // Also send token now (in case iframe is already loaded)
    sendTokenToIframe();
    
    // Set up interval to periodically send token (helps with page refreshes in iframe)
    const intervalId = setInterval(sendTokenToIframe, 2000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [token, baseUrl]);
  
  return (
    <div className="w-full max-w-full overflow-hidden">
      <iframe 
        ref={iframeRef}
        id="rails-app-iframe"
        src={`${baseUrl}/scene?token=${encodeURIComponent(token)}`}
        className="w-full max-w-full h-[400px] md:h-[500px] lg:h-[600px]"
        style={{ border: "none" }}
        title="AR Scene"
        allow="camera; microphone"
      ></iframe>
    </div>
  );
}

export default Iframe;
