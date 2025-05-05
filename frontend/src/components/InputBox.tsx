import { SendHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';

const InputBox: React.FC<{ submitFunc: (arg: string) => Promise<void> }> = ({ submitFunc }) => {
  const [text, setText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting message:', text);
    try {
      setIsSubmitting(true);
      if (textAreaRef.current) {
        textAreaRef.current.value = '';
        textAreaRef.current.style.height = 'auto';
      }
      await submitFunc(text);
    } catch {
      console.error('Error submitting message:', text);
    } finally {
      setText('');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-gray-200 p-4 shadow-sm">
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
          <button onClick={() => void handleSubmit()} disabled={isSubmitting}>
            <SendHorizontal className="size-8 cursor-pointer rounded-lg bg-purple-500 p-1 text-white" />
          </button>
        </span>
      </div>
    </div>
  );
};
export default InputBox;
