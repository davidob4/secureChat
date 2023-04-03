import './index.scss'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import {
    collection,
    query,
    where,
    getDocs,
    and,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { db } from '../../firebase';

const Search = () => {
    const { dispatch } = useContext(ChatContext);
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            and(where("displayName", "==", username), where("uid", "!=", currentUser.uid))
        );

        try{
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                console.log(doc.id);
                setUser(doc.data());
                
            });
        } catch(err){
            console.error('Error', err.message);
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && setUser(null);
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async (u) => {
        const chatId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

        try{
            const res = await getDoc(doc(db, "chats", chatId));

            if(!res.exists()){
                await setDoc(doc(db, "chats", chatId), {messages:[]});

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [chatId+".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName
                    },
                    [chatId+".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [chatId+".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName
                    },
                    [chatId+".date"]: serverTimestamp()
                });
            }

            dispatch({type:"CHANGE_USER", payload: u})

        } catch(err){
            console.error("Error", err);
        }

        setUser(null);
        setUsername("");
    }

  return (
    <div className='search'>
        <div className='search-form'>
            <input
                type='text'
                placeholder='Find Users'
                onKeyDown={handleKey}
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
        </div>
        {err && <span>User not found!</span>}
        {user && (
            <div className='search-results' onClick={()=>handleSelect(user)}>
                <span>{user.displayName}</span>
            </div>
        )}
    </div>
  );
};

export default Search