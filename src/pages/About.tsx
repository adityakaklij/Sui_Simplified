import React from 'react';
import { Link } from 'react-router-dom';
import type { Network } from '../services/suiService';

interface AboutProps {
  network: Network;
  onNetworkChange: (network: Network) => void;
}

const About: React.FC<AboutProps> = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase mb-4">
                About Sui Simplified
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Making Sui blockchain transactions understandable for everyone
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* What is Sui Simplified */}
              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  What is Sui Simplified?
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    Sui Simplified is a user-friendly web application designed to make Sui blockchain transactions 
                    easy to understand for everyone, from beginners to experienced developers. We transform complex 
                    transaction data into clear, visual explanations that anyone can comprehend.
                  </p>
                  <p>
                    Whether you're a curious user wanting to understand what happened in your transaction, or a 
                    developer debugging smart contract interactions, Sui Simplified provides the insights you need 
                    in an intuitive, accessible format.
                  </p>
                </div>
              </section>

              {/* Features */}
              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl"></span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Simple View</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Perfect for beginners. See transaction status, balance changes, and key information 
                          in plain language.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl"></span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Developer View</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Detailed technical information including smart contract calls, object changes, 
                          inputs, and events for debugging.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl"></span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Visual Journey Map</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Follow your transaction's journey from start to finish with an interactive, 
                          easy-to-understand visual flow.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl"></span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Multi-Network Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Switch between Mainnet, Testnet, and Devnet to explore transactions on any Sui network.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* How It Works */}
              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  How It Works
                </h2>
                <ol className="space-y-4 list-decimal list-inside text-gray-700 dark:text-gray-300">
                  <li>
                    <strong className="text-gray-900 dark:text-white">Paste Transaction Digest:</strong> Enter any Sui transaction digest (hash) 
                    into the search field.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Choose Your View:</strong> Select between Simple View for quick insights 
                    or Developer View for detailed technical information.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Explore the Journey:</strong> Follow the visual journey map to see 
                    how your transaction progressed through the blockchain.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Dive Deeper:</strong> Access comprehensive details including balance 
                    changes, smart contract calls, object modifications, and more.
                  </li>
                </ol>
              </section>

              {/* Technology */}
              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  Built for the Sui Community
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    Sui Simplified is built using modern web technologies and integrates directly with the Sui 
                    blockchain via the official Sui JSON RPC API. We're committed to providing accurate, 
                    real-time transaction data while maintaining a user-friendly experience.
                  </p>
                  <p>
                    This project is open-source and built for the Sui community. We welcome contributions, 
                    feedback, and suggestions to make Sui transactions even more accessible.
                  </p>
                </div>
              </section>

              {/* CTA */}
              <section className="bg-comic-blue text-white rounded-xl border-4 border-black dark:border-white shadow-comic p-8 text-center">
                <h2 className="text-2xl font-black uppercase mb-4">Ready to Explore?</h2>
                <p className="mb-6 text-lg">
                  Start exploring Sui transactions in a whole new way!
                </p>
                <Link
                  to="/"
                  className="inline-block bg-white text-comic-blue px-8 py-3 rounded-lg border-4 border-black font-black uppercase hover:scale-105 transition-transform shadow-comic"
                >
                  Get Started
                </Link>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;

