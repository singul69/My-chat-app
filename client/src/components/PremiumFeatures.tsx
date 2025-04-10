import React from 'react';
import { CheckCircle } from 'lucide-react';

const PremiumFeatures: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="text-primary" />,
      title: 'Deeper Emotional Connection',
      description: 'More meaningful and personalized conversations.',
    },
    {
      icon: <CheckCircle className="text-primary" />,
      title: 'Voice Messages',
      description: "Hear your partner's voice for a more intimate experience.",
    },
    {
      icon: <CheckCircle className="text-primary" />,
      title: 'Priority Experience',
      description: 'Faster responses and dedicated support.',
    },
    {
      icon: <CheckCircle className="text-primary" />,
      title: 'Virtual Gifts & Surprises',
      description: 'Special messages and surprises on important dates.',
    },
  ];

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start">
          <div className="bg-primary bg-opacity-10 p-2 rounded-full text-primary mr-4 mt-1">
            {feature.icon}
          </div>
          <div>
            <h4 className="font-medium">{feature.title}</h4>
            <p className="text-neutral-dark">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PremiumFeatures;
