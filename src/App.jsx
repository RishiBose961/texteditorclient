import React from 'react'
import TextEditor from './TextEditor'
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'
import {v4 as uuidV4 } from 'uuid'
import Home from './Home'

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/documents/:id' element={<TextEditor/>}/>
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App