const Iframe = () => {
  return (
    <iframe 
      src="http://localhost:3000/login" 
      width="600" 
      height="400" 
      style={{ border: "none" }}
      title="Example Site"
      allow="camera; microphone"
    ></iframe>
  );
}

export default Iframe;