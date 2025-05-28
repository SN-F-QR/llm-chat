import { useParams } from 'react-router';
import useListMessage from '../service/useListMessage';

import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';

const Chat = () => {
  const { chatid } = useParams<{ chatid: string }>();
  const { messagesQuery, messagesMutate } = useListMessage(chatid!);

  const sendNewMessage = (content: string) => {
    messagesMutate.mutate({ message: content, chatId: chatid! });
  };

  const isWaiting =
    messagesMutate.isPending || messagesQuery.data?.[messagesQuery.data.length - 1]?.content === '';

  return (
    <div className="scrollbar relative mt-12 flex max-h-[95dvh] w-full flex-grow flex-col items-center justify-between space-y-2 overflow-auto md:pl-72">
      <ConversationBox
        messageList={messagesQuery.data ?? []}
        waiting={isWaiting}
        failed={messagesMutate.isError}
        reSendMessage={sendNewMessage}
      />
      <div className="fixed bottom-4 w-full max-w-xl">
        <InputBox submitFunc={sendNewMessage} waiting={isWaiting} />
      </div>
    </div>
  );
};

export default Chat;
