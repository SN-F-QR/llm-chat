import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Ellipsis, Pen, Trash2 } from 'lucide-react';

export const ChatListItem: React.FC<{
  title: string;
  publicId: string;
  isActive: boolean;
  navigate: (string: string) => void;
  onRename?: (title: string) => void;
  onDelete?: () => void;
  //openDropMenu?: (publicId: string, clickBottom: number) => void;
  children?: React.ReactNode;
}> = ({ title, publicId, isActive, navigate, children, onRename, onDelete }) => {
  const handleRenameSubmit = (data: FormData) => {
    const title = data.get('title') as string;
    if (title.trim() === '') {
      return;
    }
    onRename?.(title);
  };

  return (
    <span className="group relative w-full px-2">
      <span
        className={`${isActive ? 'bg-purple-200' : ''} group flex w-full items-center rounded-3xl px-4 hover:bg-purple-200`}
      >
        <button
          className={`flex w-full cursor-pointer items-center justify-start py-2`}
          onClick={() => {
            navigate(publicId);
          }}
        >
          {children}
          <p className="line-clamp-1 text-left text-sm">{title}</p>
        </button>

        {onRename && onDelete && (
          // <Dialog> should include dropdown menu when combining usage
          <Dialog>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100" asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 rounded-full hover:bg-purple-300"
                >
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="text-xs">
                    <Pen className="size-4" />
                    Rename
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem className="text-xs" onClick={onDelete}>
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename the chat</DialogTitle>
                <DialogDescription>Enter a new name for the chat.</DialogDescription>
                <form action={handleRenameSubmit}>
                  <Input name="title" defaultValue={title} />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="submit"
                        className="mt-2 cursor-pointer bg-purple-500 hover:bg-purple-400"
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </span>

      {/* Full title shown on hover */}
      <div className="hidden group-hover:block">
        <FullTitle title={title} />
      </div>
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
