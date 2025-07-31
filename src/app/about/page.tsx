import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Coinday',
  description: 'Learn more about Coinday - your trusted source for cryptocurrency news, analysis, and insights.',
};

export default function AboutPage() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">About Coinday</h1>
        
        <div className="prose prose-lg max-w-none text-gray-300">
          <p className="text-xl mb-6">
            Welcome to Coinday, your premier destination for cryptocurrency news, analysis, and insights.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            At Coinday, we are committed to providing accurate, timely, and comprehensive coverage of the cryptocurrency and blockchain industry. Our mission is to educate, inform, and empower our readers with the knowledge they need to navigate the rapidly evolving world of digital assets.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">What We Do</h2>
          <p className="mb-6">
            We deliver breaking news, in-depth analysis, market insights, and educational content covering:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Bitcoin and major cryptocurrency price movements</li>
            <li>Blockchain technology developments</li>
            <li>Regulatory updates and policy changes</li>
            <li>DeFi (Decentralized Finance) innovations</li>
            <li>NFT trends and marketplace analysis</li>
            <li>Investment strategies and market analysis</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Team</h2>
          <p className="mb-6">
            Our team consists of experienced journalists, blockchain experts, and financial analysts who are passionate about the cryptocurrency space. We combine traditional journalism standards with deep technical knowledge to bring you reliable and insightful content.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Information</h2>
          <p className="mb-6">
            For press inquiries, partnerships, or general questions, please reach out to us at:
          </p>
          <p className="mb-6">
            <strong>Email:</strong> <a href="mailto:info@coinday.io" className="text-blue-400 hover:text-blue-300">info@coinday.io</a><br />
            <strong>Website:</strong> <a href="https://www.coinday.io" className="text-blue-400 hover:text-blue-300">www.coinday.io</a>
          </p>
          
          <p className="text-lg mt-8">
            Thank you for choosing Coinday as your trusted source for cryptocurrency news and analysis.
          </p>
        </div>
      </div>
    </div>
  );
}