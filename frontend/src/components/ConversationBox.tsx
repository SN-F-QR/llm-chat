import { Message } from '../types/types';
import { Sparkle } from 'lucide-react';

const ConversationBox: React.FC<{ messageList: Message[] }> = ({ messageList }) => {
  return (
    <div className="flex w-full max-w-3xl flex-col space-y-4 rounded-2xl p-4">
      {messageList.map((message, index) => (
        <MessageBuble key={index} message={message} />
      ))}
    </div>
  );
};

const MessageBuble: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="flex w-full">
      {message.role === 'user' ? (
        <div className="max-w-lg rounded-lg bg-purple-400 p-2 text-white">
          <p>{message.content}</p>
        </div>
      ) : (
        <div className="flex w-full">
          <div className="py-2">
            <Sparkle className="size-6 text-purple-600" />
          </div>
          <p className="w-full p-2">{message.content}</p>
        </div>
      )}
    </div>
  );
};

export default ConversationBox;
