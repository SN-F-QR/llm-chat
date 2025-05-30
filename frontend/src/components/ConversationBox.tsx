import { IMessage, Role } from '../types/types';
import { Sparkle, RotateCcw, TriangleAlert } from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { useRef, useEffect } from 'react';

/**
 * A box showing the conversation between the user and the assistant
 * @param messageList list of messages to show
 * @param waiting if the assistant is waiting for a response
 * @param failedMessageId if the last message failed to send
 * @param reSendMessage function to resend the failed message
 */
const ConversationBox: React.FC<{
  messageList: IMessage[];
  waiting: boolean;
  failed: boolean;
  reSendMessage: (content: string) => void;
}> = ({ messageList, waiting, failed, reSendMessage }) => {
  const aborter = useRef<AbortController>(new AbortController());

  const messageHistory = messageList.map((message, index) => (
    <div className="flex items-end space-x-2" key={`${message.createdAt}-${message.role}`}>
      <MessageBuble message={message} updating={waiting} />
      {failed && index === messageList.length - 1 && message.role === Role.user && (
        <span className="flex items-center space-x-2">
          <TriangleAlert className="size-4 text-red-400" />
          <RetryButton
            onClick={() => {
              const handler = () => {
                reSendMessage(message.content);
                aborter.current = new AbortController();
                return;
              };
              void handler();
            }}
          />
        </span>
      )}
    </div>
  ));

  return (
    <div className="flex w-full max-w-3xl flex-col space-y-4 rounded-2xl p-4 pb-8">
      {messageHistory}
      {/* {waiting && <LoadingMessage />} */}
    </div>
  );
};

const MessageBuble: React.FC<{ message: IMessage; updating: boolean }> = ({
  message,
  updating,
}) => {
  const SyntaxHighlightedCode = (props: React.HTMLAttributes<HTMLElement>) => {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (ref.current && props.className?.includes('lang-') && window.hljs && !updating) {
        // use auto detection and avoid directly using highlightElement
        const highlighted: { value: string } = window.hljs.highlightAuto(
          ref.current.innerText ?? ''
        );
        ref.current.innerHTML = highlighted.value;

        // hljs won't reprocess the element unless this attribute is removed
        ref.current.removeAttribute('data-highlighted');
      }
    }, [props.className, props.children]);

    // add hljs class to change the background color
    return <code {...props} className={`${props.className} hljs rounded-2xl text-sm`} ref={ref} />;
  };

  return (
    <div className="flex w-full">
      {message.role === Role.user ? (
        <div className="max-w-lg rounded-lg bg-purple-400 p-2 text-white">
          <p>{message.content}</p>
        </div>
      ) : message.content === '' && updating ? (
        <LoadingMessage />
      ) : (
        <div className="flex w-full">
          <div className="py-2">
            <Sparkle className="size-6 text-purple-600" />
          </div>
          <div className="w-full p-2 break-words">
            <Markdown options={{ overrides: { code: SyntaxHighlightedCode } }}>
              {message.content}
            </Markdown>
          </div>
        </div>
      )}
    </div>
  );
};

const RetryButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button className="size-6 rounded-lg" onClick={onClick}>
      <RotateCcw className="size-4 text-gray-500 transition-all duration-300 hover:text-gray-400" />
    </button>
  );
};

const LoadingMessage: React.FC = () => {
  return (
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
  );
};

export default ConversationBox;
