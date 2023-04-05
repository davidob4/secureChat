import React, { useContext } from 'react'
import './index.scss'
import { auth } from '../../firebase'
import { AuthContext } from '../../context/AuthContext';
import { signOut } from 'firebase/auth'
import Search from '../Search';
import Chats from '../Chats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext)
  
  return (
    <div className='sidebar'>
      <h2>{currentUser.displayName}</h2>
      <Search />
      <Chats />
      <FontAwesomeIcon className='logout' icon={faSignOutAlt} onClick={() => {window.location.reload(); signOut(auth);}} />
    </div>
  )
}

export default Sidebar