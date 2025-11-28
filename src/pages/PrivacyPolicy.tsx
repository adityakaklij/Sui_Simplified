import React from 'react';
import type { Network } from '../services/suiService';

interface PrivacyPolicyProps {
  network: Network;
  onNetworkChange: (network: Network) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  1. Introduction
                </h2>
                <p>
                  Sui Simplified ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you use our web application 
                  (the "Service").
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  2. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">2.1 Information You Provide</h3>
                    <p>
                      When you use our Service, you may provide transaction digests (hashes) for analysis. 
                      These are processed locally in your browser and sent to Sui network RPC endpoints for 
                      transaction data retrieval.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">2.2 Automatically Collected Information</h3>
                    <p>
                      We may collect certain information automatically, including:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>IP address</li>
                      <li>Usage patterns and preferences (stored locally in your browser)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  3. How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Process and display transaction information</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Ensure the security and integrity of our Service</li>
                </ul>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  4. Data Storage and Security
                </h2>
                <div className="space-y-4">
                  <p>
                    <strong className="text-gray-900 dark:text-white">Local Storage:</strong> We use browser local storage 
                    to cache token logos and user preferences (such as dark mode settings). This data never leaves your device.
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">No Server-Side Storage:</strong> We do not store 
                    your transaction digests or any personal information on our servers. All processing happens in your browser.
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">Third-Party Services:</strong> We use CoinGecko API 
                    for token logo retrieval. Please refer to CoinGecko's privacy policy for their data practices.
                  </p>
                </div>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  5. Blockchain Data
                </h2>
                <p>
                  When you enter a transaction digest, we query the Sui blockchain network directly via RPC endpoints. 
                  All transaction data is publicly available on the blockchain. We do not have access to private keys, 
                  wallet addresses, or any information beyond what is publicly available on-chain.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  6. Cookies and Tracking
                </h2>
                <p>
                  We use minimal browser storage (localStorage) for functionality purposes only, such as:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Dark mode preferences</li>
                  <li>Cached token logos (to reduce API calls)</li>
                </ul>
                <p className="mt-4">
                  We do not use cookies for tracking or advertising purposes.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  7. Your Rights
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Clear your browser's local storage at any time</li>
                  <li>Disable JavaScript to prevent any data collection</li>
                  <li>Use the Service without providing any personal information</li>
                </ul>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  8. Children's Privacy
                </h2>
                <p>
                  Our Service is not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  9. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  10. Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us through our GitHub repository 
                  or community channels.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;

