import { useParams } from 'react-router';
import { useRef } from 'react';
import useListMessage from '../hooks/useListMessage';

import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';

const Chat = () => {
  const { chatid } = useParams<{ chatid: string }>();
  const { messagesQuery, messagesMutate } = useListMessage(chatid!);
  const chatDivRef = useRef<HTMLDivElement>(null);

  const sendNewMessage = (content: string) => {
    messagesMutate.mutate({ message: content, chatId: chatid! });
    setTimeout(() => {
      if (chatDivRef.current) {
        const element = chatDivRef.current;
        element.scrollTo({
          top: element.scrollHeight,
        });
      }
    }, 100);
  };

  // 2nd condition is for the new chat message
  const isWaiting =
    messagesMutate.isPending || messagesQuery.data?.[messagesQuery.data.length - 1]?.content === '';

  return (
    <div
      ref={chatDivRef}
      className="scrollbar relative mt-12 flex max-h-[95dvh] w-full flex-grow flex-col items-center justify-between space-y-2 overflow-auto scroll-smooth"
    >
      <ConversationBox
        messageList={messagesQuery.data ?? []}
        waiting={isWaiting}
        failed={messagesMutate.isError}
        reSendMessage={sendNewMessage}
      />
      <div className="sticky bottom-8 flex w-full flex-col items-center px-4">
        <div className="w-full max-w-3xl">
          <InputBox submitFunc={sendNewMessage} waiting={isWaiting} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
