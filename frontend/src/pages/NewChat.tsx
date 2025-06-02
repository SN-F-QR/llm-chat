import { useNavigate, useOutletContext } from 'react-router';
import { useState } from 'react';
import { IMessage, IChat, Role } from '../types/types';
import { useStore } from '../service/chatState';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import useListMessage from '../hooks/useListMessage';
import reqClient from '../service/requestClient';

import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';

const NewChat = () => {
  const queryClient = useQueryClient();
  const [tempMessages, setTempMessages] = useState<IMessage[]>([]);
  const [model, setModel] = useState<string>('gemini-flash');
  const navigate = useNavigate();
  const newMessage = (role: Role, content: string) => ({
    role,
    content,
    createdAt: Date.now() / 1000,
  });

  // Global state, for showing the loading state in chat list
  const setIsCreating = useStore((state) => state.setCreatingNewChat);
  const chatListScrollRef = useOutletContext<React.RefObject<HTMLDivElement | null>>();
  const { messagesMutate } = useListMessage('');

  const chatsMutate = useMutation({
    mutationFn: async (content: string) => {
      const response = await reqClient.client.post<IChat>('/chat', {
        content: content,
        model: model,
      });
      queryClient.setQueryData<IChat[]>(['chats'], (previous) => {
        if (!previous) {
          return [response.data];
        }
        return [...previous, response.data];
      });
      return response.data;
    },
    onMutate: () => {
      setIsCreating(true);
      setTimeout(() => {
        if (chatListScrollRef.current) {
          const element = chatListScrollRef.current;
          element.scrollTo({
            top: -element.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 100);
    },
    onSuccess: (data, variables) => {
      setIsCreating(false);
      const { publicId } = data;
      messagesMutate.mutate({
        message: variables,
        chatId: publicId,
      });

      void navigate(`/${publicId}`, {
        replace: true,
      });
    },
  });

  const sendFirstMessage = (content: string) => {
    setTempMessages((prev) => [
      ...prev,
      newMessage(Role.user, content),
      newMessage(Role.assistant, ''),
    ]);
    chatsMutate.mutate(content);
  };

  const waiting = chatsMutate.isPending;

  return (
    // TODO: Implement the failed message
    <div className="scrollbar relative mt-12 flex max-h-[95dvh] w-full flex-grow flex-col items-center justify-between space-y-2 overflow-auto">
      <ConversationBox
        messageList={tempMessages}
        waiting={waiting}
        failed={false}
        reSendMessage={sendFirstMessage}
      />
      <div className="sticky bottom-8 flex w-full flex-col items-center px-4">
        <div className="w-full max-w-3xl">
          <InputBox submitFunc={sendFirstMessage} waiting={waiting} setModel={setModel} />
        </div>
      </div>
    </div>
  );
};

export default NewChat;
