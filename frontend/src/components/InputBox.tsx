import { SendHorizontal, CircleStop, Bot } from 'lucide-react';
import { useRef, useState } from 'react';
import { useStore } from '../service/chatState';
import SelectForm from './SelectForm';
import { models, type BaseModel } from '../service/models';

const InputBox: React.FC<{
  submitFunc: (arg: string) => void;
  waiting: boolean;
  currentModel?: string;
  setModel?: (model: string) => void;
  prompts?: Record<string, BaseModel>;
  currentPrompt?: string;
  setPrompt?: (prompt: string) => void;
}> = ({ submitFunc, waiting, currentModel, setModel, prompts, currentPrompt, setPrompt }) => {
  const [text, setText] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);

  const aborter = useStore((state) => state.abortController);
  const resetAborter = useStore((state) => state.resetAbort);

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
      if (text.trim() === '' || waiting) {
        return;
      }
      if (textAreaRef.current) {
        textAreaRef.current.value = '';
        textAreaRef.current.style.height = 'auto';
      }
      submitFunc(text);
      setText('');
    } catch {
      console.error('Error submitting message:', text);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-lg shadow-purple-100 backdrop-blur-3xl">
      <div className="flex max-h-72 min-h-20 w-full flex-col justify-between">
        <textarea
          ref={textAreaRef}
          name="messageInput"
          placeholder={'Input your message here'}
          onChange={handleTextInput}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="mb-2 grow resize-none overflow-y-auto pr-2 font-sans placeholder:text-gray-400 placeholder:italic focus:outline-none"
        ></textarea>
        <span className="flex items-end justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <ModelSelection
              currentModel={currentModel}
              setModel={setModel}
              listWidth="w-72"
              options={models}
            />
            <ModelSelection
              currentModel={currentPrompt}
              setModel={setPrompt}
              listWidth="w-48"
              options={prompts}
              buttonContent={
                <Bot
                  className={`size-4 text-gray-600 ${currentPrompt === 'default-prompt' ? 'text-gray-600' : 'text-purple-500'}`}
                />
              }
            />
          </div>

          {waiting ? (
            <button
              onClick={() => {
                console.log('User stopped generating');
                aborter.abort();
                resetAborter();
              }}
            >
              <div className="cursor-pointer rounded-full bg-purple-200 p-2">
                <CircleStop className="size-5 text-gray-400" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleSubmit()}
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

/**
 * Become select form when setModel is provided, or just display the current model name
 * @param currentModel - The current model 'value' (key)
 * @param setModel - Optional function to set the model, if provided, it will render a select form
 */
const ModelSelection: React.FC<{
  currentModel?: string;
  setModel?: (model: string) => void;
  options?: Record<string, BaseModel>;

  listWidth?: string;
  buttonContent?: React.ReactNode;
}> = ({ currentModel, setModel, options, listWidth, buttonContent }) => {
  if (currentModel && options) {
    return (
      <div>
        {!setModel ? (
          <p className="rounded-full bg-purple-200 px-2 py-1 text-xs text-gray-800 select-none">
            {buttonContent ?? options[currentModel]?.name ?? '...'}
          </p>
        ) : (
          <SelectForm
            className="text-xs"
            formName="model"
            value={currentModel}
            onChange={setModel}
            options={options}
            listWidth={listWidth}
            buttonContent={buttonContent}
          />
        )}
      </div>
    );
  }
};
