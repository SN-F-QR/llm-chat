const SelectForm: React.FC<{
  formName: string;
  onChange?: (value: string) => void;
  options: { name: string; value: string; description?: string }[];
}> = ({ formName, onChange, options }) => {
  const optionList = options.map((option) => (
    <option key={`${formName}-${option.name}`} value={option.value}>
      {option.name}
    </option>
  ));

  return (
    <select
      name={formName}
      className="justify-items-end place-self-end rounded-full px-2 py-1 text-xs focus:outline-none sm:max-w-48"
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
    >
      {optionList}
    </select>
  );
};

export default SelectForm;
