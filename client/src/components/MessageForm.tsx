import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Smile, Send } from 'lucide-react';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type FormValues = z.infer<typeof formSchema>;

interface MessageFormProps {
  className?: string;
}

const MessageForm: React.FC<MessageFormProps> = ({ className }) => {
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest('POST', '/api/user-messages', {
        message: values.message,
        isUserMessage: true,
      });
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/user-messages'] });
    },
  });

  const onSubmit = (values: FormValues) => {
    sendMessage.mutate(values);
  };

  return (
    <div className={`bg-white border-t border-neutral-light p-4 ${className}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-neutral-400 mr-3"
          >
            <Smile size={20} />
          </Button>
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Type a message..."
                    className="border border-neutral-200 rounded-full px-4 py-3 focus:outline-none focus:border-primary"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            variant="default"
            size="icon"
            className="ml-3 bg-primary text-white p-3 rounded-full"
            disabled={sendMessage.isPending}
          >
            <Send size={18} />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MessageForm;
