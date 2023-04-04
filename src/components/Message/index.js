import './index.scss';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import React, { useContext, useRef, useEffect, useState } from 'react'


const Message = ({ message, loaded }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
        if(loaded){
            ref.current.classList.add("loaded");
        }
    }, [message, loaded]);

    function formatDateAndTime(timestamp) {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000); // Convert to milliseconds
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    return (
        <div ref={ref}
            className={`message ${message.sendId === currentUser.uid && "owner"}`}
        >
            <div className='message-content'>
                <p>{message.text}</p>
                {(message.sendId === currentUser.uid) && <p className='you'>you {formatDateAndTime(message.date)}</p>}
                {(message.sendId != currentUser.uid) && <p className='you'>{data.user.displayName} {formatDateAndTime(message.date)}</p>}
            </div>
        </div>
    )
}

export default Message