import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminProtected from '@/components/AdminProtected';
import UserCard from '@/components/UserCard';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Check, CheckCircle, Crown, Edit, Loader2, MoreHorizontal, Search, UsersRound } from 'lucide-react';

const AdminUsers = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['/api/users'],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
          <Input placeholder="Search users..." className="pl-10 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user: any) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

const AdminMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [messageType, setMessageType] = useState<'male' | 'female'>('male');
  const [category, setCategory] = useState('greeting');
  const [isPremium, setIsPremium] = useState(false);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Handle image upload - this would typically upload to a storage service 
  // and then get a URL back, but for now we're just taking a direct URL
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const addMessage = useMutation({
    mutationFn: async () => {
      // Create a payload that includes image URLs for the correct gender
      const payload = {
        category,
        isPremium,
        for_boys_message: messageType === 'female' ? message : null,
        for_girls_message: messageType === 'male' ? message : null,
        for_boys_image_url: messageType === 'female' ? imageUrl : null,
        for_girls_image_url: messageType === 'male' ? imageUrl : null,
      };

      const res = await apiRequest('POST', '/api/messages', payload);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Message Added',
        description: 'The new message has been added successfully.',
      });
      setMessage('');
      setImageUrl('');
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Message content cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    addMessage.mutate();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Message Management</h2>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label className="text-base">Message Type</Label>
                <RadioGroup
                  value={messageType}
                  onValueChange={(value) => setMessageType(value as 'male' | 'female')}
                  className="grid grid-cols-2 gap-4 mt-2"
                >
                  <div className={`border rounded-lg p-3 flex items-center space-x-3 ${
                    messageType === 'male' ? 'border-primary bg-primary/5' : ''
                  }`}>
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">For Female Users (Rahul)</Label>
                  </div>
                  <div className={`border rounded-lg p-3 flex items-center space-x-3 ${
                    messageType === 'female' ? 'border-primary bg-primary/5' : ''
                  }`}>
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">For Male Users (Ananya)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="category">Message Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greeting">Regular Conversation</SelectItem>
                    <SelectItem value="romantic">Romantic Messages</SelectItem>
                    <SelectItem value="emotional_support">Emotional Support</SelectItem>
                    <SelectItem value="premium_teaser">Premium Teaser</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPremium"
                  checked={isPremium}
                  onCheckedChange={(checked) => setIsPremium(checked as boolean)}
                />
                <Label htmlFor="isPremium" className="cursor-pointer">Premium Content</Label>
              </div>

              <div>
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1"
                  rows={6}
                  placeholder="Type your message content here..."
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  className="mt-1"
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrl && (
                  <div className="mt-2 border rounded-md p-2 max-w-xs">
                    <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="max-h-40 max-w-full object-contain rounded" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/400x300/pink/white?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setMessage('')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMessage.isPending}>
                  {addMessage.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding
                    </>
                  ) : 'Add Message'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminPayments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: payments, isLoading } = useQuery({
    queryKey: ['/api/payments'],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const verifyPayment = useMutation({
    mutationFn: async (paymentId: number) => {
      const res = await apiRequest('PUT', `/api/payments/${paymentId}/verify`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Payment Verified',
        description: 'The payment has been verified and user upgraded to premium.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify payment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payment Management</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments?.length > 0 ? (
                payments.map((payment: any) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.transactionId || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={payment.verified ? "success" : "secondary"}>
                        {payment.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!payment.verified && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => verifyPayment.mutate(payment.id)}
                          disabled={verifyPayment.isPending}
                        >
                          {verifyPayment.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <span className="ml-1">Verify</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
  });
  
  const { data: payments } = useQuery({
    queryKey: ['/api/payments'],
  });

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const premiumUsers = users?.filter((user: any) => user.isPremium).length || 0;
  const totalRevenue = payments?.reduce((sum: number, payment: any) => 
    payment.verified ? sum + payment.amount : sum, 0) || 0;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: <UsersRound className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Premium Subscribers',
      value: premiumUsers,
      icon: <Crown className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Revenue',
      value: `₹${totalRevenue}`,
      icon: <Check className="h-5 w-5" />,
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-neutral-600">{stat.title}</h3>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-green-500 text-sm mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>{' '}
                10.5% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Users</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users?.slice(0, 5).map((user: any) => (
                <div key={user.id} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{user.fullName}</p>
                      <Badge variant={user.isPremium ? "default" : "secondary"} className="text-xs">
                        {user.isPremium ? "Premium" : "Free"}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Payments</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments?.slice(0, 5).map((payment: any) => (
                <div key={payment.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {payment.verified ? <CheckCircle className="h-5 w-5" /> : <Loader2 className="h-5 w-5" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">User ID: {payment.userId}</p>
                      <p className="font-semibold">₹{payment.amount}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      <Badge variant={payment.verified ? "success" : "secondary"} className="text-xs">
                        {payment.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <AdminProtected>
      <div className="app-screen flex flex-col bg-neutral-50">
        {/* Header */}
        <header className="bg-gradient-love text-white shadow-md sticky top-0 z-10">
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10" 
              size="sm"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </header>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="dashboard" className="h-full flex flex-col">
            <TabsList className="w-full justify-between p-0 bg-white border-b">
              <TabsTrigger 
                value="dashboard" 
                className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Payments
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="dashboard" className="m-0 p-4 h-full">
                <AdminDashboard />
              </TabsContent>
              
              <TabsContent value="users" className="m-0 p-4 h-full">
                <AdminUsers />
              </TabsContent>
              
              <TabsContent value="messages" className="m-0 p-4 h-full">
                <AdminMessages />
              </TabsContent>
              
              <TabsContent value="payments" className="m-0 p-4 h-full">
                <AdminPayments />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminProtected>
  );
};

export default Admin;
