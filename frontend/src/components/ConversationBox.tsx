import { Message } from '../types/types';
import { Sparkle } from 'lucide-react';
import Markdown from 'react-markdown';

const ConversationBox: React.FC<{ messageList: Message[] }> = ({ messageList }) => {
  return (
    <div className="flex w-full max-w-3xl flex-col space-y-4 rounded-2xl p-4">
      {messageList.map((message, index) => (
        <MessageBuble key={index} message={message} />
      ))}
      {messageList[messageList.length - 1].role === 'user' && (
        <div className="flex w-full animate-pulse">
          <div className="py-2">
            <Sparkle className="size-6 text-purple-600" />
          </div>
          <div className="flex w-full flex-col space-y-4 p-2">
            <div className="h-2 w-1/2 rounded bg-gray-200"></div>
            <div className="h-2 w-full rounded bg-gray-200"></div>
            <div className="h-2 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>
      )}
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
          <div className="w-full p-2">
            <Markdown>{message.content}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationBox;
