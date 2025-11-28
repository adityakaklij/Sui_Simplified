import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t-4 border-black dark:border-white bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-comic-blue h-8 w-8">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-3.5h5v-1h-5v1zm.5-2h4v-1h-4v1zm-1-2h6v-1h-6v1z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase">Sui Simplified</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Making Sui blockchain transactions easy to understand for everyone.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  About
                </Link>
              </li>
              {/* <li>
                <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  Documentation
                </a>
              </li> */}
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
              {/* <li>
                <a href="https://sui.io" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  Sui Network
                </a>
              </li> */}
              {/* <li>
                <a href="https://suiexplorer.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  Sui Explorer
                </a>
              </li> */}
            </ul>
          </div>

          {/* Contact/Info Section */}
          <div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/adityakaklij" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://x.com/adityakaklij" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  X
                </a>
              </li>
              {/* <li>
                <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  Sui Docs
                </a>
              </li> */}
              {/* <li>
                <a href="https://discord.gg/sui" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-comic-blue dark:hover:text-comic-blue transition-colors">
                  Discord
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} Sui Simplified. Built for the Sui community.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Powered by <span className="font-bold text-comic-blue">Sui</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

