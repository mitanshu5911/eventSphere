import React from 'react'
import Index from './components/index'
import Header from './common/Header'
import Signup from './common/Signup/Signup'
import Footer from './common/Footer'
import Login from './common/Login/Login'
import { Route, Routes } from 'react-router-dom'
import CustomerDashBoard from './components/customer/CustomerDashBoard'
import EventManagerDashBoard from './components/eventManager/EventManagerDashBoard'
import EventManagerProfile from './components/eventManager/EventManagerProfile'
function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/customer-dashboard' element={<CustomerDashBoard/>} />
        <Route path = '/event-manager-dashboard' element= {<EventManagerDashBoard/>} />
        <Route path = '/event-manager-profile' element = {<EventManagerProfile/>}/>
      </Routes>
      <Footer/>
    </>
    
  )
}

export default App