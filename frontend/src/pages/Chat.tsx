import { useState, useOptimistic } from 'react';
import axios from 'axios';
import { Message } from '../types/types';

import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(testMessages);
  // const [waiting, setWaiting] = useState(false);

  const [opMessages, addOPMessage] = useOptimistic<Message[], Message>(
    messages,
    (state, newMessage) => {
      return [...state, newMessage];
    }
  );

  const sendMessage = async (message: string) => {
    try {
      const response = await axios.post<{ content: string }>('/api/chat', {
        content: message,
      });
      return response.data.content;
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  /**
   * Handles the POST and UI update when submitting the new input
   * @param formData from the TextArea
   */
  const updateMessage = async (formData: FormData) => {
    const content = formData.get('messageInput') as string;
    if (!content) return;
    const id = crypto.randomUUID();
    const messageInput: Message = {
      role: 'user',
      content: content,
      id: id,
    };
    addOPMessage(messageInput);
    try {
      const response: string | undefined = await sendMessage(messageInput.content);
      if (response) {
        const llmMessage: Message = {
          role: 'assistant',
          content: response,
          id: id,
        };
        setMessages((prevMessages) => [...prevMessages, messageInput, llmMessage]);
      }
    } catch (error) {
      console.error('Error updating chat:', error);
    }
  };

  return (
    <div className="flex w-full flex-grow flex-col items-center justify-between space-y-2 p-4">
      <ConversationBox messageList={opMessages} />
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
