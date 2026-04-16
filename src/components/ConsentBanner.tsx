import { Link } from 'react-router-dom';

interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentBanner = ({ onAccept, onDecline }: ConsentBannerProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm">
            <p className="mb-2">
              We use local storage to enhance your experience on UIR PROBLEMES. We respect your privacy and do not collect personal data without consent.
            </p>
            <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
              Read our Privacy Policy
            </Link>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
