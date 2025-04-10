import { Link } from "wouter";
import { Heart } from "lucide-react";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube 
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Heart className="text-primary-500 h-6 w-6 mr-2" />
              <span className="font-serif text-white text-xl font-bold">LoveChat</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Experience the joy of a meaningful connection with your virtual partner. LoveChat provides emotional support and companionship for those seeking a romantic connection.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/chat">
                  <a className="text-gray-400 hover:text-white transition">Chat</a>
                </Link>
              </li>
              <li>
                <Link href="/premium">
                  <a className="text-gray-400 hover:text-white transition">Premium</a>
                </Link>
              </li>
              <li>
                <Link href="/auth">
                  <a className="text-gray-400 hover:text-white transition">Login / Register</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} LoveChat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
