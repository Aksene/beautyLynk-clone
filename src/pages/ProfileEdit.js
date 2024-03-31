import React from 'react'
import './ProfileEdit.css'
import Layout from '../components/Layout'
import { useEffect, useState, useCallback } from 'react'
import { useAuth2 } from '../Auth/auth2'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../database/Database'
import emailjs from "@emailjs/browser";

function ProfileEdit() {
    const auth = useAuth2()
    const navigate = useNavigate();
    const [isAdmin, setAdmin] = useState(false)
    const [userInfo, setUserInfo] = useState()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNum, setPhoneNum] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [changePassword, setChangePassword] = useState()
    const [passCheck, setPassCheck] = useState(true)
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [showInput, setShowInput] = useState(false)

    // const [editInfo, setEditInfo] = useState({
    //     firstName:"",
    //     lastName:"",
    //     email:"",
    //     phoneNum:"",
    //     avatar:"",
    // })
    const [editable, setEditable] = useState(false)


    const search = useLocation().search;
    const id=new URLSearchParams(search).get("id");
    console.log("Search params: " + id)

    useEffect(() => {
        // getUserInfo()
        if (!userInfo){
            getCusInfo()
        }else if(userInfo.length == 0){
            getProInfo()
        }
        emailjs.init("ELhMlmYCSWK5Xb-Xg")


        console.log(auth.user)
        console.log("isAdmin: " + isAdmin)
        
        // if (proInfo[0].firstName) {
        //     console.log("UseEffect SpecArray: " + proInfo[0].specArray)
        // }
       
    },[userInfo])

    const getProInfo = async() => {


        const {data, error} = await supabase
            .from('BeautyLynk_Pros_dup')
            .select('*')
            .eq("email", `${auth.user.email}`)
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Pro information", data)
            setUserInfo(data)
            auth.user.email == data.map((info) => (info.email)) ? setAdmin(true) : console.log("isAdmin: " +isAdmin)
            changePassword = data.map((info) => (info.changePassword))
        }
    }

    const getCusInfo = async() => {

        const {data, error} = await supabase
            .from('BeautyLynk_Users')
            .select('*')
            .eq("email", `${auth.user.email}`)
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Customer information", data)
            setUserInfo(data)
            auth.user.email == data.map((info) => (info.email)) ? setAdmin(true) : console.log("isAdmin: " +isAdmin)
        }
    }

    // const getUserInfo = async() => {


    //     const {data, error} = await supabase
    //         .from('BeautyLynk_Users')
    //         .select('*')
    //         .eq("email", `${auth.user.email}`)
    //     if(error){
    //         console.log(error)
    //     }
    //     if(data){
    //         // info.push(data)
    //         console.log("Customer information", data)
    //         setUserInfo(data)
    //         // Check If owner of profile
    //         auth.user.email == data.map((info) => (info.email)) ? setAdmin(true) : console.log("isAdmin: " +isAdmin)
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let localImageUrl = ""
        let name = userInfo.map(info => (info.firstName))

        console.log(name)


        if(image) {
            const {data, error} = await supabase.storage.from(`avatars/${auth.user.email}`).upload(`${Date.now()}_${image.name}`, image)

            if(error) {
                console.log(error)
                alert(error.message)
            }
            if(data) {
                setImageUrl(data.path)
                // data.map( res => localImageUrl = res.key)
                localImageUrl = data.path
                console.log("Image has been uploaded",data)
            }
        }

        const {data, error} = await supabase
            .from('BeautyLynk_Users')
            .update({ avatar: `https://vfexusiotdfnjqfjkjfv.supabase.co/storage/v1/object/public/avatars/${auth.user.email}/${localImageUrl}` })
            .eq("id", id)
            .select()
        if(error) {
            console.log(error)
            alert(error.message)
        }
        if(data) {
            console.log("Customer info has been updated",data)
            emailjs.send("gmail","template_95wje5k",{
                subject: "Profile Update Notification",
                name: `${userInfo.map((info) => (info.firstName))}`,
                message: `We've recently updated your profile image as requested. Please review the changes at your earliest convenience.`,
                email: auth.user.email,
            });
        }
        setShowInput(false)
        
        window.location.reload();
    }

    const handleFormSubmit = async(e) => {
        e.preventDefault()
        console.log(firstName ? firstName : userInfo.map((info) => (info.firstName)).toString(),lastName ? lastName : userInfo.map((info) => (info.lastName)).toString(),phoneNum ? phoneNum : userInfo.map((info) => (info.phoneNum)).toString())
        var sent = false

        if(password && passwordConfirm){
            if (password === passwordConfirm) {
                const { data, error } = await supabase.auth.updateUser({
                    password: password
                })
                if(error){
                    console.log(error)
                    alert(error.message)
                }if(data){
                    const { data, error } = await supabase
                    .from('BeautyLynk_Users')
                    .update({ 
                        firstName: firstName ? firstName : userInfo.map((info) => (info.firstName)).toString(),
                        lastName: lastName ? lastName : userInfo.map((info) => (info.lastName)).toString(),
                        phoneNum: phoneNum ? phoneNum : userInfo.map((info) => (info.phoneNum)).toString()
                    })
                    .eq("id", id)
                    .select()
                    if(error) {
                        console.log(error)
                        alert(error.message)
                    }
                    if(data) {
                        console.log("Customer info has been updated",data)
                        emailjs.send("gmail","template_95wje5k",{
                            subject: "Profile Update Notification",
                            name: `${userInfo.map((info) => (info.firstName))}`,
                            message: `We've recently updated your profile information and/or password as requested. Please review the changes at your earliest convenience.`,
                            email: auth.user.email,
                        })
                    }
                    window.setTimeout(window.location.reload.bind(window.location), 2000)
    
                }
            } else {
                setPassCheck(false)
            }
        }else {
            const { data, error } = await supabase
                    .from('BeautyLynk_Users')
                    .update({ 
                        firstName: firstName ? firstName : userInfo.map((info) => (info.firstName)).toString(),
                        lastName: lastName ? lastName : userInfo.map((info) => (info.lastName)).toString(),
                        phoneNum: phoneNum ? phoneNum : userInfo.map((info) => (info.phoneNum)).toString()
                    })
                    .eq("id", id)
                    .select()
                    if(error) {
                        console.log(error)
                        alert(error.message)
                    }
                    if(data) {
                        console.log("Customer info has been updated",data)
                        emailjs.send("gmail","template_95wje5k",{
                            subject: "Profile Update Notification",
                            name: `${userInfo.map((info) => (info.firstName))}`,
                            message: `We've recently updated your profile information as requested. Please review the changes at your earliest convenience.`,
                            email: auth.user.email,
                        })
                    }
                    window.setTimeout(window.location.reload.bind(window.location), 2000)
        }
        
            
    }

    return (
        <Layout>
            <div>
                {
                    isAdmin ? 
                        <div>
                            <div className="stylist_profile-nav">
                                <div className="stylist_profile-nav_left">
                                    {/* <button className="back-button"> BACK </button> */}
                                        <button className="back-button" onClick={() => navigate(-1)}>
                                            <img src="./icons/arrow-left--teal.svg" alt=""  />
                                        </button>
                                    {
                                        isAdmin ? 
                                            <div className="profile_edit-wrap">
                                                {
                                                    editable 
                                                        ? <button onClick={() => <>{setEditable(false)}{setShowInput(false)}</>} className="profile_edit-btn">CANCEL</button>
                                                        : <button onClick={() => <>{setEditable(true)}</>} className="profile_edit-btn">EDIT</button>
                                                        
                                                }
                                            </div> 
                                        : ""
                                    }
                                </div>
                                { 
                                    isAdmin ? 
                                        <div className="stylist_profile-nav_right">
                                            {userInfo.map((info) => (info.avatar)) != "" ? 
                                                editable ? 
                                                    <div className="profile-upload-wrap">
                                                        <button onClick={() => setShowInput(!showInput)}>UPLOAD</button>
                                                        {showInput ? 
                                                            <form onSubmit={handleSubmit} className="profile-input-wrap">
                                                                <input 
                                                                    type="file" 
                                                                    accept={"img/*"}
                                                                    onChange={e => setImage(e.target.files[0])}
                                                                />
                                                                <div className="">
                                                                    <button  type="submit">Done</button>
                                                                </div>
                                                            </form>
                                                            :""
                                                        }
                                                    </div> :""
                                                : <div className="profile-upload-wrap">
                                                    <button onClick={() => setShowInput(!showInput)}>UPLOAD</button>
                                                    {showInput ? 
                                                        <form onSubmit={handleSubmit} className="profile-input-wrap">
                                                            <input 
                                                                type="file" 
                                                                accept={"img/*"}
                                                                onChange={e => setImage(e.target.files[0])}
                                                            />
                                                            <div className="">
                                                                <button  type="submit">Done</button>
                                                            </div>
                                                        </form>
                                                        :""
                                                    }
                                                </div>
                                                }
                                        </div>
                                    : ""
                                }
                                </div>


                                <div className="profile-hero" style={{marginTop: "3rem"}}>
                                    <div >
                                        {userInfo.map((info) => 
                                            info.avatar ? <img className="profile-hero_cover"  src={userInfo.map((info) => (info.avatar))} alt="" />
                                            : <img className="profile-hero_cover" src="./newProfile.png" alt="" />
                                        )}

                                        {/* <img className="profile-hero_cover" src="https://st4.depositphotos.com/5934840/27920/v/450/depositphotos_279203658-stock-illustration-young-woman-avatar-cartoon-character.jpg" alt="" /> */}
                                    </div>
                                    <div id="transparent">
                                        {userInfo.map((info) => 
                                            info.avatar ? <img className=""  src={userInfo.map((info) => (info.avatar))} alt="" />
                                            : <img className="" src="./newProfile.png" alt="" />
                                        )}

                                        {/* <img className="" src="https://st4.depositphotos.com/5934840/27920/v/450/depositphotos_279203658-stock-illustration-young-woman-avatar-cartoon-character.jpg" alt="" /> */}
                                        <h1 id="text">{userInfo.map((info) => (<>{info.firstName}  {info.lastName}</>))}</h1>
                                    </div>
                                </div>
                                <br /><br /><br />
                                <h1 className="edit-header">Edit Your Information</h1>
                                <br />

                                {
                                    editable ? 
                                        <form className="edit-form"  onSubmit={(event) => handleFormSubmit(event)}>
                                            <div className="edit-names">
                                                <div>
                                                    <label><h4>First Name:</h4></label> <input type="text" value={firstName} placeholder={userInfo.map((info) => info.firstName)} onChange={e => setFirstName(e.target.value)} />
                                                </div>
                                                <div>
                                                    <label><h4>Last Name:</h4></label> <input type="text" value={lastName} placeholder={userInfo.map((info) => info.lastName.trim())} onChange={e => setLastName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="edit-contact">
                                                <div>
                                                    <label><h4>Phone Number:</h4></label> <input type="text" value={phoneNum} placeholder={userInfo.map((info) => info.phoneNum)} onChange={e => setPhoneNum(e.target.value)} />
                                                </div>
                                                <div>
                                                    <label><h4>Email:</h4></label> <h3>{userInfo.map((info) => info.email)}</h3>
                                                </div>
                                            </div>
                                            {
                                                changePassword || !changePassword ?
                                                    <>
                                                        <label htmlFor=""><h4>Password:</h4></label> <input type="password" value={password} placeholder="************" onChange={e => setPassword(e.target.value)} />
                                                        <label htmlFor=""><h4>Confirm Password:</h4></label> 
                                                        <label htmlFor="" style={{color: "#db2a77", fontWeight: "bold"}}> {passCheck ? "" : <>{"Passwords do not match"}<br/><br/></> }</label>
                                                        <input type="password" value={passwordConfirm} placeholder="************" onChange={e => setPasswordConfirm(e.target.value)} />  
                                                    </>
                                                    :""
                                            }                                          
                                            <br /><br />
                                            <div className="edit-button-container">
                                                <button className="edit-form-button" type="submit"><h5>SUBMIT</h5></button>
                                            </div>
                                        </form>
                                    :   <div className="info-container">
                                            {userInfo.map((info) => (
                                                <div>
                                                    <div className="info-names">
                                                        <div>
                                                            <label><h3>First Name:</h3></label>
                                                            <h2>{info.firstName}</h2> 
                                                        </div>
                                                        <div>
                                                            <label><h3>Last Name:</h3></label> 
                                                            <h2>{info.lastName}</h2>
                                                        </div>
                                                    </div>
                                                    <div className="info-contact">
                                                        <div>
                                                            <label><h3>Phone Number:</h3></label> 
                                                            <h2>{info.phoneNum}</h2>
                                                        </div>
                                                        <div>
                                                            <label><h3>Email:</h3></label> 
                                                            <h2>{info.email}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                        </div>

                                }
                                <br /><br /><br /><br />
                        </div>
                    : <div>
                        <h2> You do not have access this profile</h2>
                    </div>
                }
            </div>
        </Layout>
    )
}

export default ProfileEdit

