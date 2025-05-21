import { User, Key } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import reqClient from '../service/requestClient';
import InputForm, { FormItem } from '../components/InputForm';

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
      <InputForm
        action={handleLogin}
        title="LLM Chat"
        invalidMessage={invalidMessage}
        submitButtonName="Login"
        cancelComponent={
          <span className="flex space-x-1 text-sm">
            <p>Don't have an account?</p>
            <button
              className="cursor-pointer text-purple-400 hover:underline"
              onClick={() => void navigate('/auth/signup')}
            >
              Sign up
            </button>
          </span>
        }
      >
        <FormItem name="stuNum" placeholder="student number">
          <User className="mr-2 size-6" />
        </FormItem>
        <FormItem name="password" placeholder="password">
          <Key className="mr-2 size-6" />
        </FormItem>

        {invalidMessage.length > 0 && <p className="text-sm text-pink-500">{invalidMessage}</p>}
      </InputForm>
    </div>
  );
};

export default Login;
