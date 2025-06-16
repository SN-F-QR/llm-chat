import { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';

/**
 * @param className of the form container
 * @param listWidth width of the dropdown list, default is full width
 * @param buttonContent used to display the form activated button
 *
 * @param formName to identify the form (key)
 * @param value current selected value (key of options)
 * @param onChange function to call when the value changes
 * @param options a record of options for display the select form options
 */
const SelectForm: React.FC<{
  // style controls
  className?: string;
  listWidth?: string;
  buttonContent?: React.ReactNode;

  // form contents
  formName: string;
  value: string;
  onChange?: (value: string) => void;
  options: Record<string, { name: string; description?: string }>;
}> = ({ className, listWidth, buttonContent, formName, value, onChange, options }) => {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const currentOptionName = options[value]?.name ?? '...';

  return (
    <div className={`relative ${className}`}>
      <button
        className="line-clamp-1 flex items-center justify-between rounded-full bg-purple-200 px-2 py-1 text-gray-800"
        onClick={() => {
          setIsSelecting(!isSelecting);
        }}
      >
        {buttonContent ?? currentOptionName}
        <ChevronsUpDown className="ml-1 size-3" />
      </button>
      {isSelecting && (
        <OptionList width={listWidth}>
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

const OptionList: React.FC<{ children: React.ReactNode; width?: string }> = ({
  children,
  width,
}) => {
  const selfWidth = width ?? 'w-full';
  return (
    <div
      className={`absolute z-10 mb-8 ${selfWidth} rounded-lg border border-purple-200 bg-white py-1`}
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
