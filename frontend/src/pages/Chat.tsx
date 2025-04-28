import InputBox from '../components/InputBox';
import ConversationBox from '../components/ConversationBox';

const Chat = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-evenly space-y-2 p-4">
      <ConversationBox />
      <InputBox />
    </div>
  );
};

export default Chat;
