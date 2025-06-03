import { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';

const SelectForm: React.FC<{
  className?: string;
  formName: string;
  value: string;
  onChange?: (value: string) => void;
  options: Record<string, { name: string; description?: string }>;
}> = ({ className, formName, value, onChange, options }) => {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const currentOptionName = options[value].name;

  return (
    <div className={`relative ${className}`}>
      <button
        className="line-clamp-1 flex items-center justify-between rounded-full bg-purple-200 px-2 py-1 text-gray-800"
        onClick={() => {
          setIsSelecting(!isSelecting);
        }}
      >
        {currentOptionName}
        <ChevronsUpDown className="ml-1 size-3" />
      </button>
      {isSelecting && (
        <OptionList>
          {Object.keys(options).map((optionValue) => (
            <OptionItem
              key={`${formName}-${optionValue}`}
              onClick={() => {
                setIsSelecting(false);
                // setCurrentOptionName(options[optionValue].name);
                if (onChange) {
                  onChange(optionValue);
                }
              }}
            >
              <div className="flex w-full items-center justify-between space-x-2">
                <div className="flex flex-col text-left">
                  {options[optionValue].name}
                  {options[optionValue].description && (
                    <span className="text-left text-xs text-gray-500">
                      {options[optionValue].description}
                    </span>
                  )}
                </div>
                {optionValue === value && <Check className="size-4 shrink-0 text-purple-500" />}
              </div>
            </OptionItem>
          ))}
        </OptionList>
      )}
    </div>
  );
};

const OptionList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="absolute z-10 mb-8 w-full rounded-lg border border-purple-200 bg-white py-1"
      style={{ bottom: '0' }}
    >
      {children}
    </div>
  );
};

const OptionItem: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => {
  return (
    <button
      className="flex w-full flex-col items-start space-y-1 px-2 py-1 hover:bg-purple-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SelectForm;
