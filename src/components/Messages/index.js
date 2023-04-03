import './index.scss';
import Message from '../Message';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { db } from '../../firebase';
import { onSnapshot, doc } from 'firebase/firestore';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
      setLoading(true);
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc)=>{
        if (doc.exists()) {
          setMessages(doc.data().messages);
          setLoading(false);
        }
      });
  
      return () => {
        unSub();
      };
  },[data.chatId]);

  return (
    <div className='messages'>
      {loading ? (
        <div className="loading-message">Loading messages...</div>
      ) : (
        messages.map((m) => (
          <Message message={m} key={m.id} loaded={!loading} />
        ))
      )}
    </div>
  );
}

export default Messages