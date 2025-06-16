import { Pencil } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useQuery } from '@tanstack/react-query';
import { IPrompt } from '@/types/types';
import reqClient from '@/service/requestClient';
import usePromptList from '@/hooks/usePromptList';

const promptSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  content: z.string().min(1, 'Content is required'),
  category: z
    .string()
    .min(1, 'Category cannot be empty')
    .max(30, 'Category must be less than 30 characters'),
});

const PromptEdit: React.FC = () => {
  const navigate = useNavigate();
  const promptId = useParams<{ promptid: string }>().promptid;
  const promptQuery = useQuery<IPrompt>({
    queryKey: ['prompt', promptId],
    queryFn: async () => {
      if (!promptId) return { publicId: '', name: '', content: '', category: 'default' };
      const response = await reqClient.client.get<{ prompt: IPrompt }>(`/prompt/${promptId}`);
      return response.data.prompt;
    },
  });
  const { postPrompt } = usePromptList();

  const form = useForm<Omit<IPrompt, 'publicId'>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: promptQuery.data?.name ?? '',
      content: promptQuery.data?.content ?? '',
      category: promptQuery.data?.category ?? 'default',
    },
  });

  const onSubmit: SubmitHandler<Omit<IPrompt, 'publicId'>> = (data) => {
    postPrompt.mutate(data);
    void navigate('/prompt');
  };

  return (
    <div className="mt-12 flex w-full flex-col space-y-2 p-4">
      <span className="flex items-center space-x-2 py-2 text-2xl">
        <Pencil />
        <h3>{promptId ? 'Edit Prompt' : 'Create Prompt'}</h3>
      </span>
      <Form {...form}>
        {/* eslint-disable-next-line */}
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Name</FormLabel>
                <FormControl>
                  <Input placeholder="the name of your prompt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Instruction</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., you are a helpful assistance..."
                    {...field}
                    className="scrollbar h-48 resize-none overflow-auto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Category</FormLabel>
                <FormControl>
                  <Input placeholder="the category for prompt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-fit bg-purple-500 hover:bg-purple-400">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PromptEdit;
