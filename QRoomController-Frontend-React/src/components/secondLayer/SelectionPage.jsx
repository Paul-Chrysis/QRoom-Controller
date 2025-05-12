import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Card from "../ui/Card";

function SelectionPage() {
  const navigate = useNavigate();

  const handleGestureClick = () => {
    navigate("/gesture");
  };

  const handleARClick = () => {
    navigate("/ar");
  };

  return (
    <section className="py-12">
      <Card className="max-w-4xl mx-auto shadow-soft">
        <Card.Header className="text-center">
          <h1 className="text-4xl font-bold text-primary-800">Select Control Mode</h1>
          <p className="text-gray-600 mt-2">Choose how you want to interact with your smart devices</p>
        </Card.Header>
        
        <Card.Body className="py-8">
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div 
              onClick={handleGestureClick}
              className="bg-white border border-gray-200 rounded-xl shadow-card hover:shadow-lg transition-all duration-300 p-6 cursor-pointer flex flex-col items-center max-w-xs w-full transform hover:-translate-y-1"
            >
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Gesture Recognition</h2>
              <p className="text-gray-600 text-center mb-6">Control your devices with hand gestures captured by your camera</p>
              <Button variant="primary" size="lg" className="w-full">
                Select
              </Button>
            </div>
            
            <div 
              onClick={handleARClick}
              className="bg-white border border-gray-200 rounded-xl shadow-card hover:shadow-lg transition-all duration-300 p-6 cursor-pointer flex flex-col items-center max-w-xs w-full transform hover:-translate-y-1"
            >
              <div className="bg-secondary-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Augmented Reality</h2>
              <p className="text-gray-600 text-center mb-6">Interact with virtual controls overlaid on your physical environment</p>
              <Button variant="secondary" size="lg" className="w-full">
                Select
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
}

export default SelectionPage;
