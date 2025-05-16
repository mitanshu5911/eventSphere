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
import SearchEventManager from './components/customer/SearchEventManager'
import CheckBooking from './components/eventManager/CheckBooking'

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
        <Route path='/search_event_manager' element = {<SearchEventManager/>}/>
        <Route path='checkbookings' element = {<CheckBooking/>}/>
      </Routes>
      <Footer/>
    </>
    
  )
}

export default App