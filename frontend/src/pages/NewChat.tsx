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
    <div className="relative flex w-full flex-grow flex-col items-center justify-between space-y-2 p-4 pb-36 md:pl-72">
      <ConversationBox
        messageList={tempMessages}
        waiting={waiting}
        failed={false}
        reSendMessage={sendFirstMessage}
      />
      <div className="fixed bottom-4 w-full max-w-xl">
        <InputBox submitFunc={sendFirstMessage} waiting={waiting} />
      </div>
    </div>
  );
};

export default NewChat;
