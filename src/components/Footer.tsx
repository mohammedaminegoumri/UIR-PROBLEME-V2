import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              <span className="text-yellow-500">UIR</span>
              <span className="text-blue-600"> PROBLEMES</span>
            </h3>
            <p className="text-gray-600 text-sm">
              Your anonymous platform for university support, problem-solving, and community connection.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/problems" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Submit Problem
                </Link>
              </li>
              <li>
                <Link to="/crush-finder" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Crush Finder
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Forum
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} UIR PROBLEMES. All rights reserved. Built with privacy and anonymity in mind.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
