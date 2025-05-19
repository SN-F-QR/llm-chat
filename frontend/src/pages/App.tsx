import Dashboard from './Dashboard';
import Login from './Login';
import Chat from './Chat';
import { BrowserRouter, Routes, Route } from 'react-router';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-dvh w-full flex-col overflow-auto">
        <div className="flex w-full flex-grow flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Chat />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
