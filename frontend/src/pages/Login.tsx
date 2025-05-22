import { User, Key } from 'lucide-react';
import { useState, useReducer } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import reqClient from '../service/requestClient';
import InputForm, { FormItem } from '../components/InputForm';

const Login = () => {
  const navigate = useNavigate();
  const [invalidMessage, setInvalidMessage] = useState<string>('');

  const initLoginForm = {
    stuNum: '',
    password: '',
  };
  const loginFormReducer = (
    state: typeof initLoginForm,
    action: { type: string; value: string }
  ) => {
    switch (action.type) {
      case 'stuNum':
        return { ...state, stuNum: action.value };
      case 'password':
        return { ...state, password: action.value };
      default:
        throw new TypeError('Invalid action type to update form');
    }
  };
  const [loginFormState, dispatch] = useReducer(loginFormReducer, initLoginForm);

  const handleLogin = async () => {
    const { stuNum, password } = loginFormState;
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
        const errorMessage = error.response?.data as string;
        console.error('Error logging in:', errorMessage);
        setInvalidMessage(errorMessage);
      }
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
        <FormItem
          name="stuNum"
          placeholder="student number"
          displayValue={loginFormState.stuNum}
          onChange={dispatch}
        >
          <User className="mr-2 size-6" />
        </FormItem>
        <FormItem
          name="password"
          placeholder="password"
          displayValue={loginFormState.password}
          onChange={dispatch}
        >
          <Key className="mr-2 size-6" />
        </FormItem>
      </InputForm>
    </div>
  );
};

export default Login;
