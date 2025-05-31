import { MessageCirclePlus, PanelLeftClose } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { TriangleAlert, Ellipsis } from 'lucide-react';
import { useDashboardStore } from '../service/chatState';
import { useStore } from '../service/chatState';
import React, { use, useEffect } from 'react';

import useListDropMenu from '../hooks/useDropMeun';
import EditMenu from '../components/DropMenu';

import useChatList from '../hooks/useChatList';

const ChatListBar: React.FC<{ scrollRef: React.RefObject<HTMLDivElement | null> }> = ({
  scrollRef,
}) => {
  const { chatid } = useParams<{ chatid: string }>();

  const isCreatingNewChat = useStore((state) => state.isCreatingNewChat);
  const { dropMenuState, menuPos, activeListItem, focusRef, toggleMenu, closeMenu } =
    useListDropMenu();
  const { chatsQuery, chatsMutations } = useChatList(); // manage list and delete chat

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
    <ChatListButton
      key={chat.publicId}
      title={chat.title}
      publicId={chat.publicId}
      isActive={chatid === chat.publicId}
      navigate={handleChatClick}
      openDropMenu={toggleMenu}
    />
  ));

  const dropMenuFcList = {
    Rename: () => console.log('rename', activeListItem),
    Delete: () => {
      if (!activeListItem) return;
      chatsMutations.mutate(activeListItem);
      if (chatid === activeListItem) {
        void navigate('/');
      }
    },
  };

  return (
    <div
      className={`enable-animation z-10 h-svh bg-purple-100/50 pt-10 duration-200 ${expandState ? 'translate-x-0' : 'w-0 -translate-x-96'}`}
    >
      <div className="mt-2 flex h-full w-72 flex-col p-2 pr-0 md:relative">
        <ChatListButton
          title="Start a new chat"
          publicId=""
          isActive={chatid === undefined}
          navigate={handleChatClick}
        >
          <MessageCirclePlus className="mr-1 size-5 text-gray-700" />
        </ChatListButton>
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
            <ChatListButton title="" publicId="" isActive={true} navigate={() => {}}>
              <span className="my-2 h-2 w-full animate-pulse place-self-center rounded-xl bg-gray-400" />
            </ChatListButton>
          )}
          <h2 className="mt-2 mb-1 px-2 text-sm text-gray-500">Recent chats</h2>
        </div>
        <button
          className="absolute bottom-0 left-0 mx-4 my-4 size-5 cursor-pointer text-gray-500"
          onClick={() => setExpandState(!expandState)}
        >
          <PanelLeftClose className="size-5 text-gray-500" />
        </button>

        {dropMenuState && activeListItem && (
          <EditMenu
            ref={focusRef}
            topPos={menuPos}
            DropFcList={dropMenuFcList}
            onClick={closeMenu}
          />
        )}
      </div>
    </div>
  );
};

// The button for each chat
const ChatListButton: React.FC<{
  title: string;
  publicId: string;
  isActive: boolean;
  navigate: (string: string) => void;
  openDropMenu?: (publicId: string, clickBottom: number) => void;
  children?: React.ReactNode;
}> = ({ title, publicId, isActive, navigate, children, openDropMenu }) => {
  const handleDropButtonClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!openDropMenu) return;
    openDropMenu(publicId, rect.bottom);
  };

  return (
    <span className="group relative w-full px-2">
      <span
        className={`${isActive ? 'bg-purple-200' : ''} group flex w-full items-center rounded-2xl px-4 hover:bg-purple-200`}
      >
        <button
          className={`flex w-full cursor-pointer items-center justify-start py-2`}
          onClick={() => {
            navigate(publicId);
          }}
        >
          {children}
          <p className="line-clamp-1 text-left">{title}</p>
        </button>

        {openDropMenu && (
          <button
            className="ml-auto hidden size-6 shrink-0 items-center justify-center rounded-full group-hover:flex hover:bg-purple-300"
            onClick={handleDropButtonClick}
          >
            <Ellipsis className="size-4 text-gray-500" />
          </button>
        )}
      </span>
      {openDropMenu && (
        <div className="hidden group-hover:block">
          <FullTitle title={title} />
        </div>
      )}
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

const FullTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <span className="absolute z-20 mt-1 mr-2 rounded-md bg-gray-700 px-2 py-1 text-xs text-white">
      {title}
    </span>
  );
};

export default ChatListBar;
