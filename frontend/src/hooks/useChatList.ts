import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { IChat } from '../types/types';
import reqClient from '../service/requestClient';

const useChatList = () => {
  const queryClient = useQueryClient();
  const chatsQuery = useQuery<IChat[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      if (!reqClient.isLogin) {
        throw new Error('User is not logged in');
      }
      const response = await reqClient.client.get<{ chats: IChat[] }>('/chat');
      return response.data.chats;
    },
  });

  const chatsMutations = useMutation({
    mutationFn: async (publicId: string) => {
      await reqClient.client.delete(`/chat/${publicId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  return {
    chatsQuery,
    chatsMutations,
  };
};

export default useChatList;
