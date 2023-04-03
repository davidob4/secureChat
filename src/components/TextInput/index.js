import React, { useContext, useEffect, useState } from 'react'
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
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        sendId: currentUser.uid,
        date: Timestamp.now()
      })
    });

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    });

    setText("");
  }

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') handleSend();
  }

  return (
    <div className='text-input'>
      <input
        type='text'
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        value={text}
      />
      <img className='sendsvg' src={sendsvg} onClick={handleSend} />
    </div>
  )
}

export default TextInput