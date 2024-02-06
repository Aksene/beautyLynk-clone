import React from 'react'

import { useEffect, useState, useCallback } from 'react'
import { useAuth2 } from '../Auth/auth2'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { supabase } from '../database/Database'
import { Carousel } from 'react-responsive-carousel'

import "./StylistProfile.css"
import axios from 'axios'


function StylistProfile() {
    const auth = useAuth2()
    const navigate = useNavigate();
    var specArr
    const [proInfo, setProInfo] = useState([])
    const [isAdmin, setAdmin] = useState(false)
    const [editable, setEditable] = useState(false)
    const [editHigh, setEditHigh] = useState(false)
    const [image, setImage] = useState(null)
    const [high1, setHigh1] = useState(null)
    const [high2, setHigh2] = useState(null)
    const [high3, setHigh3] = useState(null)

    const [imageUrl, setImageUrl] = useState(null)
    const [finish, setFinish] = useState(false)
    const [showInput, setShowInput] = useState(false)


    const [checkbox, setCheckbox] = useState(true);
    const [checkVal, setCheckVal] = useState();  

    const [posts, setPosts] = useState([])
    const indicatorStyles = {
        background: '#fff',
        width: 8,
        height: 8,
        display: 'inline-block',
        margin: '0 8px',
        
    };
    var mobileAtt
    const width = window.screen.width
     if (width >= 800){
        mobileAtt = {
            centerMode: true
            // etc
        }
        console.log("Attributes for blog hero: ",mobileAtt)
    }else {
        mobileAtt = {
            centerMode: false
            // etc
        }
        console.log("Attributes for blog hero: ",mobileAtt)
    }

    let toggleCheckVal = useCallback((event) => {
       if (event.target.checked) {
        setCheckVal(value => [...value, event.target.id])
       } else {
        setCheckVal(value => value.filter(it => it !== event.target.id))
       }
    }, [setCheckVal])
    console.log("Check Value: "+checkVal)
    



    const search = useLocation().search;
    const id=new URLSearchParams(search).get("id");
    console.log("Search params: " + id)
    
    

    useEffect(() => {
        getProInfo()
        getPosts()

        console.log(auth.user)
        console.log("isAdmin: " + isAdmin)
        
        // if (proInfo[0].firstName) {
        //     console.log("UseEffect SpecArray: " + proInfo[0].specArray)
        // }
       
    },[])

    const getPosts = async() => {
        let info = [];

        const {data, error} = await supabase
            .from('BeautyLynk_Blogs')
            .select('id, title, image, link')
            .order('id')
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Medium posts")
            console.log(data)
            setPosts(data)

            // console.log(data.id)
        }
    }

    const getProInfo = async() => {


        const {data, error} = await supabase
            .from('BeautyLynk_Pros_dup')
            .select('*')
            .eq("id", `${id}`)
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Pro information", data)
            data.map((info) =>(
                <>
                    { specArr = data[0].speciality.split(", ")}
                    {setCheckVal(specArr)}
                    {data[0].specArray = specArr}
                    {console.log("Speciality Array Check: " + data.map((info) => (info.specArray)) )}
                </>
            ))
            setProInfo(data)           
            console.log()

            // Check If owner of profile
            auth.user.email == data.map((info) => (info.email)) ? setAdmin(true) : console.log("isAdmin: " +isAdmin)
    // console.log(data.id)
        }
    }

    const submitHighlight = async (e) => {
        e.preventDefault()
        let localImageUrl = ""
        let name = proInfo.map(info => (info.full_name))

        console.log(name)


        if(high1) {
            const {data, error} = await supabase.storage.from(`highlights/${auth.user.email}`).upload(`${Date.now()}_${high1.name}`, high1)

            if(error) {
                console.log(error)
                alert(error.message)
            }
            if(data) {
                setImageUrl(data.path)
                setFinish(true)
                // data.map( res => localImageUrl = res.key)
                localImageUrl = data.path
            console.log("Image has been uploaded",data)
            }
            const {data1, error1} = await supabase
                .from('BeautyLynk_Pros_dup')
                .update({ highlight3: `https://vfexusiotdfnjqfjkjfv.supabase.co/storage/v1/object/public/highlights/${auth.user.email}/${localImageUrl}` })
                .eq("id", id)
                .select()
            if(error1) {
                console.log(error1)
                alert(error1.message)
            }
            if(data1) {
                console.log("Highlight3 has been updated",data1)
                
            }
        }
        

        
        if(high2) {
            const {data, error} = await supabase.storage.from(`highlights/${auth.user.email}`).upload(`${Date.now()}_${high2.name}`, high2)

            if(error) {
                console.log(error)
                alert(error.message)
            }
            if(data) {
                setImageUrl(data.path)
                setFinish(true)
                // data.map( res => localImageUrl = res.key)
                localImageUrl = data.path
            console.log("Image has been uploaded",data)
            }
            const {data1, error1} = await supabase
                .from('BeautyLynk_Pros_dup')
                .update({ highlight3: `https://vfexusiotdfnjqfjkjfv.supabase.co/storage/v1/object/public/highlights/${auth.user.email}/${localImageUrl}` })
                .eq("id", id)
                .select()
            if(error1) {
                console.log(error1)
                alert(error1.message)
            }
            if(data1) {
                console.log("Highlight3 has been updated",data1)
                
            }
        }
        

        if(high3) {
            const {data, error} = await supabase.storage.from(`highlights/${auth.user.email}`).upload(`${Date.now()}_${high3.name}`, high3)

            if(error) {
                console.log(error)
                alert(error.message)
            }
            if(data) {
                setImageUrl(data.path)
                setFinish(true)
                // data.map( res => localImageUrl = res.key)
                localImageUrl = data.path
                console.log("Highlight3 has been uploaded",data)
            }
            const {data1, error1} = await supabase
                .from('BeautyLynk_Pros_dup')
                .update({ highlight3: `https://vfexusiotdfnjqfjkjfv.supabase.co/storage/v1/object/public/highlights/${auth.user.email}/${localImageUrl}` })
                .eq("id", id)
                .select()
            if(error1) {
                console.log(error1)
                alert(error1.message)
            }
            if(data1) {
                console.log("Highlight3 has been updated",data1)
                
            }
        }
        

        setEditable(false)
        setEditHigh(false)
        if(high1 || high2 || high3){
            window.location.reload();
        }
        
    
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let localImageUrl = ""
        let name = proInfo.map(info => (info.full_name))

        console.log(name)


        if(image) {
            const {data, error} = await supabase.storage.from(`avatars/${auth.user.email}`).upload(`${Date.now()}_${image.name}`, image)

            if(error) {
                console.log(error)
                alert(error.message)
            }
            if(data) {
                setImageUrl(data.path)
                setFinish(true)
                // data.map( res => localImageUrl = res.key)
                localImageUrl = data.path
            console.log("Image has been uploaded",data)
            }
        }

        const {data, error} = await supabase
            .from('BeautyLynk_Pros_dup')
            .update({ avatar: `https://vfexusiotdfnjqfjkjfv.supabase.co/storage/v1/object/public/avatars/${auth.user.email}/${localImageUrl}` })
            .eq("id", id)
            .select()
        if(error) {
            console.log(error)
            alert(error.message)
        }
        if(data) {
            console.log("Booking has been updated",data)
            
        }
        setShowInput(false)
        window.location.reload();
    

    }

    const handleChange = (e) => {
        setCheckbox(e.target.checked)
        console.log("Checkbox clicked, NAME: "+ e.target.id + " STATUS:", e.target.checked)
    };

    const submitSpec = async(e) => {
        proInfo[0].specArray = checkVal
        proInfo[0].speciality = checkVal.join(', ')

        console.log("Default check :",proInfo.map((info) => (info.specArray.includes("Customer Service Agent Hair") ? true : false))[0])

        console.log("Specs to be updated: " + checkVal)
        console.log(proInfo)

        const { data, error } = await supabase
            .from('BeautyLynk_Pros_dup')
            .update({ speciality: proInfo[0].speciality})
            .eq("id", `${id}`)
            .select("*")
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Updated booking response", data)
            // setProInfo(data)
            setEditable(false)
            // console.log(data.id)
        }

    }

    return (
        <Layout>
            <div className="stylist_profile-container">
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
                                {proInfo.map((info) => (info.avatar)) != "" ? 
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
                <div className="stylist_profile">
                    <div className="profile-hero">
                        <div >
                            {proInfo.map((info) => 
                                info.avatar ? <img className="profile-hero_cover"  src={proInfo.map((info) => (info.avatar))} alt="" />
                                : <img className="profile-hero_cover" src="./newProfile.png" alt="" />
                            )}

                            {/* <img className="profile-hero_cover" src="https://st4.depositphotos.com/5934840/27920/v/450/depositphotos_279203658-stock-illustration-young-woman-avatar-cartoon-character.jpg" alt="" /> */}
                        </div>
                        <div id="transparent">
                            {proInfo.map((info) => 
                                info.avatar ? <img className=""  src={proInfo.map((info) => (info.avatar))} alt="" />
                                : <img className="" src="./newProfile.png" alt="" />
                            )}

                            {/* <img className="" src="https://st4.depositphotos.com/5934840/27920/v/450/depositphotos_279203658-stock-illustration-young-woman-avatar-cartoon-character.jpg" alt="" /> */}
                            <h1 id="text">{proInfo.map((info) => (<>{info.firstName}  {info.lastName}</>))}</h1>
                        </div>

                    </div>
                    {/* <img className="" src="./newProfile.png" alt="" /> */}
                    <br /><br /><br /><br />


                    <div className="profile-body">
                        <div className="about-section">
                            <h1 className="info-section-header">
                                Information
                            </h1>
                            <br />
                            {/* <h1>{proInfo.map((info) => (<>{info.firstName}  {info.lastName}</>))}</h1> */}
                            {/* <h4 className="welcome-profile_text">{proInfo.map((info) => (info.speciality))}</h4> */}
                            <h4> Date Joined: {proInfo.map((info) => (info.created_at))}</h4>
                            <h4> Licensed: {proInfo.map((info) => (info.licenseNum ? "YES" : "NO"))}</h4>
                            <h4> Years Licensed: {proInfo.map((info) => (info.yearsLicensed))}</h4>
                            <h4> Kids Services: {proInfo.map((info) => (info.kidServices ? "YES" : "NO"))}</h4>
                            <h4> Allergies: {proInfo.map((info) => (info.allergies ? "YES" : "NONE"))}</h4>
                            <h4> Smoker Friendly: {proInfo.map((info) => (info.smokingEnvironments ? "YES" : "NO"))}</h4>
                            {/* <h4 className="welcome-profile_text">{proInfo.map((info) => (info.speciality))}</h4>  */}
                            {/* <iframe src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6998878.087057142!2d-105.365247988024!3d31.070216014683503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864070360b823249%3A0x16eb1c8f1808de3c!2s${proInfo.map((info) => (info.location))}!5e0!3m2!1sen!2sus!4v1704159658120!5m2!1sen!2sus`} width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
                            <br />
                            <h2>Location: {proInfo.map((info) => (info.location))}</h2>
                            <iframe  
                                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6998878.087057142!2d-105.365247988024!3d31.070216014683503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864070360b823249%3A0x16eb1c8f1808de3c!2s${proInfo.map((info) => (info.location))}!5e0!3m2!1sen!2sus!4v1704159658120!5m2!1sen!2sus`} 
                                width="700" 
                                height="400" 
                                allowfullscreen="" 
                                loading="lazy"
                            >                   
                            </iframe>
                        </div>

                        <div className="speciality-section">
                            <h1 className="speciality-section-header">
                                Speciality
                            </h1>
                            {
                                <div>
                                    <form className="tile__grid-container" onChange={(e) => toggleCheckVal(e)}>
                                        {
                                            editable ?
                                               <>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/esthetician.png" alt=""  />
                                                        <input 
                                                            type="checkbox" 
                                                            name="" 
                                                            id="Esthetician" 
                                                            value="Esthetician" 
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Esthetician") ? true : false))[0]} 
                                                        />
                                                        <span class="checkmark"></span>
                                                        <h5 className="speciality-col_title"> Esthetician</h5>
                                                    </div>
                                                </div>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/makeover.png" alt=""  />
                                                        <input 
                                                            type="checkbox" 
                                                            name="" 
                                                            id="Hair and Makeup Artist" 
                                                            value="Hair and Makeup Artist" 
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Hair and Makeup Artist") ? true : false))[0]} 
                                                        />
                                                        <span class="checkmark"></span>
                                                        <h5 className="speciality-col_title">Hair and Makeup Artist </h5>
                                                    </div>
                                                </div>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/cornrows.png" alt=""  />
                                                        <input 
                                                            type="checkbox" 
                                                            name="" 
                                                            id="Hair Braider" 
                                                            value="Hair Braider" 
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Hair Braider") ? true : false))[0]} 
                                                        />
                                                        <span class="checkmark"></span>
                                                        <h5 className="speciality-col_title"> Hair Braider</h5>
                                                    </div>
                                                </div>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/content1.png" alt=""  />
                                                        <input 
                                                            type="checkbox" 
                                                            name="" 
                                                            id="Digital Content Creator Hair" 
                                                            value="Digital Content Creator Hair" 
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Digital Content Creator Hair") ? true : false))[0]} 
                                                        />
                                                        <span class="checkmark"></span>
                                                        <h5 className="speciality-col_title">Digital Content Creator Hair</h5>
                                                    </div>
                                                </div>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/content2.png" alt=""  />
                                                        <input 
                                                            type="checkbox"
                                                            name="" 
                                                            id="Digital Content Creator Makeup" 
                                                            value="Digital Content Creator Makeup" 
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Digital Content Creator Makeup") ? true : false))[0]} 
                                                        />
                                                        <span class="checkmark"></span>
                                                        <h5 className="speciality-col_title">Digital Content Creator Makeup</h5>
                                                    </div>
                                                </div>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/custServ.png" alt=""  />
                                                        <input 
                                                            type="checkbox" 
                                                            name="" 
                                                            id="Customer Service Agent Hair" 
                                                            value="Customer Service Agent Hair" 
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Customer Service Agent Hair")  ? true : false))[0]} 
                                                        />
                                                        <span  class="checkmark"></span>
                                                        <h5 className="speciality-col_title"> Customer Service Agent Hair</h5>
                                                    </div>
                                                </div>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/custServ.png" alt=""  />
                                                        <input 
                                                            type="checkbox" 
                                                            name="" 
                                                            id="Customer Service Agent Makeup" 
                                                            value="Customer Service Agent Makeup" 
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Customer Service Agent Makeup") ? true : false))[0]} 
                                                        />
                                                        <span class="checkmark"></span>
                                                        <h5 className="speciality-col_title"> Customer Service Agent Makeup</h5>
                                                    </div>
                                                </div>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/sales.png" alt=""  />
                                                        <input 
                                                            type="checkbox" 
                                                            name="" 
                                                            id="Beauty Sales - on location/activations" 
                                                            value="Beauty Sales - on location/activations" 
                                                            style={{top: "50%"}}
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Beauty Sales - on location/activations") ? true : false))[0]} 
                                                        />
                                                        <span style={{top: "50%"}} class="checkmark"></span>
                                                        <h5 className="speciality-col_title"> Beauty Sales - on location/activations</h5>
                                                    </div>
                                                </div>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/henna.png" alt=""  />
                                                        <input 
                                                            type="checkbox" 
                                                            name="" 
                                                            id="Henna Artist" 
                                                            value="Henna Artist" 
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Henna Artist") ? true : false))[0]} 
                                                        />
                                                        <span class="checkmark"></span>
                                                        <h5 className="speciality-col_title"> Henna Artist</h5>
                                                    </div>
                                                </div>
                                                <div className="speciality-col">
                                                    <div className="speciality-info">
                                                        <img src="./icons/spec/wig.png" alt=""  />
                                                        <input 
                                                            type="checkbox" 
                                                            name="" 
                                                            id="Wig Specialist" 
                                                            value="Wig Specialist" 
                                                            defaultChecked={proInfo.map((info) => (info.specArray.includes("Wig Specialist") ? true : false))[0]} 
                                                        />
                                                        <span class="checkmark"></span>
                                                        <h5 className="speciality-col_title"> Wig Specialist</h5>
                                                    </div>
                                                </div>
                                            </>
                                            : proInfo.map((info) => (
                                                    info.specArray.map((spec) => (
                                                        <div className="speciality-col">
                                                            <div className="speciality-info">
                                                                {
                                                                    spec === "Esthetician" ?
                                                                        <img src="./icons/spec/esthetician.png" alt="" />
                                                                    : spec === "Hair and Makeup Artist" ?
                                                                        <img src="./icons/spec/makeover.png" alt=""  />
                                                                    : spec === "Hair Braider" ?
                                                                        <img src="./icons/spec/cornrows.png" alt=""  />
                                                                    : spec === "Digital Content Creator Hair" ?
                                                                        <img src="./icons/spec/content1.png" alt=""  />
                                                                    : spec === "Digital Content Creator Makeup" ?
                                                                        <img src="./icons/spec/content2.png" alt=""  />
                                                                    : spec === "Customer Service Agent Hair" ?
                                                                        <img src="./icons/spec/custServ.png" alt=""  />
                                                                    : spec === "Customer Service Agent Makeup" ?
                                                                        <img src="./icons/spec/custServ.png" alt=""  />
                                                                    : spec === "Beauty Sales - on location/activations" ?
                                                                        <img src="./icons/spec/sales.png" alt=""  />
                                                                    : spec === "Henna Artist" ?
                                                                        <img src="./icons/spec/henna.png" alt=""  />
                                                                    : spec === "Wig Specialist" ?
                                                                        <img src="./icons/spec/wig.png" alt=""  />
                                                                    : ""
                                                                }
                                                            <h5 className="speciality-col_title"> {spec}</h5>
                                                            </div>
                                                        </div>
                                                    ))
                                                ))
                                        }
                                            
                                    </form>
                                    {editable ? <div className="speciality-save_btn_wrap">
                                        <button className="speciality-save_btn" onClick={(e) => submitSpec(e)}> SAVE</button>
                                    </div> : ""}
                                </div>
                            }
                            
                        </div>

                    </div>
                    <div className="highlight-section">
                        <div className="highlight-header-wrap">
                            <h1 className="highlight-section-header">
                                    Highlights
                            </h1>
                            {
                                isAdmin ? 
                                    <div className="highlight-btn_wrap">
                                        {
                                            editHigh || editable
                                                ? <button onClick={() => <>{setEditHigh(false)}{setEditable(false)}{setShowInput(false)}</>} className="highlight_edit-btn">CANCEL</button>
                                                : <button onClick={() => <>{setEditHigh(true)}</>} className="highlight_edit-btn">EDIT</button>
                                                
                                        }
                                    </div> 
                                : ""
                            }
                        </div>
                        {
                            editHigh || editable ?
                                <div>
                                    <div className="highlight-edit_wrap">
                                        <div className="highlight-card">
                                            {proInfo.map((info) => (
                                                <>
                                                    {
                                                        info.highlight1 ? 
                                                            <img src={info.highlight1} alt="" />
                                                        :   <img src="./emptyHigh.png" alt="" />
                                                    }
                                                </>
                                            ))}
                                            <h3>Highlight 1</h3>
                                            <input 
                                                type="file" 
                                                accept={"img/*"}
                                                onChange={e => setHigh1(e.target.files[0])}
                                            />

                                        </div>
                                        <div className="highlight-card">
                                            {proInfo.map((info) => (
                                                <>
                                                    {
                                                        info.highlight2 ? 
                                                            <img src={info.highlight2} alt="" />
                                                        :   <img src="./emptyHigh.png" alt="" />
                                                    }
                                                </>
                                            ))}
                                            <h3>Highlight 2</h3>
                                            <input 
                                                type="file" 
                                                accept={"img/*"}
                                                onChange={e => setHigh2(e.target.files[0])}
                                            />

                                        </div>
                                        <div className="highlight-card">
                                            {proInfo.map((info) => (
                                                <>
                                                    {
                                                        info.highlight3 ? 
                                                            <img src={info.highlight3} alt="" />
                                                        :   <img src="./emptyHigh.png" alt="" />
                                                    }
                                                </>
                                            ))}
                                            <h3>Highlight 3</h3>
                                            <input 
                                                type="file" 
                                                accept={"img/*"}
                                                onChange={e => setHigh3(e.target.files[0])}
                                            />


                                        </div>
                                        
                                    </div>
                                    {editHigh || editable ? <div className="speciality-save_btn_wrap">
                                        <button className="speciality-save_btn" onClick={(e) => submitHighlight(e)}> SAVE</button>
                                    </div> : ""}
                                </div>
                            : <Carousel 
                                className="profile_carousel-wrap" 
                                selectedItem={0}
                                autoPlay={true} 
                                infiniteLoop={true}
                                showStatus={false}
                                showIndicators={true}
                                stopOnHover
                                swipeable
                                {...mobileAtt}
                                centerSlidePercentage={60}
                                useKeyboardArrows={true}
                                emulateTouch
                                // selectedItem={posts.length}
                                transitionTime={750}
                                interval={5000}
                                renderIndicator={(onClickHandler, isSelected, index, label) => {
                                    if (isSelected) {
                                        return (
                                            <li
                                                style={{ ...indicatorStyles, background: '#da1d6f' }}
                                            />
                                        );
                                    }
                                    return (
                                        <li
                                            style={{
                                                background: '#9c59769d',
                                                width: 8,
                                                height: 8,
                                                display: 'inline-block',
                                                margin: '0 8px',
                                                cursor: "pointer",
                                                marginTop: "10px"

                                            }}
                                            onClick={onClickHandler}
                                            onKeyDown={onClickHandler}
                                            value={index}
                                            key={index}
                                            role="button"
                                            tabIndex={0}
                                        />
                                    );
                                }}
                            >
                                
                                <div className="carousel-slide">
                                    <div key={1} className="blogHero-element">
                                        <img 
                                            // src={`https://braidedfinesse.com/cdn/shop/files/SMALLSENEGALESETWIST_67cf481f-ab77-4902-8d7a-4369ad945c69_960x1200_crop_center.jpg?v=1693798447`} 
                                            
                                            
                                            src={proInfo.map((info) => 
                                                info.highlight1 ? 
                                                    info.highlight1
                                                :   "./emptyHigh.png"
                                            )}
                                            className="blogHero-image"
                                        />
                                    </div>
                                </div>
                                <div className="carousel-slide">
                                    <div key={2} className="blogHero-element">
                                        <img 
                                            // src={`data:image/jpeg;base64,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`} 
                                            src={proInfo.map((info) => 
                                                info.highlight1 ? 
                                                    info.highlight2
                                                :   "./emptyHigh.png"
                                            )}
                                            className="blogHero-image"
                                        />
                                    </div>
                                </div>
                                <div className="carousel-slide">
                                    <div key={3} className="blogHero-element">
                                        <img 
                                            // src={`data:image/jpeg;base64,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`} 
                                            src={proInfo.map((info) => 
                                                info.highlight1 ? 
                                                    info.highlight3
                                                :   "./emptyHigh.png"
                                            )}
                                            className="blogHero-image"
                                        />
                                    </div>
                                </div>
                            </Carousel>
                        }
                    </div>
                    <br /><br /><br /><br />

                </div>
                
            </div>
        </Layout>
    )
}

export default StylistProfile
