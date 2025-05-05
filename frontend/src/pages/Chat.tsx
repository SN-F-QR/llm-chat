import { useState } from 'react';
import axios from 'axios';
import { Message } from '../types/types';

import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(testMessages);
  const [failedMessageId, setFailedMessageId] = useState<string | undefined>(undefined);
  const [waiting, setWaiting] = useState(false);

  const sendMessage = async (message: string, id: string) => {
    try {
      const response = await axios.post<{ content: string }>('/api/chat', {
        content: message,
      });
      setFailedMessageId(undefined);
      return response.data.content;
    } catch (error) {
      setFailedMessageId(id);
      console.error('Error sending chat message:', error);
      return undefined;
    }
  };

  const streamMessage = async (message: string, id: string) => {
    try {
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });
      if (!response.body || !response.ok) {
        const error = (await response.json()) as { error: string };
        throw new Error(`Network response was not ok since ${error.error}`);
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
          if (lastMessage && lastMessage.id === id && lastMessage.role === 'assistant') {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + text },
            ];
          }
          return [...prevMessages, { role: 'assistant', content: text, id: id }];
        });
      }
    } catch (error) {
      setFailedMessageId(id);
      console.error('Error streaming chat message:', error);
    }
  };

  /**
   * Handles the POST and UI update when submitting the new input
   * @param content of users input
   * @param stream if the llm message should be streamed
   * @param id of the message to update
   */
  const updateMessage = async (content: string, stream = true, id?: string) => {
    if (!content || waiting) return;
    let messageInput: Message | undefined;
    if (!id) {
      id = crypto.randomUUID();
      messageInput = {
        role: 'user',
        content: content,
        id: id,
      };
      setMessages((prevMessages) => [...prevMessages, messageInput!]);
    } else {
      messageInput = messages.find((message) => message.id === id);
      if (!messageInput) {
        console.error('Message not found');
        return;
      }
    }
    if (stream) {
      await streamMessage(messageInput.content, id);
      return;
    }
    const timer: number = setTimeout(() => setWaiting(true), 300);
    const response: string | undefined = await sendMessage(messageInput.content, id);
    clearTimeout(timer);
    if (response) {
      const llmMessage: Message = {
        role: 'assistant',
        content: response,
        id: id,
      };
      setMessages((prevMessages) => [...prevMessages, llmMessage]);
    }
    setWaiting(false);
  };

  const sendNewMessage = async (content: string) => {
    await updateMessage(content);
  };

  return (
    <div className="flex w-full flex-grow flex-col items-center justify-between space-y-2 p-4">
      <ConversationBox
        messageList={messages}
        waiting={waiting}
        failedMessageId={failedMessageId}
        reSendMessage={updateMessage}
      />
      <InputBox submitFunc={sendNewMessage} />
    </div>
  );
};

const testMessages: Message[] = [
  {
    role: 'user',
    content: 'Hello, how are you?',
    id: 'test-1',
  },
  {
    role: 'assistant',
    content: 'I am fine, thank you! How can I assist you today?',
    id: 'test-1',
  },
  {
    role: 'user',
    content: 'Can you tell me a joke?',

    id: 'test-2',
  },
  {
    role: 'assistant',
    content: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
    id: 'test-2',
  },
];

export default Chat;
