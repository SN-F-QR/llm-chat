import { MessageCirclePlus, PanelLeftClose, TriangleAlert } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useDashboardStore } from '../service/chatState';
import { useStore } from '../service/chatState';
import React, { useEffect } from 'react';

import useChatList from '../hooks/useChatList';
import { ChatListItem } from './ChatListItem';

const ChatListBar: React.FC<{ scrollRef: React.RefObject<HTMLDivElement | null> }> = ({
  scrollRef,
}) => {
  const { chatid } = useParams<{ chatid: string }>();
  const location = useLocation();

  const isCreatingNewChat = useStore((state) => state.isCreatingNewChat);
  const { chatsQuery, renameChat, deleteChat } = useChatList(); // manage list and delete chat

  const expandState = useDashboardStore((state) => state.expandChatList);
  const setExpandState = useDashboardStore((state) => state.setExpand);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpandState(false);
        return;
      }
      setExpandState(true);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: -scrollRef.current.scrollHeight,
      });
    }
  }, [chatsQuery.isSuccess, scrollRef]);

  const navigate = useNavigate();
  const handleChatClick = (publicId: string) => {
    void navigate(`/${publicId}`);
  };

  const chatListComponents = chatsQuery.data?.map((chat) => (
    <ChatListItem
      key={chat.publicId}
      title={chat.title}
      publicId={chat.publicId}
      isActive={chatid === chat.publicId}
      navigate={handleChatClick}
      onRename={(title) => renameChat.mutate({ publicId: chat.publicId, title })}
      onDelete={() => deleteChat.mutate(chat.publicId)}
    />
  ));

  return (
    <div
      className={`enable-animation z-10 h-svh bg-purple-50 pt-10 duration-200 ${expandState ? 'translate-x-0' : 'w-0 -translate-x-96'}`}
    >
      <div className="mt-2 flex h-full w-72 flex-col p-2 pr-0 md:relative">
        <ChatListItem
          title="Start a new chat"
          publicId=""
          isActive={location.pathname === '/'}
          navigate={handleChatClick}
        >
          <MessageCirclePlus className="mr-1 size-5 text-gray-700" />
        </ChatListItem>
        <span className="my-2 w-64 place-self-center border-b border-gray-300"></span>

        <div
          ref={scrollRef}
          className="scrollbar mb-8 flex h-full flex-col-reverse items-start space-y-1 overflow-auto first:mt-2"
        >
          <div className="min-h-8 grow"></div>
          {chatListComponents}

          {chatsQuery.isError && <ErrorMessage message={chatsQuery.error.message} />}
          {isCreatingNewChat && (
            /* eslint-disable-next-line */
            <ChatListItem title="" publicId="" isActive={true} navigate={() => {}}>
              <span className="my-2 h-2 w-full animate-pulse place-self-center rounded-xl bg-gray-400" />
            </ChatListItem>
          )}
          <h2 className="mt-2 mb-1 px-2 text-sm text-gray-500">Recent chats</h2>
        </div>
        <button
          className="absolute bottom-0 left-0 mx-4 my-4 size-5 cursor-pointer text-gray-400"
          onClick={() => setExpandState(!expandState)}
        >
          <PanelLeftClose className="size-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <span className="ml-4 flex items-center space-x-2 text-red-400">
      <TriangleAlert className="size-4" />
      <p className="text-sm">{message}</p>
    </span>
  );
};

export default ChatListBar;
