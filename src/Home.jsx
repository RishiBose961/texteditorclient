import React from 'react'
import { useNavigate } from 'react-router-dom'
import {v4 as uuidV4 } from 'uuid'

const Home = () => {
    const navigate = useNavigate()

    // const goToQuill = () => {
    //     navigate(`/documents/${uuidV4}`)
    // }

    const createNewRoom = (e) => {
      e.preventDefault()
      const id = uuidV4()

      // console.log(id);
      navigate(`documents/${id}`)
    }
  return (
    <div>
        <button onClick={createNewRoom}>Join</button>
    </div>
  )
}

export default Home