import React from 'react'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import AuthSuccess from "./components/AuthSuccess";
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div>
     <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={   <Home/>}/>
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
