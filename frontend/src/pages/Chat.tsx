import { useParams, useNavigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import useListMessage from '../service/useListMessage';
import { IMessage, Role, IChat } from '../types/types';

import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';
import reqClient from '../service/requestClient';

const Chat = () => {
  const navigate = useNavigate();
  const newMessage = useLocation();
  const [sendFailed, setSendFailed] = useState<boolean>(false);
  const [waiting, setWaiting] = useState(false);

  const { chatid } = useParams<{ chatid: string }>();
  const url = chatid && `/chat/${chatid}`;
  const { listData, setData } = useListMessage<IMessage>(url, 'messages');

  useEffect(() => {
    console.log('Route changed');
    const abortController = new AbortController();
    // setData('reset');
    if (newMessage.state) {
      console.log('Route with a new message state');
      const { newMessage: content } = newMessage.state as { newMessage: string };
      if (content && chatid) {
        void updateMessage(content, abortController);
        window.history.replaceState({}, '');
        console.log('Sending new message:', content);
      }
    }
    return () => {
      abortController.abort();
      console.log('Cleaning up the sending process');
    };
  }, [chatid]);

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
      setData('pop');
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
   */
  const updateMessage = async (content: string, abort: AbortController) => {
    if (!content) return;
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
    setWaiting(true);

    if (!chatid) {
      const response = await reqClient.client.post<IChat>('/chat', {
        content: content,
      });
      const { publicId } = response.data;
      void navigate(`/${publicId}`, {
        state: { newMessage: content, abortController: abort },
        replace: true,
      });
      return;
    }
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
        <InputBox submitFunc={sendNewMessage} waiting={waiting} />
      </div>
    </div>
  );
};

export default Chat;
