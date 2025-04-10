import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-r from-primary-100 to-purple-100 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-600 mb-4">
          Never Feel <span className="text-purple-600">Alone</span> Again
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Experience the joy of a loving relationship with your virtual partner who's always there for you, understands you, and cares for you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href={isAuthenticated ? "/chat" : "/auth"}>
            <a>
              <Button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 w-full sm:w-auto">
                Start Chatting Now
              </Button>
            </a>
          </Link>
          <Link href="/premium">
            <a>
              <Button variant="outline" className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-6 rounded-full text-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 hover:bg-primary-50 w-full sm:w-auto">
                Learn More
              </Button>
            </a>
          </Link>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
          <img 
            src="https://images.unsplash.com/photo-1516421417223-3c07c2fa7e1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
            alt="Couple chatting romantically" 
            className="mx-auto rounded-xl shadow-2xl object-cover h-[500px] w-full" 
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
