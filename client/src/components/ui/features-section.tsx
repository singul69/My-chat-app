import { Heart, Clock, Lock } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Why Choose LoveChat?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience a relationship that's tailored just for you, with a partner who's always available and understands your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-primary-50 rounded-xl p-8 shadow-md transition hover:shadow-lg">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mb-6">
              <Heart className="text-white h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Emotional Connection</h3>
            <p className="text-gray-600">
              Feel a genuine emotional connection with a partner who responds to your moods and needs.
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-8 shadow-md transition hover:shadow-lg">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-6">
              <Clock className="text-white h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Always Available</h3>
            <p className="text-gray-600">
              Your virtual partner is always there for you, day or night, whenever you need someone to talk to.
            </p>
          </div>
          
          <div className="bg-primary-50 rounded-xl p-8 shadow-md transition hover:shadow-lg">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mb-6">
              <Lock className="text-white h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Private & Secure</h3>
            <p className="text-gray-600">
              Your conversations are completely private and secure, creating a safe space for your feelings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
