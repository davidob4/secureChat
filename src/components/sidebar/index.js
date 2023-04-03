import React, { useContext } from 'react'
import './index.scss'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { signOut } from 'firebase/auth'
import Search from '../Search';
import Chats from '../Chats';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext)
  
  return (
    <div className='sidebar'>
      <h2>{currentUser.displayName}</h2>
      <Search />
      <Chats />
      <button className='logout' onClick={() => {window.location.reload(); signOut(auth);}}>Logout</button>
    </div>
  )
}

export default Sidebar