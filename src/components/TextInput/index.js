import React, { useContext, useState } from 'react'
import './index.scss'
import sendsvg from '../../assets/send.png';
import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { v4 as uuid } from "uuid";


const TextInput = () => {
  const [text, setText] = useState("");

  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  const handleSend = async () => {
    if (text.trim() !== "") {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          sendId: currentUser.uid,
          date: Timestamp.now()
        })
      });
  
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text
        },
        [data.chatId + ".date"]: serverTimestamp()
      });
  
      setText("");
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === 'Enter' && text !== "") handleSend();
  }

  return (
    <div className='text-input'>
      <input
        type='text'
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        value={text}
        maxLength='100'
      />
      <img className='sendsvg' src={sendsvg} onClick={handleSend} alt=''/>
    </div>
  )
}

export default TextInput