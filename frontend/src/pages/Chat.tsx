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

  /**
   * Handles the POST and UI update when submitting the new input
   * @param formData from the TextArea
   */
  const updateMessage = async (content: string, id?: string) => {
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

  return (
    <div className="flex w-full flex-grow flex-col items-center justify-between space-y-2 p-4">
      <ConversationBox
        messageList={messages}
        waiting={waiting}
        failedMessageId={failedMessageId}
        reSendMessage={updateMessage}
      />
      <InputBox submitFunc={updateMessage} />
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
