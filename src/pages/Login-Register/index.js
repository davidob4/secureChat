import './index.scss'
import React from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../../firebase"
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';


const Login = () => {
    const navigate = useNavigate();

    const handleButtons = () => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
    }

    useEffect(() => {
        handleButtons();
    }, []);
    

    const handleSignup = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value
        const email = e.target[1].value
        const password = e.target[2].value

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(res.user, {
              displayName
            });
        
            onAuthStateChanged(auth, async (user) => {
              if (user) {
                try {
                  await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    displayName,
                    email,
                  });
        
                  await setDoc(doc(db, "userChats", user.uid), {});

                  navigate('/');
                } catch (err) {
                  console.error('Error:', err.message);
                }
              }
            });
          } catch (err) {
            console.error('Error:', err.message);
          }
    }

    const handleSignin = async (e) => {
        e.preventDefault()
        const email = e.target[0].value
        const password = e.target[1].value

        try{
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/')
        } catch (err){

        }
    }

    return(
        <div className="login">
            <div class="container" id="container">
                <div class="form-container sign-up-container">
                    <form onSubmit={handleSignup}>
                        <h1>Create Account</h1>
                        <input type="text" placeholder="Display Name" maxLength="15"/>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button>Sign Up</button>
                    </form>
                </div>
                <div class="form-container sign-in-container">
                    <form onSubmit={handleSignin}>
                        <h1>Sign in</h1>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <a href="/ForgotPassword">Forgot your password?</a>
                        <button>Sign In</button>
                    </form>
                </div>
                <div class="overlay-container">
                    <div class="overlay">
                        <div class="overlay-panel overlay-left">
                            <h1>Already have an account?</h1>
                            <button class="ghost" id="signIn">Sign In</button>
                        </div>
                        <div class="overlay-panel overlay-right">
                            <h1>Don't have an account?</h1>
                            <button class="ghost" id="signUp">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login