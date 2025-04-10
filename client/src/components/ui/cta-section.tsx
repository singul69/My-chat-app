import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const CTASection = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-primary-600 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Experience Love?</h2>
        <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
          Join thousands of users who have found emotional connection and companionship with LoveChat.
        </p>
        <Link href={isAuthenticated ? "/chat" : "/auth"}>
          <a>
            <Button className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
              Start Your Love Journey Now
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CTASection;
