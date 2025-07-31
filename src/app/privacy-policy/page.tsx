import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Coinday',
  description: 'Learn about how Coinday collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-300">
          <p className="text-sm text-gray-400 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <p className="text-xl mb-6">
            At Coinday, we are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-6">
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, and other contact details when you subscribe to our newsletter or contact us</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, including pages visited, time spent, and referral sources</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
            <li><strong>Communication Data:</strong> Records of correspondence when you contact us</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-6">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>To provide and maintain our website and services</li>
            <li>To send newsletters and updates (with your consent)</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To analyze website usage and improve our content and user experience</li>
            <li>To comply with legal obligations and protect our rights</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Information Sharing and Disclosure</h2>
          <p className="mb-6">
            We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website</li>
            <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Data Security</h2>
          <p className="mb-6">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Cookies and Tracking Technologies</h2>
          <p className="mb-6">
            Our website uses cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences. Some features of our website may not function properly if cookies are disabled.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Your Rights and Choices</h2>
          <p className="mb-6">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate or incomplete information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
            <li>Withdrawal of consent</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Third-Party Links</h2>
          <p className="mb-6">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Children&rsquo;s Privacy</h2>
          <p className="mb-6">
            Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. International Data Transfers</h2>
          <p className="mb-6">
            Your information may be transferred to and processed in countries other than your own. We ensure that appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Changes to This Privacy Policy</h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date. Your continued use of our website after any changes constitutes acceptance of the updated policy.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="mb-6">
            <strong>Email:</strong> <a href="mailto:info@coinday.io" className="text-blue-400 hover:text-blue-300">info@coinday.io</a><br />
            <strong>Website:</strong> <a href="https://www.coinday.io" className="text-blue-400 hover:text-blue-300">www.coinday.io</a>
          </p>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-8">
            <p className="text-sm text-gray-400">
              <strong>Note:</strong> This privacy policy is a template and should be reviewed by legal counsel to ensure compliance with applicable laws and regulations in your jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}