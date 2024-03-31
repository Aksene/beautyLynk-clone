import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import { useAuth2 } from '../Auth/auth2'
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import './BookingConfirm.css'
import axios from 'axios'


function BookingConfirm() {
    const auth = useAuth2()
    const navigate = useNavigate();
    var date
    const [bookingInfo, setBookingInfo] = useState([])
    const [proInfo, setProInfo] = useState([])
    const [res, setRes] = useState(false)
    const [rejected, setRejected] = useState(false)
    const [proText, setProText] = useState({
        textmessage: '',
        recipient: ''
    })
    const [custText, setCustText] = useState({
        textmessage: `Good news, [Customer Name]! Your [Service Type] appointment on [Date] at [Time] has been confirmed. Your BeautyLynk Pro is [Professional's Name]. Get ready for a fantastic beauty experience!`,
        recipient: ''
    })
    const [success, setSuccess] = useState(false)

   if(bookingInfo){
        bookingInfo.map((booking) => {
            date = new Date(booking.date)

        })
   }
    

    localStorage.removeItem('prevURL');
    const search = useLocation().search;
    const id=new URLSearchParams(search).get("id");
    console.log("Search params: " + id)

    useEffect(() => {
        getBooking()
        getProInfo()
        console.log(auth.user)
        
       
    },[])

    const getProInfo = async() => {


        const {data, error} = await supabase
            .from('BeautyLynk_Pros')
            .select('*')
            .eq("email", `${auth.user.email}`)
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Pro information", data)
            setProInfo(data)

            // console.log(data.id)
        }
    }

    const getBooking = async() => {

        const {data, error} = await supabase
            .from('BeautyLynk_Bookings')
            .select('*')
            .eq("id", `${id}`)
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Booking information", data)
            setBookingInfo(data)

            // console.log(data.id)
        }
    }
    

    const handleConfirmation = async(response) => {
        console.log("Answer: " + response)
        let proID 
        proInfo.map((info) => (proID = info.id))
        console.log("testing ID: " + proID ) 
 
        const { data, error } = await supabase
            .from('BeautyLynk_Bookings')
            .update({ isAccepted: response, assignedPro: proID})
            .eq("id", `${id}`)
            .select("*")
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Updated booking response", data)
            setBookingInfo(data)
            // sendProText()
            // sendCustText()
            // console.log(data.id)
        }
    }

    const sendCustText = async () => {
        
        var { textmessage, recipient } = custText
        let proName 
        proInfo.map((info) => (proName = info.name))

        bookingInfo.map((booking) => {
            <>
                {textmessage = `Good news, ${booking.firstName}! Your ${booking.serviceType} appointment on ${booking.date} at ${booking.time} has been confirmed. Your BeautyLynk Pro is ${proName}. Get ready for a fantastic beauty experience!`}
                {recipient = booking.phoneNum}
            </>
        })
        console.log("Customer text: " + textmessage, recipient)

        // pass variables within query string
        try {
            const response = await axios.post("http://localhost:4000/send-text?", {
                    recipient: recipient,
                    textMessage: textmessage,

            })

            console.log("Twilio | data", response.data.success);
            if(response.data.success) {
                console.log("Message Sent!")
                setSuccess(true)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const sendProText = async () => {
        
        var { textmessage, recipient } = proText
        proInfo.map((info) => (recipient = info.phoneNum))
        
        bookingInfo.map((booking) => {
            textmessage = `This is BeautyLynk!  We are excited to confirm that you've accepted your next appointment for ${booking.serviceType}. Here are the details: ${booking.firstName} ${booking.lastName} Date: ${date.toDateString()} Time: ${booking.time} Location: ${booking.aptAddress1}${booking.aptAddress2 ? ` ${booking.aptAddress2},` : ","} ${booking.aptCity}, ${booking.aptState}. Reach out to us if you need anything on your dashboard https://beautylynk-clone.vercel.app/dashboard`
        })
        console.log("Pro text: " + textmessage, recipient)

        // pass variables within query string
        try {
            const response = await axios.post("http://localhost:4000/send-text?", {
                    recipient: recipient,
                    textMessage: textmessage,
            })

            console.log("Twilio | data", response.data.success);
            if(response.data.success) {
                console.log("Message Sent!")
                setSuccess(true)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    function formatAMPM(dateRaw) {
        // const test = document.getElementById("time")
        const timeArray = dateRaw.split(":")
        var hours = timeArray[0];
        var minutes = timeArray[1];
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? ''+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        // bookingInfo.time = strTime
        // console.log("New Time", strTime)
        return strTime;
    }

    
    return (
        <Layout>
            <br />
            <button className="confirm-back-button"  onClick={() => navigate(-1)}>
                <img src="./icons/arrow-left--teal.svg" alt=""  />
            </button>
            <div className="booking-container">
                <h1>Booking Confirmation</h1>
                    {bookingInfo.map((booking, index) => {
                        return(
                            booking.isAccepted ? 
                                <div className="booking-accepted">
                                    <h2> This booking has been accepted</h2>
                                </div>

                                : booking.isCancelled ? 
                                    <div className="booking-cancelled">
                                        <h2> This booking has been cancelled</h2>
                                    </div>

                                : rejected ? 
                                    <div className="booking-rejected">
                                        <h2> Thank you for your response! We will be in touch with plenty more exciting opportunities</h2>
                                    </div>
                                : <div className="bookingConfirm-wrap">
                                    <div className="booking-detail">
                                        {console.log(booking)}
                                        {console.log("Old date:" + booking.date )}
                                        {console.log("Date test: " + date.toDateString())}
                                        
                                        <h2>Service: {booking.serviceType}, Type: {booking.service}</h2>
                                        <h3>{booking.aptCity}, {booking.aptState}, {booking.aptCountry} {booking.aptZip}</h3>
                                        <h4>{date.toDateString()} at {formatAMPM(booking.time)}</h4>
                                        <br />
                                        <div className="booking-spec">
                                            {
                                                booking.serviceType === "HENNA" ? 
                                                    <div className="booking-specs_info">
                                                        <h4>HENNA DETAILS:</h4>
                                                        <h5>Henna Size: {booking.hennaSize}</h5>
                                                        <h5>Henna Design: {booking.hennaDesign ? "Yes" : "None"}</h5>
                                                        <h5>Henna Length: {booking.hennaLength}</h5>
                                                        <h5>Henna Color: {booking.hennaColor}</h5>
                                                    </div>
                                                : booking.serviceType === "NAIL" ?
                                                    <div className="booking-specs_info">
                                                        <h4>NAIL DETAILS</h4>
                                                        <h5>Nail Description: {booking.nailDesc}</h5>
                                                        <h5>Nail Shape: {booking.nailShape}</h5>
                                                        <h5>Nail Polish: {booking.nailPolish}</h5>
                                                        <h5>Nail Polish Other: {booking.nailPolishOther ? booking.nailPolishOther : "None"}</h5>
                                                    </div>
                                                : booking.serviceType === "MAKEUP" ?
                                                    <div className="booking-specs_info">
                                                        <h4>MAKEUP DETAILS:</h4>
                                                        <h5>Skin Type: {booking.skinType}</h5>
                                                        <h5>Skin Complexion: {booking.skinComplexion}</h5>
                                                        <h5>Allergies: {booking.allergies ? booking.allergies : "None"}</h5>
                                                        <h5>Skin Conditions: {booking.skinConditions}</h5> 
                                                        <h5>Makeup Look: {booking.makeupLook}</h5>
                                                        <h5>Makeup Lashes: {booking.makeupLashes}</h5>
                                                    </div>
                                                : booking.serviceType === "HAIR" ?
                                                    <>
                                                        <div className="booking-specs_info">
                                                            <h4>HAIR DETAILS:</h4>
                                                            <h5>Hair Type: {booking.hairType}</h5> 
                                                            {
                                                                booking.hairType === "CURLY" || booking.hairType === "COILY" ?
                                                                    <>
                                                                        <h5>Curl Pattern: {booking.curlPattern}</h5> 
                                                                        <h5>Hair Care: {booking.hairCare}</h5> 
                                                                    </>
                                                                :""
                                                            }
                                                            <h5>Hair Density: {booking.hairDensity}</h5>
                                                            {
                                                                booking.service === "Blowout" ?
                                                                    <>
                                                                        <h5>Hair Extension: {booking.hairExt ? "Yes" : "No"}</h5>
                                                                        {booking.hairExt ? <h5>Hair Extension Type: {booking.hairExtType}</h5> : ""}
                                                                    </>
                                                                :""
                                                            }
                                                            {
                                                                bookingInfo.service === "Locs Extensions" || bookingInfo.service === "Signature Braid Style w/added hair" || bookingInfo.service === "Wig Installation" ?
                                                                    <>
                                                                        <h5>Hair Loss: {booking.hairLoss ? "Yes" : "No"}</h5>
                                                                        <h5>Hair Loss Diagnostic: {booking.hairLossDiag ? "Yes" : "No"}</h5>
                                                                        <h5>Hair Loss Cause: {booking.hairLossCause}</h5>
                                                                    </>
                                                                :""
                                                            }
                                                            {
                                                                booking.service_detail === "Natural Hair" ||  booking.service.includes("Loc")?
                                                                    <>
                                                                        <h5>Need Hair Dried: {booking.hairDry ? "Yes" : "No"}</h5>
                                                                    </>
                                                                :""
                                                            }
                                                            {
                                                                booking.service.includes("Loc") ?
                                                                    <>
                                                                        <h5>Loc Age: {booking.locTime}</h5>
                                                                        <h5>Colored Locs: {booking.locTime ? "Yes" : "No"}</h5>
                                                                    </>
                                                                :""
                                                            }
                                                            {
                                                                booking.service_detail === "Braided Extension" ?
                                                                    <>
                                                                        <h5>Braids Length: {booking.braidsLength}</h5>
                                                                        <h5>Braids Size: {booking.braidsSize}</h5>
                                                                    </>
                                                                :""
                                                            }
                                                            {
                                                                booking.service.includes("Cornrow") ?
                                                                    <>
                                                                        <h5>Cornrow Count: {booking.cornrowsCount}</h5>
                                                                        <h5>Cornrow Style: {booking.cornrowsStyle}</h5>
                                                                    </>
                                                                :""
                                                            }
                                                            {/* <h5>Minor: {booking.childSupervision ? "Yes" : "No"}</h5> */}
                                                        </div>
                                                        <div className="booking-specs_info">
                                                            {
                                                                booking.service.includes("Custom Wig Installation") ?
                                                                    <>
                                                                        <h4>CUSTOM WIG MEASUREMENTS:</h4>
                                                                        {
                                                                            booking.customWigSize === "Custom" ? 
                                                                                <>
                                                                                    <h5>Circumference: {booking.customWigSizeCirc}</h5>
                                                                                    <h5>Front to nape: {booking.customWigSizeNape}</h5>
                                                                                    <h5>Ear to ear across forehead: {booking.customWigSizeForehead}</h5>
                                                                                    <h5>Ear to ear overtop head: {booking.customWigSizeOverlap}</h5> 
                                                                                    <h5>Temple to temple around back:: {booking.customWigSizeTempleBack}</h5>
                                                                                    <h5>Nape of neck: {booking.customWigSizeNeck}</h5> 
                                                                                </>
                                                                            : booking.customWigSize === "Small" ? 
                                                                                <>
                                                                                    <h5>Circumference: 21-21.5”</h5>
                                                                                    <h5>Front to nape: 13.5"</h5>
                                                                                    <h5>Ear to ear across forehead: 11.5”</h5>
                                                                                    <h5>Ear to ear overtop head: 12"</h5> 
                                                                                    <h5>Temple to temple around back:: 15"</h5>
                                                                                    <h5>Nape of neck: 5"</h5> 
                                                                                </>
                                                                            : booking.customWigSize === "Medium" ? 
                                                                                <>
                                                                                    <h5>Circumference: 22-22.5"</h5>
                                                                                    <h5>Front to nape: 14"</h5>
                                                                                    <h5>Ear to ear across forehead: 12"</h5>
                                                                                    <h5>Ear to ear overtop head: 12.5"</h5> 
                                                                                    <h5>Temple to temple around back:: 15.5"</h5>
                                                                                    <h5>Nape of neck: 5.5</h5> 
                                                                                </>
                                                                            : booking.customWigSize === "Large" ? 
                                                                                <>
                                                                                    <h5>Circumference: 23-23.5"</h5>
                                                                                    <h5>Front to nape: 15"</h5>
                                                                                    <h5>Ear to ear across forehead: 12.5"</h5>
                                                                                    <h5>Ear to ear overtop head: 13.5"</h5> 
                                                                                    <h5>Temple to temple around back:: 16"</h5>
                                                                                    <h5>Nape of neck: 6"</h5> 
                                                                                </>
                                                                            : ""
                                                                        }
                                                                        
                                                                    </>
                                                                :""
                                                            }
                                                        </div>
                                                        <div className="booking-specs_info">
                                                            {
                                                                booking.service_detail === "Wig Installation" ?
                                                                    <>
                                                                        <h4>WIG DETAILS:</h4>
                                                                        <h5>Wig Already Purchased: {booking.wigPurchased ? "Yes" : "No"}</h5>
                                                                        <h5>Need Assistance Purchasing Wig: {booking.wigPurchaseAsst ? "Yes" : "No"}</h5>
                                                                        <h5>Wig Hair Type: {booking.wigHairType}</h5>
                                                                        <h5>Wig Install Type: {booking.wigInstallType}</h5>
                                                                        <h5>Wig Budget: {booking.wigPrice}</h5>
                                                                        <h5>Need Wig Styled: {booking.upchargeWigStyle ? "Yes" : "No"}</h5>
                                                                    </>
                                                                :""
                                                            }
                                                            {
                                                                booking.service.includes("Custom Wig Installation") ?
                                                                    <>
                                                                        <h4>CUSTOM WIG DETAILS:</h4>
                                                                        <h5>Measurements Already Known: {booking.customWigSizeCheck ? "Yes" : "No"}</h5>
                                                                        <h5>Measurements: {booking.customWigSize }</h5>
                                                                        <h5>Install Type: {booking.customWigInstallType}</h5>
                                                                        <h5>Hair Type: {booking.customWigHairType}</h5>
                                                                        <h5>Style: {booking.customWigStyle}</h5>
                                                                        <h5>Density: {booking.customWigDensity}</h5>
                                                                        <h5>Texture: {booking.customWigTexture}</h5>
                                                                        <h5>Custom Color: {booking.upchargeCustomWigColor ? "Yes" : "No"}</h5>
                                                                        <h5>Need Installed: {booking.upchargeCustomWigInstall ? "Yes" : "No"}</h5>
                                                                        <h5>Reason For Wig: {booking.customWigReason}</h5>
                                                                    </>
                                                                :""
                                                            }
                                                        </div>
                                                        
                                                    </>
                                                : ""
                                            }
                                            <div className="booking-specs_info">
                                                <h4>GENERAL:</h4>
                                                <h5>Sensitive Scalp: {booking.upchargeScalp ? "Yes" : "No"}</h5>
                                                <h5>Available Parking: {booking.upchargeParking ? "Yes" : "No"}</h5>
                                                <h5>Smoke Environment: {booking.smokeFree ? "Yes" : "No"}</h5>
                                                <h5>Stairs: {booking.upchargeStairs ? "Yes" : "No"}</h5>
                                                <h5>Pets: {booking.pet ? "Yes" : "No"}</h5> 
                                                <h5>Pets Type: {booking.petType}</h5>
                                                <h5>Special Accommodations: {booking.specialAcc ? "Yes" : "No"}</h5>
                                                <h5>Special Accommodations Type: {booking.specialAccType ? "Yes" : "No"}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="booking-payment">
                                        <h1>Payout: ${booking.payout}</h1>
                                    </div>
                                    <div className="booking-confirmation">
                                        <div className="confirmation-text">
                                            <h3>Do you want to accept this booking?</h3>
                                        </div>
                                        <div className="confirmation-btns">
                                            <a onClick={() => (
                                                <>
                                                    {setRes(true)}
                                                    {handleConfirmation(true)}
                                                </>
                                            )}>Yes</a>
                                            <a onClick={() => (
                                                <>
                                                    {setRejected(true)}
                                                    {}
                                                </>
                                            )}>No</a>
                                        </div>
                                    </div>
                                </div>
                        )
                    })}
                    <br/><br/><br/><br/>
            </div>
        </Layout>
    )
}

export default BookingConfirm
