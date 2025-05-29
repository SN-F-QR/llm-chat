const EditMenu: React.FC<{
  ref: React.RefObject<HTMLDivElement | null>;
  topPos: number;
  handleDelete: () => void;
}> = ({ ref, topPos, handleDelete }) => {
  return (
    <div
      ref={ref}
      className="fixed right-4 z-20 mt-3 flex min-w-24 flex-col justify-items-center space-y-1 overflow-hidden rounded-2xl border border-purple-200 bg-purple-100 py-1 text-sm text-gray-700 shadow-xl"
      style={{ top: `${topPos}px` }}
    >
      <button className="px-2 py-1 hover:bg-purple-200" onClick={handleDelete}>
        Rename
      </button>
      <button className="px-2 py-1 hover:bg-purple-200" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default EditMenu;
