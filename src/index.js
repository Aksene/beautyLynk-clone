import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import BookNow from './pages/BookNow';
import Advisor from './pages/Advisor'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home/>}/>
      <Route path={"professionals"} element={<App/>}/>
      <Route path={"book-now"} element={<BookNow/>}/>
      <Route path={"book-now/:type"} element={<BookNow/>}/>
      <Route path={"advisor"} element={<Advisor/>}/>
      {/* <Route path={"advisorHTML"} element={<AdvisorHtml/>}/> */}
    </Routes>
  </BrowserRouter>
);
