import { MessageCirclePlus, PanelLeftClose } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import reqClient from '../service/requestClient';
import { AxiosError } from 'axios';

interface Chat {
  title: string;
  publicId: string;
  createdAt: string;
  lastUsedAt: string;
}

const ChatListBar = () => {
  const { chatid } = useParams<{ chatid: string }>();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!reqClient.isLogin) {
      return;
    }
    const fetchChats = async () => {
      try {
        const response = await reqClient.client.get<{ chats: Chat[] }>('/chat');
        const chats = response.data.chats;
        if (chats.length > 0) {
          setChats(chats);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Error fetching chat list:', error.message);
        } else {
          console.error('Unexpected error fetching chat list:', error);
        }
      }
    };
    void fetchChats();
  }, []);

  const navigate = useNavigate();
  const handleClick = (publicId: string) => {
    void navigate(`/${publicId}`);
  };

  const chatListComponents = chats.map((chat) => (
    <ChatListButton
      key={chat.publicId}
      title={chat.title}
      publicId={chat.publicId}
      isActive={chatid === chat.publicId}
      navigate={handleClick}
    />
  ));

  return (
    <div className="fixed top-0 left-0 z-10 h-svh max-w-lg bg-purple-100/50 pt-12">
      <div className="hidden h-full w-72 flex-col justify-between p-2 md:flex">
        <div className="flex-col items-start space-y-1 first:mt-2 md:flex">
          <ChatListButton
            title="Start a new chat"
            publicId=""
            isActive={chatid === ''}
            navigate={handleClick}
          >
            <MessageCirclePlus className="mr-1 size-5 text-gray-700" />
          </ChatListButton>
          <h2 className="mt-4 mb-1 px-2 text-sm text-gray-500">Recent chats</h2>
          {chatListComponents}
        </div>
        <PanelLeftClose className="mx-2 my-2 size-5 text-gray-500" />
      </div>
    </div>
  );
};

const ChatListButton: React.FC<{
  title: string;
  publicId: string;
  isActive: boolean;
  navigate: (string: string) => void;
  children?: React.ReactNode;
}> = ({ title, publicId, isActive, navigate, children }) => {
  return (
    <span
      className={`w-full rounded-2xl px-4 py-2 hover:bg-purple-200 ${isActive ? 'bg-purple-200' : ''}`}
    >
      <button
        className="flex h-6 w-full cursor-pointer items-center"
        onClick={() => {
          navigate(publicId);
        }}
      >
        {children}
        <p className="line-clamp-1">{title}</p>
      </button>
    </span>
  );
};

export default ChatListBar;
