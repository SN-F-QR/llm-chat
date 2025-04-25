import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const testGet = async () => {
      try {
        const res = await axios.get<{ message: string }>('/api');
        setMessage(res.data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };
    testGet();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl text-pink-500">Welcome to the LLM chat</h1>
        <p className="">Server status: {message}</p>
      </div>
    </>
  );
};

export default App;
