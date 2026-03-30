import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-navy-900" />
              </div>
              <span className="font-heading font-bold gradient-text">JussConnecc</span>
            </div>
            <p className="text-sm text-gray-500">
              Where Professionals JussConnecc. Build your network, grow your career.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Careers', 'Blog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Press', 'Partners'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-white/5">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} JussConnecc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
