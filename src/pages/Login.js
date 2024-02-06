import React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from '../Auth/auth'
import { useAuth2 } from '../Auth/auth2'
import Layout from '../components/Layout'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import "./Login.css"

import {supabase} from '../database/Database'



function Login() {
    const auth = useAuth2()
    let navigate = useNavigate();
    let location = useLocation();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [user, setUser] = useState("")

    const url = JSON.parse(localStorage.getItem('prevURL'));
    console.log("Prev url: " + url);


    useEffect(() => {
        checkUser()

        const getUser = async(e) => {
            const { data: { user } } = await supabase.auth.getUser()
            console.log(auth.user)
            console.log(auth.session)
            setUser(auth.user)
        }

        getUser()

    },[])

    const checkUser = async(e) => {

        // console.log("Pathname: " + location.pathname);
        console.log(user);

        // Check if user is signed in and if pathname matches the sign-in page 
        // If true then will send them to the dashboard
        if(auth.user && location.pathname === "/login"){
            console.log("Pathname: " + location.pathname);

            if(url){
                navigate("../"+url, { replace: true });
                localStorage.removeItem('prevURL');

           }else{
                navigate("../dashboard", { replace: true });
           }
        }else {
            console.log("Sign in")
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        const login = await auth.Login(email, password)
       
       if (login.error) {
           if (login.error = "Signups not allowed for this instance"){
                setMessage("Your email is not valid, please try again or create a account")
                alert("Your email is not valid, please try again or create a account")
           }else{
                setMessage(login.error.message)
                alert(login.error.message)
           }
       } else {
           setMessage("You have been logged in")
           alert("You have been logged in")
           if(url){
                navigate("../"+url, { replace: true });
                localStorage.removeItem('prevURL');
           }else{
                navigate("../dashboard", { replace: true });
                
           }

       }
       setEmail("")
    }
    

    return (
        <Layout>
            <div className="login-layout">
            <br /><br />

                <h3>{message && message}</h3>
                <div className="login-form-container">
        

                    <h1 className="login-header">SIGN-IN</h1>

                    <form className="login-form"  onSubmit={handleLogin}>
                        <label><h4>Email:</h4></label> <input type="email" value={email} placeholder="Please enter your email here" onChange={e => setEmail(e.target.value)} />
                        <br />
                        <label htmlFor=""><h4>Password:</h4></label> <input type="password" value={password} placeholder="************" onChange={e => setPassword(e.target.value)} />
                        <span><h5>Don't have an account? <a className="login-register_link" href="/register">Register here</a></h5></span>
                        <br /><br />
                        <div className="login-button-container">
                            <button className="login-form-button" type="submit"><h5>SUBMIT</h5></button>
                        </div>
                    </form>
                    <br /><br />
                </div>
            </div>
        </Layout>
    )
}

export default Login