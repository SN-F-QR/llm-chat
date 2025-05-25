import { useParams } from 'react-router';
import { useState } from 'react';
import useListData from '../service/useListData';
import { IMessage, IChat, Role } from '../types/types';

import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [failedMessageId, setFailedMessageId] = useState<string | undefined>(undefined);
  const [waiting, setWaiting] = useState(false);

  const { chatid } = useParams<{ chatid: string }>();
  const url = chatid && `/chat/${chatid}`;
  const chatData = useListData<IChat & { messages: IMessage[] }>(url);

  const streamMessage = async (message: string, abortController: AbortController) => {
    try {
      setWaiting(true);
      const response = await fetch('/api/llm/chat-stream', {
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
        throw new Error(error);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setFailedMessageId(undefined);
          break;
        }
        const text = decoder.decode(value);
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === Role.assistant) {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + text },
            ];
          }
          throw new Error('Message not found');
        });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.content === '') {
            lastMessage.content = 'Aborted';
          }
          return [...prevMessages.slice(0, -1), lastMessage];
        });
        console.log('User aborted streaming');
        return;
      }
      setMessages((prevMessages) => [...prevMessages.slice(0, -1)]);
      // setFailedMessageId(id);
      console.error('Error streaming chat message:', error);
    } finally {
      setWaiting(false);
    }
  };

  /**
   * Handles the POST and UI update when submitting the new input
   * @param content of users input
   * @param stream if the llm message should be streamed
   * @param id of the message to update
   */
  const updateMessage = async (content: string, abort: AbortController) => {
    if (!content || waiting) return;
    const messageInput: IMessage = {
      role: Role.user,
      content: content,
      createdAt: Date.now() / 1000, // Optimistic timestamp
    };
    setMessages((prevMessages) => [...prevMessages, messageInput]);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: Role.assistant, content: '', createdAt: Date.now() / 1000 },
    ]);
    await streamMessage(messageInput.content, abort);
  };

  const sendNewMessage = async (content: string, abort: AbortController) => {
    await updateMessage(content, abort);
  };

  return (
    <div className="relative flex w-full flex-grow flex-col items-center justify-between space-y-2 p-4 pb-36 md:pl-72">
      <ConversationBox
        messageList={chatData?.messages ?? []}
        waiting={waiting}
        streaming={true}
        failedMessageId={failedMessageId}
        reSendMessage={updateMessage}
      />
      <div className="fixed bottom-4 w-full max-w-xl">
        <InputBox submitFunc={sendNewMessage} />
      </div>
    </div>
  );
};

export default Chat;
