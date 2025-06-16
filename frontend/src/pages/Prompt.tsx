import usePromptList from '@/hooks/usePromptList';
import { Link } from 'react-router';
import { prompts } from '@/service/models';
import { Bot, Plus, Ellipsis, Pencil, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Prompt: React.FC = () => {
  const { promptsQuery, duplicatePrompt, deletePrompt } = usePromptList();
  return (
    <div className="scrollbar mt-12 flex max-h-[95dvh] w-full flex-col space-y-2 overflow-auto p-4">
      <span className="inline-flex items-center space-x-2">
        <Bot className="size-7 text-purple-500" />
        <h3 className="py-2 text-2xl">Prompt Setting</h3>
      </span>

      {/* Pre-defined Prompts */}
      <div className="flex w-full flex-col space-y-2 pb-4">
        <h4 className="text-xl">Explore Prompts</h4>
        <p className="text-xs text-gray-400 italic">Default prompt is empty.</p>
        {Object.keys(prompts).map((key) => (
          <PromptItem
            key={prompts[key].name}
            name={prompts[key].name}
            publicId=""
            content={prompts[key].content}
          />
        ))}
      </div>

      <div className="flex w-full flex-col space-y-2 pb-4">
        <span className="flex items-center justify-between">
          <h4 className="text-xl">Your Prompts</h4>
          <Button className="bg-purple-500 hover:bg-purple-400" size="sm" asChild>
            <Link to="/prompt/edit" className="flex items-center">
              <Plus className="mr-1" /> Create
            </Link>
          </Button>
        </span>
        {promptsQuery.data?.map((prompt) => (
          <PromptItem
            key={`prompt-${prompt.publicId}`}
            name={prompt.name}
            content={prompt.content}
            publicId={prompt.publicId}
            onDuplicate={() => duplicatePrompt(prompt.publicId)}
            onDelete={() => deletePrompt.mutate(prompt.publicId)}
          />
        ))}
      </div>
    </div>
  );
};

const PromptItem: React.FC<{
  name: string;
  content: string;
  publicId: string;
  onDuplicate?: () => void;
  onDelete?: () => void;
}> = ({ name, content, publicId, onDuplicate, onDelete }) => {
  return (
    <div className="enable-animation flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 select-none hover:bg-purple-100">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <h5 className="text-lg font-semibold">{name}</h5>
          <p className="line-clamp-2 text-sm text-gray-600">{content}</p>
        </div>
        {onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-200">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-2 w-32">
              <DropdownMenuItem asChild>
                <Link to={`/prompt/${publicId}`} className="flex items-center space-x-1">
                  <Pencil />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Prompt;
