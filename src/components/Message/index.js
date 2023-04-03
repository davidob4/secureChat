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

    return (
        <div ref={ref}
            className={`message ${message.sendId === currentUser.uid && "owner"}`}
        >
            <div className='message-content'>
                <p>{message.text}</p>
                {(message.sendId === currentUser.uid) && <p className='you'>you</p>}
                {(message.sendId != currentUser.uid) && <p className='you'>{data.user.displayName}</p>}
            </div>


        </div>
    )
}

export default Message