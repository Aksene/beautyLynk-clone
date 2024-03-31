import React, { useEffect, useState } from 'react'
import { useAuth2 } from '../Auth/auth2'
import Layout from '../components/Layout'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import "./Register.css"
import {supabase} from '../database/Database'


function Register() {
    const auth = useAuth2()
    let navigate = useNavigate();
    let location = useLocation();
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNum, setPhoneNum] = useState("")
    // const [email, setEmail] = useState("")
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [message, setMessage] = useState("")
    const [passCheck, setPassCheck] = useState(true)
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
        if(auth.user && location.pathname === "/register"){
            console.log("Pathname: " + location.pathname);

            if(url){
                navigate("../"+url, { replace: true });
                localStorage.removeItem('prevURL');

           }else{
                navigate("../dashboard", { replace: true });
           }
        }else {
            console.log("Register")
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        if (password === passwordConfirm) {
            // alert("Passwords Match!")
            console.log(email,password,phoneNum)
            let { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                // phone: phoneNum,
                options: {
                    data: {
                      phoneNumber: phoneNum,
                    },
                  },
            })
            if (error) {
                if (error = "Signups not allowed for this instance"){
                    console.log(error)
                    setMessage("Your email is not valid, please try again or create a account")
                    alert("Your email is not valid, please try again or create a account")
                }else{
                    console.log(error)
                    setMessage(error.message)
                    alert(error.message)
                }
            } else if(data) {
                setMessage("Thank you for registering! A confirmation email has been sent to "+email)
                alert("Thank you for registering! A confirmation email has been sent to "+email)
                console.log(data)
                console.log(data.user.id)
                sendInfo(data)
                // if(url){
                //     navigate("../"+url, { replace: true });
                //     localStorage.removeItem('prevURL');
                // }else{
                //     navigate("../dashboard", { replace: true });
                    
                // }
            }
        } else {
            setPassCheck(false)
        }
       setEmail("")
    }

    const sendInfo = async(rawData) => {
        const {data, error} = await supabase.from("BeautyLynk_Users").insert({
            uuid: rawData.user.id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNum: phoneNum,
        })
        if(error) {
            console.log(error)
            alert(error.message)
        }
        if(data) {
            console.log(data)
            navigate("../", { replace: true });
        }

    }



    return (
        <Layout>
            <div className="register-layout">

                <h3>{message && message}</h3>
                <div className="register-form-container">
        

                    <h1 className="register-header">SIGN UP</h1>

                    <form className="register-form"  onSubmit={handleRegister}>
                        <div className="register-names">
                            <div>
                                <label><h4>First Name:</h4></label> <input type="text" value={firstName} placeholder="Jane" onChange={e => setFirstName(e.target.value)} />
                            </div>
                            <div>
                                <label><h4>Last Name:</h4></label> <input type="text" value={lastName} placeholder="Doe" onChange={e => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="register-contact">
                            <div>
                                <label><h4>Phone Number:</h4></label> <input type="text" value={phoneNum} placeholder="Phone Number" onChange={e => setPhoneNum(e.target.value)} />
                            </div>
                            <div>
                                <label><h4>Email:</h4></label> <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>
                        {/* <div className="register-address">
                            <label><h4>Address 1:</h4></label> <input type="text" value={address1} placeholder="Please enter your email here" onChange={e => setEmail(e.target.value)} />
                            <label><h4>Address 2:</h4></label> <input type="text" value={address2} placeholder="Please enter your email here" onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="register-address">
                            <div>
                                <label><h4>City:</h4></label> <input type="text" value={address1} placeholder="Please enter your email here" onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label><h4>State:</h4></label> <input type="text" value={address1} placeholder="Please enter your email here" onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label><h4>Zip Code:</h4></label> <input type="text" value={address1} placeholder="Please enter your email here" onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div> */}
                        <label htmlFor=""><h4>Password:</h4></label> <input type="password" value={password} placeholder="************" onChange={e => setPassword(e.target.value)} />
                        <label htmlFor=""><h4>Confirm Password:</h4></label> 
                        <label htmlFor="" style={{color: "#db2a77", fontWeight: "bold"}}> {passCheck ? "" : <>{"Passwords do not match"}<br/><br/></> }</label>
                        <input type="password" value={passwordConfirm} placeholder="************" onChange={e => setPasswordConfirm(e.target.value)} />
                        <span><h5>Already have an account? <a className="register-login_link" href="/login">Login</a></h5></span>
                        <br /><br />
                        <div className="register-button-container">
                            <button className="register-form-button" type="submit"><h5>SUBMIT</h5></button>
                        </div>
                    </form>
                    <br /><br />

                </div>
            </div>
        </Layout>
    )
}

export default Register
