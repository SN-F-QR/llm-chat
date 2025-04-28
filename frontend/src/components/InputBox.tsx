import { SendHorizontal } from 'lucide-react';
import { useRef } from 'react';

const InputBox = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="max-h-72 min-h-24 w-full max-w-xl rounded-2xl border border-gray-200 p-4 shadow-sm">
      <form className="flex h-full w-full flex-col justify-between">
        <textarea
          ref={textAreaRef}
          name="messageInput"
          placeholder={'Input your message here'}
          onChange={handleTextInput}
          className="mb-2 h-full grow resize-none overflow-y-auto pr-2 font-sans placeholder:text-gray-400 focus:outline-none"
        ></textarea>
        <span className="flex items-center justify-between">
          <span></span>
          <button type="submit" className="">
            <SendHorizontal className="size-8 cursor-pointer rounded-lg bg-purple-500 p-1 text-white" />
          </button>
        </span>
      </form>
    </div>
  );
};
export default InputBox;
