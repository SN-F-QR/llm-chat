import { useState, useReducer } from 'react';
import reqClient from '../service/requestClient';
import InputForm, { FormItem } from '../components/InputForm';
import { IUser } from '../types/types';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';

const SignUp = () => {
  const navigate = useNavigate();
  const [invalidMessage, setInvalidMessage] = useState<string>('');

  const initForm = {
    name: '',
    password: '',
    password2: '',
    stuNum: '',
  };

  const formReducer = (state: typeof initForm, action: { type: string; value: string }) => {
    switch (action.type) {
      case 'name':
        return { ...state, name: action.value };
      case 'password':
        return { ...state, password: action.value };
      case 'password2':
        return { ...state, password2: action.value };
      case 'stuNum':
        return { ...state, stuNum: action.value };
      default:
        throw new TypeError('Invalid action type to update form');
    }
  };

  const [formState, dispatch] = useReducer(formReducer, initForm);

  const handleSignUp = async (data: FormData) => {
    const { name, password, password2, stuNum } = formState;
    if (name.length < 5) {
      setInvalidMessage('Name must be at least 5 characters');
      return;
    }
    if (password.length < 8) {
      setInvalidMessage('Password must be at least 8 characters');
      return;
    }
    if (password !== password2) {
      setInvalidMessage('Passwords do not match');
      return;
    }
    if (stuNum.length !== 8) {
      setInvalidMessage('Student number must be 8 digits');
      return;
    }

    try {
      const response = await reqClient.client.post<{ info: IUser; token: string }>('/user', {
        name: name,
        password: password,
        stuNum: stuNum,
        department: data.get('department'),
      });
      const { info } = response.data;
      const state = await reqClient.login(info.stuNum, password);
      if (state) {
        void navigate('/');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = `${error.response?.statusText} - ${error.response?.data}`;
        console.error('Error signing up:', errorMessage);
        setInvalidMessage(error.response?.data as string);
      }
    }
  };

  return (
    <div className="min-h-dvh max-w-xl place-content-center self-center p-4">
      <InputForm
        title="Sign Up"
        action={handleSignUp}
        invalidMessage={invalidMessage}
        submitButtonName="Sign Up"
        cancelComponent={
          <div className="flex items-center text-sm">
            <p className="mr-2">Already have an account?</p>
            <button
              className="text-md cursor-pointer text-purple-400 hover:underline"
              onClick={() => void navigate('/auth')}
            >
              Log in
            </button>
          </div>
        }
      >
        <FormItem
          name="name"
          placeholder="Your full name"
          displayValue={formState.name}
          onChange={dispatch}
        >
          <p className="mr-2 flex-grow">Name</p>
        </FormItem>
        <FormItem
          name="password"
          placeholder="Your password"
          displayValue={formState.password}
          onChange={dispatch}
        >
          <p className="mr-2 flex-grow">Password</p>
        </FormItem>
        <FormItem
          name="password2"
          placeholder="Confirm your password"
          displayValue={formState.password2}
          onChange={dispatch}
        >
          <p className="mr-2 flex-grow"></p>
        </FormItem>
        <FormItem
          name="stuNum"
          placeholder="Your student number"
          displayValue={formState.stuNum}
          onChange={dispatch}
        >
          <p className="mr-2 flex-grow">Student Number</p>
        </FormItem>
        <label className="w-full items-center px-4 py-2">
          <p className="mb-2">Department</p>
          <select
            name="department"
            className="w-full flex-1/2 rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none sm:min-w-72"
          >
            <option value="CS">Computer Science</option>
            <option value="Others">Others</option>
          </select>
        </label>
      </InputForm>
    </div>
  );
};

export default SignUp;
