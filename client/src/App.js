import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tweet from './pages/Tweet';
import Tweets from './pages/Tweets';
import MainRoute from "./route/Public.js";
import Search from './pages/Search.js';
import UserTweets from "./pages/UserTweets.js";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='user' element={<MainRoute />}>
            <Route path='' element={<Tweets />} />
            <Route path='profile' element={<Profile />} />
            <Route path='tweet' element={<Tweet />} />
            <Route path='search' element={<Search />} />
            <Route path='user-tweet' element={<UserTweets />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
