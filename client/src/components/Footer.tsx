import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-neutral-darkest text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">LoveChat</h3>
            <p className="text-neutral-300 mb-4">
              Experience the warmth of a relationship with our virtual companions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Features</h4>
            <ul className="space-y-2">
              <li><Link href="/chat" className="text-neutral-300 hover:text-white transition-colors">Virtual Partners</Link></li>
              <li><Link href="/premium" className="text-neutral-300 hover:text-white transition-colors">Premium Love</Link></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Emotional Support</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Chat Experience</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center">
          <p className="text-neutral-300">&copy; {new Date().getFullYear()} LoveChat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
