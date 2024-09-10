import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Posts from './components/Posts';
import Post from './components/Post';
import WritePost from './components/WritePost';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Search from './components/Search';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/posts' element={<Posts />} />
          <Route path='/:id' element={<Post />} />
          <Route path='/write' element={<WritePost />} />
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/search' element={<Search/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
