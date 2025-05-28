import { SendHorizontal, CircleStop } from 'lucide-react';
import { useRef, useState } from 'react';

const InputBox: React.FC<{
  submitFunc: (arg: string) => void;
  waiting: boolean;
}> = ({ submitFunc, waiting }) => {
  const [text, setText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const aborter = useRef<AbortController>(new AbortController());

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = () => {
    console.log('Submitting message:', text);
    try {
      setIsSubmitting(true);
      if (textAreaRef.current) {
        textAreaRef.current.value = '';
        textAreaRef.current.style.height = 'auto';
      }
      submitFunc(text);
    } catch {
      console.error('Error submitting message:', text);
    } finally {
      setText('');
      aborter.current = new AbortController();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-lg shadow-purple-100 backdrop-blur-3xl">
      <div className="flex max-h-72 min-h-20 w-full flex-col justify-between overflow-hidden">
        <textarea
          ref={textAreaRef}
          name="messageInput"
          placeholder={'Input your message here'}
          onChange={handleTextInput}
          className="mb-2 grow resize-none overflow-y-auto pr-2 font-sans placeholder:text-gray-400 placeholder:italic focus:outline-none"
        ></textarea>
        <span className="flex items-center justify-between">
          <span></span>
          {isSubmitting ? (
            <button
              onClick={() => {
                console.log('User stopped generating');
                aborter.current.abort();
              }}
            >
              <div className="overflow-hidden rounded-full bg-purple-200 p-2">
                <CircleStop className="size-5 text-gray-400" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => void handleSubmit()}
              disabled={waiting || text.trim() === ''}
              className="rounded-full bg-purple-200 p-2 transition-all duration-300 disabled:pointer-events-none disabled:translate-y-1 disabled:opacity-0"
            >
              <SendHorizontal className="size-5 cursor-pointer text-gray-500" />
            </button>
          )}
        </span>
      </div>
    </div>
  );
};
export default InputBox;
