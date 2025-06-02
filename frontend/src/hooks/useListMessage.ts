import reqClient from '../service/requestClient';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { IChat, IMessage, Role } from '../types/types';
import { useStore } from '../service/chatState';

/**
 * Fetch and manage messages
 */
const useListMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  const chatInfo = queryClient
    .getQueryData<IChat[]>(['chats'])
    ?.find((chat) => chat.publicId === chatId);

  const updateMessage = (message: string, chatId: string) => {
    queryClient.setQueryData<IMessage[]>([chatId, 'messages'], (previous) => {
      if (!previous) {
        return undefined;
      }
      const unchanged = previous.slice(0, -1);
      const updatedMessage: IMessage = { ...previous[previous.length - 1], content: message };
      return [...unchanged, updatedMessage];
    });
  };

  const messagesQuery = useQuery<IMessage[]>({
    queryKey: [chatId, 'messages'],
    queryFn: async () => {
      if (chatId === '') {
        return [];
      }

      const response = await reqClient.client.get<IChat & { messages: IMessage[] }>(
        `/chat/${chatId}`
      );
      return response.data.messages;
    },
  });

  const abortController = useStore((state) => state.abortController);

  const messagesMutate = useMutation({
    mutationFn: async (args: { message: string; chatId: string }) => {
      const { message, chatId } = args;
      const response = await fetch(`/api/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: message }),
        signal: abortController.signal,
      });

      if (!response.body || !response.ok) {
        const error = await response.text();
        throw new Error(response.statusText + error);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const text = decoder.decode(value);
        fullText += text;
        updateMessage(fullText, chatId);
      }
    },
    // fired before the mutation fc
    onMutate: async ({ message, chatId }) => {
      if (chatId === '' || message.trim() === '') {
        throw new Error('Chat ID or message cannot be empty');
      }
      // return messages for possible rollback
      await queryClient.cancelQueries({ queryKey: [chatId, 'messages'] });
      const oldMessages = queryClient.getQueryData<IMessage[]>([chatId, 'messages']);
      queryClient.setQueryData<IMessage[]>([chatId, 'messages'], (previous) => {
        const pendingMessages = [
          { role: Role.user, content: message, createdAt: Date.now() / 1000 },
          { role: Role.assistant, content: '', createdAt: Date.now() / 1000 },
        ];
        if (!previous) {
          return [...pendingMessages];
        }
        return [...previous, ...pendingMessages];
      });
      return { oldMessages };
    },
    onError: async (error) => {
      // TODO: filter with ID, mark the failed user message
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Message sending aborted by user');
      } else {
        console.error('Error sending message:', error);
      }
      await queryClient.invalidateQueries({ queryKey: [chatId, 'messages'] });
    },
  });

  return {
    chatInfo,
    messagesQuery,
    messagesMutate,
  };
};

export default useListMessage;
