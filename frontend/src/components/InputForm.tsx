import { ReactNode } from 'react';

interface FormInputProps {
  children: ReactNode;
  title: string;
  action?: (data: FormData) => Promise<void>;
  invalidMessage?: string;
  submitButtonName?: string;
  cancelComponent?: ReactNode;
}

const InputForm: React.FC<FormInputProps> = ({
  children,
  title,
  action,
  submitButtonName,
  invalidMessage,
  cancelComponent,
}) => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 px-4 py-2 shadow">
      <div className="flex place-content-center items-center sm:mr-8">
        <img className="size-16 object-cover p-2" src="/logo.jpeg" />
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      {/*Login input field */}
      <div className="flex flex-col items-center">
        <form action={action} className="flex flex-col items-center justify-evenly py-2">
          {children}

          {invalidMessage && <p className="text-sm text-pink-500">{invalidMessage}</p>}

          <button
            type="submit"
            className="mt-2 cursor-pointer rounded-2xl bg-purple-400 px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105"
          >
            {submitButtonName ?? 'Submit'}
          </button>
        </form>
        {cancelComponent}
      </div>
    </div>
  );
};

export const FormItem: React.FC<{ children: ReactNode; name: string; placeholder: string }> = ({
  children,
  name,
  placeholder,
}) => {
  const isPassword = name.includes('password');
  const formType = isPassword ? 'password' : 'text';
  const autoComplete = isPassword ? 'current-password' : 'on';

  return (
    <label className="flex w-full items-center px-4 py-2" htmlFor={name}>
      {children}
      <input
        id={name}
        className="ml-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none sm:min-w-72"
        type={formType}
        autoComplete={autoComplete}
        name={name}
        placeholder={placeholder}
      />
    </label>
  );
};

export default InputForm;
