import './index.scss';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import React, { useContext, useRef, useEffect, useState } from 'react'
import bin from "../../assets/bin.png"
import { db } from '../../firebase';
import { doc, getDoc, deleteDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';


const Message = ({ message, loaded }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView();
        if(loaded){
            ref.current.classList.add("loaded");
        }
    }, [message, loaded]);

    function formatDateAndTime(timestamp) {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    async function handleDelete() {
        const chatId = data.chatId
        const id = message.id;
        const docRef = doc(db, "chats", data.chatId);
        const docSnap = await getDoc(docRef);
        const messages = docSnap.data().messages;
        const indexToDelete = messages.findIndex((m) => m.id === id);
        if (indexToDelete !== -1) {
          await deleteDoc(doc(db, "chats", data.chatId, "messages", id));
          messages.splice(indexToDelete, 1);
          await updateDoc(docRef, { messages });
      
          // Update lastMessage field in userChats for both users
          const currentUserChatsRef = doc(db, "userChats", currentUser.uid);
          const currentUserChatsSnap = await getDoc(currentUserChatsRef);
          const currentUserChatsData = currentUserChatsSnap.data();
          const otherUserId = data.user.uid;
          if (currentUserChatsData[chatId]) {
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
            const lastMessageText = lastMessage ? lastMessage.text : null;
            await updateDoc(currentUserChatsRef, {
              [chatId + ".lastMessage"]: {
                text: lastMessageText
              },
              [chatId + ".date"]: serverTimestamp()
            });
          }
      
          const otherUserChatsRef = doc(db, "userChats", otherUserId);
          const otherUserChatsSnap = await getDoc(otherUserChatsRef);
          const otherUserChatsData = otherUserChatsSnap.data();
          if (otherUserChatsData[chatId]) {
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
            const lastMessageText = lastMessage ? lastMessage.text : null;
            await updateDoc(otherUserChatsRef, {
                [chatId + ".lastMessage"]: {
                    text: lastMessageText
                },
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
                <p><img className='bin' src={bin} onClick={handleDelete}/>{message.text}</p>
                {(message.sendId === currentUser.uid) && <p className='you'>you {formatDateAndTime(message.date)}</p>}
                {(message.sendId != currentUser.uid) && <p className='you'>{data.user.displayName} {formatDateAndTime(message.date)}</p>}
            </div>
        </div>
    )
}

export default Message