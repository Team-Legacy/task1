import React from 'react'
import Navbar from 'components/Navbar'
import MainTabs from 'components/Home/MainTabs'
import Confirm from 'components/Home/Confirm';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from 'components/Footer';
import Homepage from 'components/Homepage';

export default function Home() {
  return (
    <>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<MainTabs />}/>
            <Route path="/confirm" element={<Confirm />}/>
            <Route path="/homepage" element={<Homepage />}/>
          </Routes>
        </Router>
        <Footer />
    </>
  )
}
