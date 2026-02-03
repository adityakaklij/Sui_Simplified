import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export type Network = 'mainnet' | 'testnet' | 'devnet';

interface HeaderProps {
  network: Network;
  onNetworkChange: (network: Network) => void;
}

// Navigation items configuration
const navItems = [
  { path: '/', label: 'Explorer', icon: 'search' },
  { path: '/interact', label: 'Interact', icon: 'code' },
  { path: '/about', label: 'About', icon: 'info' },
];

const Header: React.FC<HeaderProps> = ({ network, onNetworkChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const networks: { value: Network; label: string; color: string }[] = [
    { value: 'mainnet', label: 'Mainnet', color: 'text-green-600' },
    { value: 'testnet', label: 'Testnet', color: 'text-blue-600' },
    { value: 'devnet', label: 'Devnet', color: 'text-purple-600' },
  ];

  const currentNetwork = networks.find(n => n.value === network);

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b-4 border-black dark:border-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="text-comic-blue h-8 w-8">
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-3.5h5v-1h-5v1zm.5-2h4v-1h-4v1zm-1-2h6v-1h-6v1z"></path>
              </svg>
            </div>
            <Link to="/" className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider hover:opacity-80 transition-opacity">Sui Simplified</Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  isActiveRoute(item.path)
                    ? 'bg-comic-blue text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Network Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-lg shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-base">public</span>
                <span className={currentNetwork?.color || ''}>{currentNetwork?.label || network}</span>
                <span className={`material-symbols-outlined text-base transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border-4 border-black dark:border-white rounded-lg shadow-comic dark:shadow-comic-dark overflow-hidden z-50">
                  {networks.map((net) => (
                    <button
                      key={net.value}
                      onClick={() => {
                        onNetworkChange(net.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                        network === net.value
                          ? 'bg-comic-blue text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={net.color}>●</span>
                        <span>{net.label}</span>
                        {network === net.value && (
                          <span className="ml-auto material-symbols-outlined text-base">check</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden pb-4 border-t-2 border-gray-200 dark:border-gray-700 mt-2"
          >
            <nav className="flex flex-col gap-1 pt-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                    isActiveRoute(item.path)
                      ? 'bg-comic-blue text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

