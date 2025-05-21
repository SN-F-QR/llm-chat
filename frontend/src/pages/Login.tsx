import { User, Key } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import reqClient from '../service/requestClient';

const Login = () => {
  const navigate = useNavigate();
  const [invalidMessage, setInvalidMessage] = useState<string>('');
  const handleLogin = async (data: FormData) => {
    const stuNum = data.get('stuNum');
    const password = data.get('password');
    if (typeof stuNum === 'string' && typeof password === 'string') {
      if (stuNum.length !== 8) {
        setInvalidMessage('Student number must be 8 digits');
        return;
      }
      if (password.length < 8) {
        setInvalidMessage('Password must be at least 8 characters');
        return;
      }

      try {
        const state = await reqClient.login(stuNum, password);
        if (state) {
          void navigate('/');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = `${error.response?.statusText}:${error.response?.data}`;
          console.error('Error logging in:', errorMessage);
          setInvalidMessage(errorMessage);
        }
      }
    } else {
      setInvalidMessage('Invalid input');
      return;
    }
  };

  return (
    <div className="min-h-dvh max-w-xl place-content-center self-center p-4">
      <div className="items-center rounded-xl border border-gray-200 px-8 py-8 shadow sm:flex">
        <div className="flex place-content-center sm:mr-8">
          <img className="size-24 object-cover p-2" src="/logo.jpeg" />
        </div>
        {/*Login input field */}
        <div className="flex flex-col items-center">
          <form action={handleLogin} className="flex flex-col items-center justify-evenly py-2">
            <FormInput name="stuNum" placeholder="student number">
              <User className="mr-2 size-6" />
            </FormInput>
            <FormInput name="password" placeholder="password">
              <Key className="mr-2 size-6" />
            </FormInput>

            {invalidMessage.length > 0 && <p className="text-sm text-pink-500">{invalidMessage}</p>}

            <button
              type="submit"
              className="mt-4 cursor-pointer rounded-2xl bg-purple-400 px-4 py-2 text-white shadow-md"
            >
              Login
            </button>
          </form>
          <button
            className="cursor-pointer text-sm hover:underline"
            onClick={() => void navigate('/auth/signup')}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export const FormInput: React.FC<{ children: ReactNode; name: string; placeholder: string }> = ({
  children,
  name,
  placeholder,
}) => {
  const formType = name === 'password' ? 'password' : 'text';
  const autoComplete = name === 'password' ? 'current-password' : 'on';

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

export default Login;
