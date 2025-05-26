import { useParams } from 'react-router';
import { useState } from 'react';
import useListMessage from '../service/useListMessage';
import { IMessage, Role } from '../types/types';

import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';

const Chat = () => {
  const [sendFailed, setSendFailed] = useState<boolean>(false);
  const [waiting, setWaiting] = useState(false);

  const { chatid } = useParams<{ chatid: string }>();
  const url = chatid && `/chat/${chatid}`;
  const { listData, setData } = useListMessage<IMessage>(url, 'messages');

  const streamMessage = async (message: string, abortController: AbortController) => {
    try {
      setWaiting(true);
      const response = await fetch(`/api${url}/message`, {
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
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setSendFailed(false);
          break;
        }
        const text = decoder.decode(value);
        fullText += text;
        setData('set', { role: Role.assistant, content: fullText, createdAt: Date.now() / 1000 });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setData('set', {
          role: Role.assistant,
          content: 'Aborted',
          createdAt: Date.now() / 1000,
        });
        console.log('User aborted streaming');
        return;
      }
      setData('pop', {
        role: Role.assistant,
        content: '',
        createdAt: Date.now() / 1000,
      });
      setSendFailed(true);
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
    // Optimistically update
    const messageInput: IMessage = {
      role: Role.user,
      content: content,
      createdAt: Date.now() / 1000,
    };
    setData('push', messageInput);
    setData('push', {
      role: Role.assistant,
      content: '',
      createdAt: Date.now() / 1000,
    });
    // TODO: Judge if new message is sent
    await streamMessage(messageInput.content, abort);
  };

  const sendNewMessage = async (content: string, abort: AbortController) => {
    await updateMessage(content, abort);
  };

  return (
    <div className="relative flex w-full flex-grow flex-col items-center justify-between space-y-2 p-4 pb-36 md:pl-72">
      <ConversationBox
        messageList={listData ?? []}
        waiting={waiting}
        streaming={true}
        failed={sendFailed}
        reSendMessage={updateMessage}
      />
      <div className="fixed bottom-4 w-full max-w-xl">
        <InputBox submitFunc={sendNewMessage} />
      </div>
    </div>
  );
};

export default Chat;
