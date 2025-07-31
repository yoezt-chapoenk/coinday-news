import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Coinday',
  description: 'Get in touch with the Coinday team. We\'d love to hear from you.',
};

export default function ContactPage() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="text-gray-300 mb-8">
              We&rsquo;d love to hear from you. Whether you have questions, feedback, or story tips, 
              don&rsquo;t hesitate to reach out to our team.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                <p className="text-gray-300">
                  <a href="mailto:info@coinday.io" className="text-blue-400 hover:text-blue-300 transition-colors">
                    info@coinday.io
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Website</h3>
                <p className="text-gray-300">
                  <a href="https://www.coinday.io" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                    www.coinday.io
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Response Time</h3>
                <p className="text-gray-300">
                  We typically respond to all inquiries within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What is this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Send Message
              </button>
            </form>
            
            <p className="text-sm text-gray-400 mt-4">
              * Required fields
            </p>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">Other Ways to Connect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Press Inquiries</h3>
              <p className="text-gray-300 text-sm">
                For media and press-related questions, please include &ldquo;PRESS&rdquo; in your subject line.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Partnership Opportunities</h3>
              <p className="text-gray-300 text-sm">
                Interested in partnering with us? We&rsquo;d love to explore collaboration opportunities.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Story Tips</h3>
              <p className="text-gray-300 text-sm">
                Have a story tip or breaking news? Help us stay on top of the latest developments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}