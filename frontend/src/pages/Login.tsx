import { User, Key } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

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
        const response = await axios.post<{ info: string; token: string }>('/api/auth/login', {
          stuNum: stuNum,
          password: password,
        });
        if (response.status === 200) {
          console.log(response.data.info);
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
        <div className="mr-8 flex place-content-center">
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
          <button className="text-md cursor-pointer">Sign up</button>
        </div>
      </div>
    </div>
  );
};

const FormInput: React.FC<{ children: ReactNode; name: string; placeholder: string }> = ({
  children,
  name,
  placeholder,
}) => {
  return (
    <label className="flex items-center px-4 py-2" htmlFor="username">
      {children}
      <input
        className="ml-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none sm:min-w-72"
        type="text"
        name={name}
        placeholder={placeholder}
      />
    </label>
  );
};

export default Login;
