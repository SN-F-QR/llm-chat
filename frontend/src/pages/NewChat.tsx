import { useNavigate } from 'react-router';
import { useState } from 'react';
import { IMessage, IChat, Role } from '../types/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import useListMessage from '../service/useListMessage';
import reqClient from '../service/requestClient';

import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';

const NewChat = () => {
  const queryClient = useQueryClient();
  const [tempMessages, setTempMessages] = useState<IMessage[]>([]);
  const [waiting, setWaiting] = useState<boolean>(false);
  const navigate = useNavigate();
  const newMessage = (role: Role, content: string) => ({
    role,
    content,
    createdAt: Date.now() / 1000,
  });
  const { messagesMutate } = useListMessage('');

  const chatsMutate = useMutation({
    mutationFn: async (content: string) => {
      const response = await reqClient.client.post<IChat>('/chat', {
        content: content,
      });
      queryClient.setQueryData<IChat[]>(['chats'], (previous) => {
        if (!previous) {
          return [response.data];
        }
        return [...previous, response.data];
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
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
    setWaiting(true);
    setTempMessages((prev) => [
      ...prev,
      newMessage(Role.user, content),
      newMessage(Role.assistant, ''),
    ]);
    chatsMutate.mutate(content);
  };

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
          <InputBox submitFunc={sendFirstMessage} waiting={waiting} />
        </div>
      </div>
    </div>
  );
};

export default NewChat;
