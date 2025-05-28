import { MessageCirclePlus, PanelLeftClose } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { IChat } from '../types/types';
import reqClient from '../service/requestClient';
import { TriangleAlert } from 'lucide-react';

const ChatListBar = () => {
  const { chatid } = useParams<{ chatid: string }>();

  const chatsQuery = useQuery<IChat[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      if (!reqClient.isLogin) {
        throw new Error('User is not logged in');
      }
      const response = await reqClient.client.get<{ chats: IChat[] }>('/chat');
      return response.data.chats;
    },
  });

  const navigate = useNavigate();
  const handleClick = (publicId: string) => {
    void navigate(`/${publicId}`);
  };

  const chatListComponents = chatsQuery.data?.map((chat) => (
    <ChatListButton
      key={chat.publicId}
      title={chat.title}
      publicId={chat.publicId}
      isActive={chatid === chat.publicId}
      navigate={handleClick}
    />
  ));

  return (
    <div className="fixed top-0 left-0 z-10 h-svh max-w-lg bg-purple-100/50 pt-10">
      <div className="hidden h-full w-72 flex-col justify-between p-2 pr-0 md:relative md:flex">
        <div className="scrollbar mb-8 flex-col items-start space-y-1 overflow-auto first:mt-2 md:flex">
          <ChatListButton
            title="Start a new chat"
            publicId=""
            isActive={chatid === undefined}
            navigate={handleClick}
          >
            <MessageCirclePlus className="mr-1 size-5 text-gray-700" />
          </ChatListButton>
          <h2 className="mt-2 mb-1 px-2 text-sm text-gray-500">Recent chats</h2>
          {chatListComponents}
          {chatsQuery.isError && <ErrorMessage message={chatsQuery.error.message} />}
        </div>
        <PanelLeftClose className="absolute bottom-0 left-0 mx-4 my-4 size-5 text-gray-500" />
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
    <span className="w-full px-2">
      <button
        className={`flex w-full cursor-pointer items-center rounded-2xl px-4 py-2 hover:bg-purple-200 ${isActive ? 'bg-purple-200' : ''} justify-start`}
        onClick={() => {
          navigate(publicId);
        }}
      >
        {children}
        <p className="line-clamp-1 text-left">{title}</p>
      </button>
    </span>
  );
};

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <span className="flex items-center space-x-2 text-red-400">
      <TriangleAlert className="size-4" />
      <p className="text-sm">{message}</p>
    </span>
  );
};

export default ChatListBar;
