import { useState, useEffect, useRef } from 'react';

const useListDropMenu = () => {
  const [dropMenuState, setDropMenuState] = useState<boolean>(false);
  const [menuPos, setMenuPos] = useState<number>(0);
  const [activeListItem, setActiveListItem] = useState<string | undefined>(undefined); // name or id of the clicked list item
  const focusRef = useRef<HTMLDivElement>(null); // reference to the dropdown menu, used to detect clicks outside the menu

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (focusRef.current && !focusRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (itemId: string, clickBottom: number) => {
    setDropMenuState(!dropMenuState);
    setMenuPos(clickBottom);
    setActiveListItem(itemId);
  };

  const closeMenu = () => {
    setDropMenuState(false);
    setActiveListItem(undefined);
    setMenuPos(0);
  };

  return {
    dropMenuState,
    menuPos,
    activeListItem,
    focusRef,
    toggleMenu,
    closeMenu,
  };
};

export default useListDropMenu;
