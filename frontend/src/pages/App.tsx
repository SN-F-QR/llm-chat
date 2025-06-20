import Dashboard from './Dashboard';
import Auth from './Auth';
import Login from './Login';
import SignUp from './Signup';
import NewChat from './NewChat';
import Chat from './Chat';
import Prompt from './Prompt';
import PromptEdit from './PromptEdit';
import { BrowserRouter, Routes, Route } from 'react-router';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-dvh w-full flex-col">
        <div className="flex w-full flex-grow flex-col">
          <Routes>
            <Route path="/auth" element={<Auth />}>
              <Route index element={<Login />} />
              <Route path="signup" element={<SignUp />} />
            </Route>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<NewChat />} />
              <Route path=":chatid" element={<Chat />} />
              <Route path="prompt" element={<Prompt />} />
              <Route path="/prompt/:promptid" element={<PromptEdit />} />
              <Route path="/prompt/edit" element={<PromptEdit />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
