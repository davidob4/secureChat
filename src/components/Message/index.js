import './index.scss';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import React, { useContext, useRef, useEffect } from 'react'
import bin from "../../assets/bin.png"
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';


const Message = ({ message, loaded }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView();
    if (loaded) {
      ref.current.classList.add("loaded");
    }
  }, [loaded]);

  function formatDateAndTime(timestamp) {
    if (timestamp && timestamp.seconds) { // add check for undefined timestamp
      const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      //const year = date.getFullYear();
      //const month = (date.getMonth() + 1).toString().padStart(2, '0');
      //const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      //const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      return ''; // return empty string if timestamp is undefined
    }
  }

  async function handleDelete() {
    const chatId = data.chatId
    const id = message.id;
    const docRef = doc(db, "chats", data.chatId);
    const docSnap = await getDoc(docRef);
    const messages = docSnap.data().messages;
    const indexToDelete = messages.findIndex((m) => m.id === id);
  
    const updatedMessage = {
      ...messages[indexToDelete],
      text: "this message has been deleted"
    };
  
    if (indexToDelete !== -1) {
      const updatedMessages = [...messages];
      updatedMessages.splice(indexToDelete, 1, updatedMessage);
      await updateDoc(docRef, { messages: updatedMessages });
  
      async function findLastValidMessage(chatId, messages, userId) {
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].text !== "this message has been deleted" && messages[i].sendId === userId) {
            return messages[i];
          }
        }
        return null;
      }
      
      const otherUserId = data.user.uid;
      const otherUserChatsRef = doc(db, "userChats", otherUserId);
      const otherUserChatsSnap = await getDoc(otherUserChatsRef);
      const otherUserChatsData = otherUserChatsSnap.data();
      if (otherUserChatsData[chatId]) {
        const lastValidMessage = await findLastValidMessage(chatId, updatedMessages, currentUser.uid);
        const lastMessageText = lastValidMessage ? lastValidMessage.text : "";
        await updateDoc(otherUserChatsRef, {
          [chatId + ".lastMessage.text"]: lastMessageText,
          [chatId + ".date"]: serverTimestamp()
        });
      }
    }
  }
  


  return (
    <div ref={ref}
      className={`message ${message.sendId === currentUser.uid && "owner"}`}
    >
      <div className='message-content'>
        {(message.text !== "this message has been deleted") &&<p><img className='bin' src={bin} alt='' onClick={handleDelete} />{message.text}</p>}
        {(message.text === "this message has been deleted") && <i className="deleted-message">{message.text}</i>}
        {(message.sendId === currentUser.uid) && <p className='you'>you {formatDateAndTime(message.date)}</p>}
        {(message.sendId !== currentUser.uid) && <p className='you'>{data.user.displayName} {formatDateAndTime(message.date)}</p>}
      </div>
    </div>
  )
}

export default Message