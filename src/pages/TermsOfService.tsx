import React from 'react';
import type { Network } from '../services/suiService';

interface TermsOfServiceProps {
  network: Network;
  onNetworkChange: (network: Network) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using Sui Simplified ("the Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  2. Description of Service
                </h2>
                <p>
                  Sui Simplified is a web application that provides transaction analysis and visualization services for 
                  the Sui blockchain. The Service allows users to input transaction digests and receive formatted, 
                  easy-to-understand information about those transactions.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  3. Use License
                </h2>
                <p>
                  Permission is granted to temporarily use Sui Simplified for personal, non-commercial transitory viewing only. 
                  This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained in the Service</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  4. Disclaimer
                </h2>
                <div className="space-y-4">
                  <p>
                    <strong className="text-gray-900 dark:text-white">Accuracy of Information:</strong> While we strive 
                    to provide accurate transaction information, the Service relies on data from the Sui blockchain network. 
                    We do not guarantee the accuracy, completeness, or timeliness of any information displayed.
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">No Financial Advice:</strong> The Service is for 
                    informational purposes only and does not constitute financial, investment, or legal advice. Always 
                    conduct your own research and consult with qualified professionals before making financial decisions.
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">Service Availability:</strong> We do not guarantee 
                    that the Service will be available at all times or that it will be free from errors, viruses, or 
                    other harmful components.
                  </p>
                </div>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  5. Limitations
                </h2>
                <p>
                  In no event shall Sui Simplified or its suppliers be liable for any damages (including, without limitation, 
                  damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                  to use the Service, even if Sui Simplified or a Sui Simplified authorized representative has been notified 
                  orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  6. Blockchain Network Risks
                </h2>
                <p>
                  By using this Service, you acknowledge that:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Blockchain transactions are irreversible</li>
                  <li>Network conditions may affect transaction processing</li>
                  <li>We are not responsible for any losses incurred from blockchain transactions</li>
                  <li>You are solely responsible for verifying transaction details</li>
                </ul>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  7. Third-Party Services
                </h2>
                <p>
                  The Service may integrate with third-party services, including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Sui blockchain network RPC endpoints</li>
                  <li>CoinGecko API for token information</li>
                </ul>
                <p className="mt-4">
                  We are not responsible for the availability, accuracy, or practices of these third-party services.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  8. User Conduct
                </h2>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated systems to access the Service in a manner that sends more request messages than 
                      a human could reasonably produce</li>
                </ul>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  9. Modifications to Service
                </h2>
                <p>
                  We reserve the right to modify, suspend, or discontinue the Service at any time without prior notice. 
                  We shall not be liable to you or any third party for any modification, suspension, or discontinuance 
                  of the Service.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  10. Changes to Terms
                </h2>
                <p>
                  We reserve the right to update these Terms of Service at any time. Your continued use of the Service 
                  after any changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4">
                  11. Contact Information
                </h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us through our GitHub repository 
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

export default TermsOfService;

