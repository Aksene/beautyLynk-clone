import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import { useAuth2 } from '../Auth/auth2'
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import './ApplicantDetails.css'
import axios from 'axios'
import emailjs from "@emailjs/browser";
import { supabaseAdmin } from '../database/Admin'


function ApplicantDetails() {
    const auth = useAuth2()
    const navigate = useNavigate();

    const [user, setUser] = useState("")
    const [res, setRes] = useState(false)
    const [rejected, setRejected] = useState(false)
    const [applicants, setApplicants] = useState([])
    const [proInfo, setProInfo] = useState([])
    const [regResponse, setRegResponse] = useState([])



    localStorage.removeItem('prevURL');
    const search = useLocation().search;
    const id=new URLSearchParams(search).get("id");
    console.log("Search params: " + id)

    useEffect(() => {
        const getUser = async(e) => {
            const { data: { user } } = await supabase.auth.getUser()
            console.log(auth.user)
            console.log(auth.session)
            setUser(auth.user)
        }

        emailjs.init("ELhMlmYCSWK5Xb-Xg")

        getUser()
        getApplicants()
    }, [applicants.length])


    const getApplicants = async() => {
        const {data, error} = await supabase
            .from('BeautyLynk_Applicants')
            .select('*')
            .eq("id", `${id}`)
        if(error){
            console.log(error)
        }
        if(data){
            console.log("All Applicants information", data)
            setApplicants(data)
        } 
    }

    const handleApplicant = async(response) => {
        const password = makeid(10)
        console.log("Answer: " + response)
        console.log(password)
        console.log(applicants[0].email)
        console.log(supabaseAdmin)

        if(response) {
            let { data, error } = await supabaseAdmin.auth.signUp({
                email: applicants[0].email,
                password: password,
            })
            if (error) {
                console.log(error)
            }
            if (data) {
                console.log(data)
                console.log(data.user.id)
                setRegResponse(data)
                sendInfo(data)
                const { data2, error } = await supabase
                    .from('BeautyLynk_Applicants')
                    .update({ isAccepted: true })
                    .eq("id", `${id}`)
                    .select("*")
                if(error){
                    console.log(error)
                }
                if(data2){
                    console.log("Updated applicant response", data2)
                    // setApplicants(data2)
                }
                emailjs.send("gmail","template_95wje5k",{
                    subject: " BeautyLynk Pro Application Update",
                    name: `${applicants[0].firstName}`,
                    message: `Your BeautyLynk Pro Application has been accepted! You will receieve a verification email soon, please confirm your account before signing in. Your account email is ${applicants[0].email} and your password is ${password}`,
                    email: applicants[0].email,
                });
            }
        }else{
            const { data, error } = await supabase
                .from('BeautyLynk_Applicants')
                .update({ isDeclined: true})
                .eq("id", `${id}`)
                .select("*")
            if(error){
                console.log(error)
            }
            if(data){
                console.log("Updated applicant response", data)
                setApplicants(data)
                emailjs.send("gmail","template_95wje5k",{
                    subject: "BeautyLynk Pro Application Update",
                    name: `${applicants[0].firstName}`,
                    message: `Your BeautyLynk Pro Application has been denied! We apologize for any inconvenience, apply again in the near future for another review`,
                    email: applicants[0].email,
                });
            }
        }
    }

    const sendInfo = async(rawData) => {
        if (rawData) {
            const { data, error } = await supabase
            .from('BeautyLynk_Pros_dup')
            .insert({ 
                firstName: applicants[0].firstName,
                lastName: applicants[0].lastName,
                // address: applicants[0].address,
                // address2: applicants[0].address2,
                // city: applicants[0].city,
                // state: applicants[0].state,
                // country: applicants[0].country,
                // zip: applicants[0].zip,
                email: applicants[0].email,
                phoneNum: applicants[0].number,
                location: applicants[0].location,
                allergies: applicants[0].allergies ? true : false,
                yearsLicensed: applicants[0].yearsLicensed,
                licenseNum: applicants[0].licenseNum,
                linkedIn: applicants[0].linkedIn,
                portfolio: applicants[0].portfolio,
                salesExp: applicants[0].salesExp,
                speciality: applicants[0].speciality,
                uuid: rawData.user.id
                // car:"",
                // contactPref:"",
                // datesAvailable:"",
                // reference: "",
                // notableClients:"",
            })
            .select("*")
            if(error){
                console.log(error)
            }
            if(data){
                console.log("Updated applicant response", data)
                setProInfo(data)
                // sendProText()
                // sendCustText()
                // console.log(data.id)
            }
        }
    }

    const dateFormat = (rawDate) => {
        var raw = new Date(rawDate)
        var newDate = raw.toDateString()
        // console.log("Date format test " + newDate)
        return newDate
    }

    const dateTimeFormat = (rawDate) => {
        var raw = new Date(rawDate)
        var newTime = raw.toLocaleTimeString("en-US")
        

        console.log("Time format test " + newTime, rawDate)
        return newTime
    }

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    return (
        <Layout>
            <button className="confirm-back-button"  onClick={() => navigate(-1)}>
                <img src="./icons/arrow-left--teal.svg" alt=""  />
            </button>
            <div className="applicant-container">
                <h1>BeautyLynk Applicant</h1>
                {/* <h4> {id}. Applicant ID: {applicants.map((applicant) => applicant.applicantID)}</h4> */}
                {applicants.map((applicant) => (
                    applicant.isAccepted ? 
                        <div className="booking-accepted">
                            <h2> This booking has been accepted</h2>
                        </div>

                        : applicant.isDeclined ? 
                            <div className="booking-cancelled">
                                <h2> This applicant has been declined</h2>
                            </div>

                        : rejected ? 
                            <div className="booking-rejected">
                                <h2> Thank you for your response! An email has been sent to {applicant.firstName}</h2>
                            </div>
                        : <div className="applicant-card">
                            <div className="applicant_name-container">
                                <h2>{applicant.firstName} {applicant.lastName}</h2>
                                <h4>Submitted : {dateFormat(applicant.created_at)} Available : {dateFormat(applicant.datesAvailable)}</h4>
                            </div>
                            <div className="applicant-details">
                            <div className="applicant-general">
                                    <h4>GENERAL INFO</h4>
                                    <h5>Address : {applicant.address}</h5> 
                                    <h5>Address 2 : {applicant.address2}</h5>
                                    <h5>City : {applicant.city}</h5>
                                    <h5>Country : {applicant.country}</h5>  
                                    <h5>Zip : {applicant.zip}</h5>
                                    <h5>Birthday : {applicant.birthday}</h5> 
                                    <h5>Email : {applicant.email}</h5> 
                                    <h5>Number : {applicant.phoneNum}</h5> 
                                    <h5>Contact Preference : {applicant.contactPref}</h5>
                            </div>

                                <div className="applicant-prof">
                                    <h4>PROFESSIONAL INFO</h4>
                                    <h5>LinkedIn : {applicant.linkedIn ? <a href={applicant.linkedIn.includes("http") ? applicant.linkedIn : `http://${applicant.linkedIn}`} target="_blank">{applicant.linkedIn}</a> : "None"}</h5> 
                                    <h5>Portfolio : {applicant.portfolio ? <a href={applicant.portfolio.includes("http") ? applicant.portfolio : `http://${applicant.portfolio}`} target="_blank">{applicant.portfolio}</a> : "None"}</h5> 
                                    <h5>Licensed : {applicant.isLicensed ? "Yes" : "No"}</h5>  
                                    {applicant.isLicensed ? <h5>License Number : {applicant.licenseNum}</h5> : ""}
                                    {applicant.isLicensed ? <h5>Years Licensed : {applicant.yearsLicensed}</h5> : ""}  
                                    <h5>Preferred Location : {applicant.location}</h5>
                                    <h5>Speciality : {applicant.speciality}</h5> 
                                    <h5>NotableClients : {applicant.notableClients ? applicant.notableClients : "None"}</h5> 
                                </div>

                                <div className="applicant-add">
                                    <h4>ADDITIONAL INFO</h4>
                                    <h5>Allergies : {applicant.allergies}</h5>
                                    <h5>Car : {applicant.car ? "Yes" : "None"}</h5> 
                                    <h5>Sales Experience : {applicant.salesExp ? "Yes" : "None"}</h5> 
                                    <h5>Reference : {applicant.reference ? applicant.reference : "None"}</h5>
                                    <h5>Accepted : {applicant.isAccepted ? "Yes" : "No"}</h5>  
                                </div>
                                                            
                            </div>
                            <br /><br />
                            <div className="applicant-btns">
                                <a className="applicant-confirm_btn" onClick={() => (
                                    <>
                                        {setRes(true)}
                                        {handleApplicant(true)}
                                    </>
                                )}>Accept</a>
                                <a className="applicant-decline_btn" onClick={() => (
                                    <>
                                        {setRejected(true)}
                                        {handleApplicant(false)}
                                    </>
                                )}>Decline</a>
                            </div>

                        </div>
                ))}
            </div>
        </Layout>
    )
}

export default ApplicantDetails
