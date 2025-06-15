import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import reqClient from '../service/requestClient';
import { IPrompt } from '../types/types';

const usePromptList = () => {
  const queryClient = useQueryClient();
  const promptsQuery = useQuery<IPrompt[]>({
    queryKey: ['prompts'],
    queryFn: async () => {
      const response = await reqClient.client.get<{ prompts: IPrompt[] }>('/prompt');
      return response.data.prompts;
    },
  });

  const postPrompt = useMutation({
    mutationFn: async (prompt: Omit<IPrompt, 'publicId'>) => {
      const response = await reqClient.client.post<{ prompt: IPrompt }>('/prompt', prompt);
      return response.data.prompt;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  const duplicatePrompt = (publicId: string) => {
    const prompt = promptsQuery.data?.find((p) => p.publicId === publicId);
    if (prompt) {
      const newPrompt: Omit<IPrompt, 'publicId'> = {
        name: prompt.name + ' (Copy)',
        content: prompt.content,
        category: prompt.category,
      };
      postPrompt.mutate(newPrompt);
    }
  };

  const deletePrompt = useMutation({
    mutationFn: async (publicId: string) => {
      await reqClient.client.delete(`/prompt/${publicId}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  return {
    promptsQuery,
    postPrompt,
    duplicatePrompt,
    deletePrompt,
  };
};

export default usePromptList;
