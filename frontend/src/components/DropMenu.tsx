import { Trash2, PenLine, FolderHeart } from 'lucide-react';

/**
 * A dropdown menu component for editing items.
 * @param ref - A reference to the dropdown menu element.
 * @param topPos - The distance to from top of menu to the screen edge.
 * @param DropFcList - A record of functions to be executed when a menu item is clicked.
 * @param onClick - An optional callback function to be called when a menu item is clicked.
 */
const EditMenu: React.FC<{
  ref: React.RefObject<HTMLDivElement | null>;
  topPos: number;
  DropFcList: Record<string, () => void>;
  onClick?: () => void;
}> = ({ ref, topPos, DropFcList, onClick }) => {
  const DropLists = Object.keys(DropFcList).map((key) => {
    const iconStyle = 'size-4 mr-1';
    let Icon;
    switch (key.toLowerCase()) {
      case 'delete':
        Icon = <Trash2 className={iconStyle} />;
        break;
      case 'rename':
        Icon = <PenLine className={iconStyle} />;
        break;
      case 'favorite':
        Icon = <FolderHeart className={iconStyle} />;
        break;
      default:
        Icon = undefined;
    }

    return (
      <button
        key={`drop-menu-list-${key}`}
        className="flex w-full items-center px-2 py-1 hover:bg-purple-200"
        onClick={() => {
          DropFcList[key]();
          if (onClick) {
            onClick();
          }
        }}
      >
        {Icon}
        {key}
      </button>
    );
  });

  return (
    <div
      ref={ref}
      className="fixed right-4 z-20 mt-3 flex min-w-24 flex-col space-y-1 overflow-hidden rounded-lg border border-purple-200 bg-purple-100 py-1 text-sm text-gray-700 shadow-sm"
      style={{ top: `${topPos}px` }}
    >
      {DropLists}
    </div>
  );
};

export default EditMenu;
