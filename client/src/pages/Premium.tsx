import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AuthProtected from '@/components/AuthProtected';
import PremiumFeatures from '@/components/PremiumFeatures';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Crown, ExternalLink } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Premium: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactionId, setTransactionId] = useState('');
  
  const initiatePayment = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/payments', {
        amount: 299,
        transactionId: transactionId || `UPI-${Date.now()}`
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Payment Initiated',
        description: 'Your payment request has been recorded. Please allow some time for verification.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Payment Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handlePaymentSubmit = () => {
    initiatePayment.mutate();
  };

  return (
    <AuthProtected>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        {/* Header */}
        <header className="bg-gradient-love text-white shadow-lg">
          <div className="container mx-auto p-4 flex items-center">
            <Button variant="ghost" size="icon" className="text-white mr-4" asChild>
              <Link href="/">
                <ArrowLeft />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Premium Love Chat</h1>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4">
            <Card className="overflow-hidden">
              <div className="bg-gradient-love p-8 text-white text-center">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
                  <Crown className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Premium Love Chat</h2>
                <p className="opacity-90 mb-6">Unlock the full romantic experience</p>
                <div className="inline-block bg-white text-primary font-bold text-2xl px-6 py-3 rounded-full">
                  ₹299<span className="text-sm font-normal">/month</span>
                </div>
              </div>
              
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">What You'll Get:</h3>
                <PremiumFeatures />
                
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-bold mb-4">Make Payment to Upgrade</h3>
                  
                  <div className="bg-gradient-light p-6 rounded-xl mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                        className="w-48 h-48 mx-auto" 
                        alt="Payment QR code" 
                      />
                    </div>
                    <p className="text-neutral-700 font-medium">Scan this QR code with any UPI app</p>
                    <p className="text-sm text-neutral-500">Or use UPI ID: lovechat@upi</p>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Transaction ID (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your UPI transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="mb-4 gap-2"
                    onClick={handlePaymentSubmit}
                    disabled={initiatePayment.isPending}
                  >
                    <ExternalLink size={16} />
                    Pay with UPI Apps
                  </Button>
                  
                  <p className="text-sm text-neutral-500">
                    After payment, please allow up to 5 minutes for activation.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I confirm my payment?</AccordionTrigger>
                  <AccordionContent>
                    After completing your payment, our system will automatically verify it. If there's an issue, contact support.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I cancel my subscription?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel anytime from your account settings. You'll continue to have premium access until the end of your billing period.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We currently accept all major UPI apps including Google Pay, PhonePe, Paytm, and BHIM UPI.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </AuthProtected>
  );
};

export default Premium;
