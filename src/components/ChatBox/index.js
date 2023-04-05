import "./index.scss"
import React, { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import TextInput from '../TextInput';
import Messages from "../Messages";

const Chat = () => {
  const { data } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)

  return (
    <div className='chat'>
        <span className='chat-username'>{currentUser.uid !== data.user.uid && data.user?.displayName}</span>
        {data.user.displayName && <Messages />}
        {data.user.displayName && <TextInput />}
    </div>
  )
}

export default Chat