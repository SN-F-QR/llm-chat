import { Message } from '../types/types';
import { Sparkle, RotateCcw, TriangleAlert } from 'lucide-react';
import Markdown from 'react-markdown';

const ConversationBox: React.FC<{
  messageList: Message[];
  waiting: boolean;
  failedMessageId: string | undefined;
  reSendMessage: (message: string, id: string) => Promise<void>;
}> = ({ messageList, waiting, failedMessageId, reSendMessage }) => {
  return (
    <div className="flex w-full max-w-3xl flex-col space-y-4 rounded-2xl p-4">
      {messageList.map((message) => (
        <div className="flex items-end space-x-2" key={`${message.id}-${message.role}`}>
          <MessageBuble message={message} />
          {message.id === failedMessageId && (
            <span className="flex items-center space-x-2">
              <TriangleAlert className="size-4 text-red-400" />
              <button
                className="size-6 rounded-lg"
                onClick={() => void reSendMessage(message.content, message.id)}
              >
                <RotateCcw className="size-4 text-gray-500 transition-all duration-300 hover:text-gray-400" />
              </button>
            </span>
          )}
        </div>
      ))}
      {waiting && (
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
    <div className="flex">
      {message.role === 'user' ? (
        <div className="max-w-lg rounded-lg bg-purple-400 p-2 text-white">
          <p>{message.content}</p>
        </div>
      ) : (
        <div className="flex">
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
