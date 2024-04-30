import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import './BookNow.css'
import { useLocation } from 'react-router-dom'
// import StripeContainer from './components/StripeContainer';
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from "../components/PaymentForm"

import Calendar from 'react-calendar';


const PUBLIC_KEY = "pk_test_51MoCtmEVU6ZnQpdRdHaK75tHjASejdCH7Gy3WHNeoLZBgK7fcfxqxAgqTAhpqNzwo6PjrqtOsqM85tv4RHBJkhYP00KMP9pjog"

const stripeTestPromise = loadStripe(PUBLIC_KEY)


function BookNow() {
    const [bookingInfo, setBookingInfo] = useState({
        location: "",
        serviceType: "",
        service: "",
        servicesDesc: "",
        servicePrice: 0,
        totalPrice: 0,
        payout:0,
        date: "",
        time: "",
        timezone:"",
        // Hair
        hairServiceDetail:"",
        hairExt: "",
        hairExtType: "",
        hairClass: "",
        hairType: "",
        hairLoss: "",
        hairLossDiag: "",
        hairLossCause: "",
        curlPattern: "",
        hairDensity: "",
        hairCare: "",
        hairDry: "",
        locTime: "",
        locColor: "",
        childSupervision: "",
        braidsLength: "",
        braidsLengthVal: "",
        braidsSizeVal: "",
        braidsSize:"",
        cornrowsCountVal: "",
        upchargeCornrowsCount: "",
        cornrowsCount:"",
        upchargeBraidsSize: "",
        upchargeBraidsLength:"",
        cornrowsStyle:"",
        // Wig
        wigPurchased: "",
        wigPurchaseAsst: "",
        wigHairType: "",
        wigInstallType: "",
        wigPrice: "",
        upchargeWigStyle: "",
        // Custom Wig
        customWigSizeCheck:"",
        customWigSize:"",
        customWigSizeCirc:"",
        customWigSizeNape:"",
        customWigSizeForehead:"",
        customWigSizeOverlap:"",
        customWigSizeTempleBack:"",
        customWigSizeNeck:"",
        customWigColor:"",
        customWigInstallType:"",
        customWigHairType: "",
        customWigStyle:"",
        customWigDensity:"",
        customWigDensityVal:"",
        customWigTexture:"",
        customWigHeadMeasurement:"",
        customWigReason:"",
        upchargeCustomWigDensity:"",
        upchargeCustomWigInstall:"",
        upchargeCustomWigColor: "",
        // Skin
        skinType: "",
        skinComplexion: "",
        allergies: "",
        skinConditions: "",
        // Makeup
        makeupLook: "",
        makeupLashes: "",
        // Henna
        hennaSize: "",
        upchargeHennaSize:"",
        hennaSizeVal: "",
        hennaDesign: "",
        hennaLength: "",
        upchargeHennaLength:"",
        hennaLengthVal: "",
        hennaColor:"",
        //Nail
        nailDesc: "",
        nailShape: "",
        nailPolish: "",
        nailPolishOther: "",
        // General, upcharges & appointment
        pet: "",
        petType: "",
        specialAcc: "",
        specialAccType: "",
        upchargeParking: "",
        upchargeScalp: "",
        upchargeStairs: "",
        upchargeQuietServ: "",
        smokeFree: "",
        aptAddress1: "",
        aptAddress2: "",
        aptCity: "",
        aptState: "",
        aptCountry: "",
        aptZip:""
    })
    // const [aptLoc, setAptLoc] = useState({
    //     aptAddress1: "",
    //     aptAddress2: "",
    //     aptCityState: "",
    //     aptZip:""
    // })
    const [cities, setCities] = useState([])
    const [services, setServices] = useState([])
    const [hairType, setHairType] = useState([])
    const [skinComplex, setSkinComplex] = useState([])
    const [showPayment, setShowPayment] = useState(false)
    const [emptyInfo, setEmptyInfo] = useState(bookingInfo)
    const [calDate, setCalDate] = useState([])


    // Now we can get the session or user object
    // const {user} = await supabase.auth.getUser()
    // console.log("user object: " + user)
    

    // Grabs info from JumboHero on the homepage
    const stateBookingInfo = useLocation().state.homeInfo;
    console.log("Props State Value - ", stateBookingInfo)

    

    useEffect(() => {
        updateBookingFromState()
        getCities()
        getServices()
        getHairType()
        getSkinComplex()
       
    },[])

    const updateBookingFromState = (e, raw) => {
        if (stateBookingInfo) {
            bookingInfo["location"] = stateBookingInfo.location
            bookingInfo["date"] = stateBookingInfo.date
            bookingInfo["time"] = stateBookingInfo.time
            bookingInfo["timezone"] = stateBookingInfo.timezone
            bookingInfo["serviceType"] = stateBookingInfo.serviceType
        }
    }

    var mobileAtt
    const width = window.screen.width
     if (width >= 800){
        mobileAtt = {
            height: "100%",
            gridTemplateColumns: "1fr 0.60fr"
            // etc
        }
        console.log("Attributes for calender hero: ",mobileAtt)
    }else {
        mobileAtt = {
            height: "100%",
            gridTemplateColumns: "1fr"
            // etc
        }
        console.log("Attributes for calender hero: ",mobileAtt)
    }

    // const resetForm = (alert) => {
    //     alert(alert);

    //     var newFormData = { ...bookingInfo};

    //     newFormData = {...emptyInfo}
    //     newFormData["location"] = bookingInfo.location
    //     newFormData["date"] = bookingInfo.date
    //     newFormData["time"] = bookingInfo.time
    //     newFormData["timezone"] = bookingInfo.timezone
    //     newFormData["hairType"] = bookingInfo.hairType
    //     newFormData["hairDensity"] = bookingInfo.hairDensity
    //     newFormData["serviceType"] = bookingInfo.serviceType

    //     setBookingInfo(newFormData)
    // }

    const handleInputChange = (e) => {
        console.log(e.target)
        const fieldName = e.target.getAttribute("name")
        let fieldValue = e.target.value;

        console.log("Field Value: " + fieldValue)
        console.log("Field Name: " + fieldName)

        if (fieldValue === 'true' || fieldValue === 'false') {
            fieldValue = fieldValue === 'true' ? true : false
        }

        var newFormData = { ...bookingInfo};

        if (fieldName == "childSupervision") {
            console.log("childSupervision changed")
            if(fieldValue || fieldValue === "") {
                console.log("childSupervision true")
                newFormData[fieldName] = fieldValue
            }else {
                console.log("childSupervision false")
                alert("We do not perform services for youth under the age of 18 without a parent or adult being on-site");

                var newFormData = { ...bookingInfo};

                newFormData = {...emptyInfo}
                newFormData["location"] = bookingInfo.location
                newFormData["date"] = bookingInfo.date
                newFormData["time"] = bookingInfo.time
                newFormData["hairType"] = bookingInfo.hairType
                newFormData["hairDensity"] = bookingInfo.hairDensity
                newFormData["serviceType"] = bookingInfo.serviceType

                setBookingInfo(newFormData)
            }
        }

         // Resets the service & hairType when serviceType is changed
        if (fieldName === "serviceType" && (fieldValue === "HAIR" || fieldValue === "MAKEUP" || fieldValue === "NAIL" || fieldValue === "HENNA" )) {
            newFormData = {...emptyInfo}
            newFormData["location"] = bookingInfo.location
            newFormData["date"] = bookingInfo.date
            newFormData["time"] = bookingInfo.time
            newFormData["timezone"] = bookingInfo.timezone
        }
        // Resets the fields when service is changed
        if (fieldName === "service"){
            newFormData = {...emptyInfo}
            newFormData["location"] = bookingInfo.location
            newFormData["date"] = bookingInfo.date
            newFormData["time"] = bookingInfo.time
            newFormData["timezone"] = bookingInfo.timezone
            newFormData["hairType"] = bookingInfo.hairType
            newFormData["hairDensity"] = bookingInfo.hairDensity
            newFormData["serviceType"] = bookingInfo.serviceType
            
            services.map((val,index) => (
                fieldValue === val.service ? 
                    newFormData["servicePrice"] = val.service_price
                : ""
            ))
            
        }

        // Check if Upcharges are in the correct form
        if (fieldName === "upchargeScalp" || fieldName === "upchargeStairs" || fieldName === "upchargeParking" || fieldName === "upchargeQuietServ" || fieldName === "makeupLashes" || fieldName === "upchargeWigStyle" || fieldName === "upchargeCustomWigColor" || fieldName === "upchargeCustomWigInstall") {
            newFormData[fieldName] = fieldValue === "" ? 0 : parseInt(fieldValue)
            // alert("New price for "+fieldName +": " + typeof parseInt(fieldValue))
        } else if (fieldName === "hennaSizeVal" ||  fieldName === "hennaLengthVal" || fieldName === "braidsSizeVal" || fieldName === "cornrowsCountVal" || fieldName === "customWigDensityVal") {
                if (fieldValue === "") {
                    // Checks to see if val variables are being set to empty so 
                    let tempTest = fieldName.replace('Val','')
                    let tempTest2 = tempTest.charAt(0).toUpperCase() + tempTest.slice(1);
                    tempTest2 = "upcharge"+tempTest2
                    newFormData[tempTest] = ""
                    newFormData[tempTest2] = ""
                    console.log("temp test: "+tempTest2)
                }

                // Custom logic to split complex select values 
                // And assign them to the correct variables
                const tempVal = fieldValue.split('/ ')
                console.log("Temp values for " + fieldName + ": " + tempVal[2])
                const val = tempVal[0]
                const upcharge = tempVal[1]
                const upchargeVal = tempVal[2]
                const rawVal = tempVal[3]
                if (upchargeVal === '') {
                    console.log("[IF] Temp values for " + fieldName + ": " + tempVal[2])
                    newFormData[fieldName] = fieldValue
                    newFormData[rawVal] = ""
                    newFormData[upcharge] = ""
                }else {
                    console.log("[ELSE] Temp values for " + fieldName + ": " + tempVal[2])
                    newFormData[rawVal] = val
                    newFormData[fieldName] = fieldValue
                    newFormData[upcharge] = upchargeVal === "" ? 0 : parseInt(upchargeVal)
            }
            
        } else if (fieldName === "date") {
            // Check to see if the date chosen is older than today
            var GivenDate = new Date(fieldValue)
            var CurrentDate = new Date();
            // Gets rid of Timezone offset
            GivenDate = new Date( GivenDate.getTime() - GivenDate.getTimezoneOffset() * -60000 );
            console.log("Current Date: " + CurrentDate +" vs. Given Date: " + GivenDate)

            if(GivenDate >= CurrentDate){
                // alert('Given date is greater than the current date.');
                newFormData[fieldName] = fieldValue
            }else{
                alert('Please select a date that is not in the past');
                newFormData[fieldName] = ""
                newFormData["time"] =  ""
                newFormData["timezone"] =  ""
            }
        } else if (fieldName === "time"){
            // Time limits
            var startTime = '9:00:00';
            var endTime = '20:00:00';

            const currentDate = new Date()   

            // Set start date
            const startDate = new Date(currentDate.getTime());
            startDate.setHours(startTime.split(":")[0]);
            startDate.setMinutes(startTime.split(":")[1]);
            // Set end date
            const endDate = new Date(currentDate.getTime());
            endDate.setHours(endTime.split(":")[0]);
            endDate.setMinutes(endTime.split(":")[1]);

            currentDate.setHours(fieldValue.split(":")[0]);
            currentDate.setMinutes(fieldValue.split(":")[1])


            const valid = startDate < currentDate && endDate > currentDate
            console.log("Start time: " + startDate +" Current time: " + currentDate +" End Date: " + endDate)
            console.log("Is time selected valid:", valid)

            if (valid) {
                newFormData[fieldName] = fieldValue
            }else{
                console.log('Please select a time between 9:00 AM and 8:00 PM');
                newFormData[fieldName] = ""
            }
            

        } else {
            newFormData[fieldName] = fieldValue
        }

        if (showPayment) {
            setShowPayment(false)
            bookingInfo["totalPrice"] = bookingInfo.servicePrice
        }

        // if (fieldName === "time"){
        //     newFormData["time"] = formatAMPM(fieldValue)
        // }

        if (fieldName === "upchargeScalp" || fieldName === "upchargeStairs" || fieldName === "upchargeParking" || fieldName === "upchargeQuietServ" || fieldName === "makeupLashes" || fieldName === "upchargeWigStyle"){
            // bookingInfo.servicePrice + bookingInfo.upchargeParking + bookingInfo.upchargeScalp + bookingInfo.upchargeStairs + bookingInfo.upchargeQuietServ + bookingInfo.upchargeWigStyle + bookingInfo.makeupLashes
            console.log("UPCHARGE CHANGE for "+fieldName+":", fieldValue === "" ? 0 : parseInt(fieldValue))
        }

        
        console.log("New form data: ", newFormData)
        setBookingInfo(newFormData)
    }   

    // const handleBookingInfoFormSubmit = async(e) => {
    //     e.preventDefault();
    //     console.log("event: Booking info: ", bookingInfo)

    //     // const formData = {
    //     //     location: "",
    //     //     service: "",
    //     //     date: "",
    //     //     time: "",
    //     // }

    //     // setBookingInfo(formData)

    //     const newBooking = { ...bookingInfo}

    //     console.log("Info to be sent to supabase",newBooking)

    //     // if(newBooking) {
    //     //     // With upsert, if upload exist it updates it and if not it will insert a new row
    //     //     const {data, error} = await supabase.from("BeautyLynk_Bookings").insert({
    //     //         location: newBooking.location,
    //     //         service: newBooking.service,
    //     //         date: newBooking.date,
    //     //         time: newBooking.time,
    //     //     })
    //     //     if(error) {
    //     //         console.log(error)
    //     //         alert(error.message)
    //     //     }
    //     //     if(data) {
    //     //         console.log(data)
    //     //         setBookingInfo({
    //     //             location: "",
    //     //             service: "",
    //     //             date: "",
    //     //             time: "",
    //     //         })
    //     //     }
    //     // }
    // }

    const getCities = async() => {
        let info = [];

        const {data, error} = await supabase
            .from('BeautyLynk_Cities')
            .select('city, state, city_status')
            .order('city')
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Data cities for user")
            console.log(data)
            setCities(data)

            // console.log(data.id)
        }
    }

    const getServices = async() => {
        let info = [];

        const {data, error} = await supabase
            .from('BeautyLynk_Services')
            .select('*')

        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Data services for user")
            console.log(data)
            setServices(data)

            // console.log(data.id)
        }
    }

    const getHairType = async() => {
        let info = [];

        const {data, error} = await supabase
            .from('hairtype')
            .select('hair_type')

        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Data hair type for user")
            console.log(data)
            setHairType(data)

            // console.log(data.id)
        }
    }

    const getSkinComplex = async() => {
        let info = [];

        const {data, error} = await supabase
            .from('skinComplexion')
            .select('hexCode, fentyFoundationShade')

        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Data skin complexion for user")
            console.log(data)
            setSkinComplex(data)

            // console.log(data.id)
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

    function changeDate(rawDate) {
        var newFormData = { ...bookingInfo};

        newFormData["date"] = rawDate.toLocaleDateString()

        console.log("New Form:", newFormData)

        setBookingInfo(newFormData)

    }

  

    return (
        <Layout>
            <div className="book-now-container">
                <div className="form-wrap">
                    { showPayment ? "" : 
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            bookingInfo["totalPrice"] = 
                                bookingInfo.servicePrice 
                                    + (bookingInfo.upchargeParking === "" ? 0 : parseInt(bookingInfo.upchargeParking))
                                    + (bookingInfo.upchargeScalp === "" ? 0 : parseInt(bookingInfo.upchargeScalp))
                                    + (bookingInfo.upchargeStairs === "" ? 0 : parseInt(bookingInfo.upchargeStairs))
                                    + (bookingInfo.upchargeQuietServ === "" ? 0 : parseInt(bookingInfo.upchargeQuietServ))
                                    + (bookingInfo.makeupLashes === "" ? 0 : parseInt(bookingInfo.makeupLashes))
                                    + (bookingInfo.upchargeWigStyle === "" ? 0 : parseInt(bookingInfo.upchargeWigStyle))
                                    + (bookingInfo.upchargeHennaSize === "" ? 0 : parseInt(bookingInfo.upchargeHennaSize))
                                    + (bookingInfo.upchargeHennaLength === "" ? 0 : parseInt(bookingInfo.upchargeHennaLength))
                                    + (bookingInfo.upchargeBraidsLength === "" ? 0 : parseInt(bookingInfo.upchargeBraidsLength))
                                    + (bookingInfo.upchargeBraidsSize === "" ? 0 : parseInt(bookingInfo.upchargeBraidsSize))
                                    + (bookingInfo.upchargeCornrowsCount === "" ? 0 : parseInt(bookingInfo.upchargeCornrowsCount))
                                    + (bookingInfo.upchargeCustomWigDensity === "" ? 0 : parseInt(bookingInfo.upchargeCustomWigDensity))
                                    + (bookingInfo.upchargeCustomWigInstall === "" ? 0 : parseInt(bookingInfo.upchargeCustomWigInstall))
                                    + (bookingInfo.upchargeCustomWigColor === "" ? 0 : parseInt(bookingInfo.upchargeCustomWigColor))
                            bookingInfo["payout"] = bookingInfo.totalPrice*.80
                            console.log("Booking form info: ", bookingInfo)
                            console.log("Please fill the payment form below")
                            setShowPayment(true)
                        }}>
                        <h1>Main Questions</h1>
                            <div className="book-now-field">

                                <label htmlFor="">Where is your appointment?</label>
                                <select  name="location" type="text" required value={bookingInfo.location} onChange={e => handleInputChange(e)}>
                                    <option 
                                        onChange={bookingInfo.location === "" ? bookingInfo.date = "" : "" }
                                        value="" defaultValue>Select location</option>
                                    {cities.map((val, index) => (
                                        val.city_status === "live" ?
                                            <option value={val.city} >{val.city}</option>
                                        : ""
                                    ))}
                                </select>
                            </div>
                            <div style={{...mobileAtt}} className={bookingInfo.location === "" ? "book-now-field_hidden" : "book-now-field"}>
                                <label htmlFor="">When do you want your appointment?</label>
                                
                                {/* <Calendar
                                    style={{color: "white"}}
                                    value={bookingInfo.date}
                                    tileClassName={bookingInfo.location === "" ? "react-calendar__tile_hidden" : "react-calendar__tile"}
                                    onChange={bookingInfo.date === "" ? bookingInfo.time = "" : "" } 
                                    disabled={bookingInfo.location === "" ? true : false} type="date" name="date" required value={bookingInfo.date} onClickDay={date => changeDate(date)} 
                                ></Calendar> */}
                                <input
                                    placeholder={ bookingInfo.date ? "" : "MM/DD/YYYY"}
                                    onChange={bookingInfo.date === "" ? bookingInfo.time = "" : "" } 
                                    disabled={bookingInfo.location === "" ? true : false} type="date" name="date" required value={bookingInfo.date} onChange={e => handleInputChange(e)}
                                />
                            </div>
                            <div className={bookingInfo.date === "" ? "book-now-field_hidden" : "book-now-field"}>
                                <label htmlFor="">What time do you want your appointment? (Select a time between 9AM and 8PM)</label>
                                <div className="book-now_time">
                                    <input 
                                        placeholder={ bookingInfo.time ? "" : "--:-- --"}
                                        onChange={bookingInfo.time === "" ? bookingInfo.serviceType = "" : "" } 
                                        disabled={bookingInfo.date === "" ? true : false} id="time" type="time" name="time" min="9:00" max="20:00" required value={bookingInfo.time}  onChange={e => handleInputChange(e)}
                                    />
                                    <select name="timezone" id="timezone" name="timezone" disabled={bookingInfo.date === "" ? true : false} required value={bookingInfo.timezone} onChange={e => handleInputChange(e)}>
                                        <option value="" defaultValue>Select a time zone</option>
                                        <option value="Eastern Time Zone">Eastern Time Zone</option>
                                        <option value="Central Time Zone">Central Time Zone</option>
                                        <option value="Mountain Time Zone">Mountain Time Zone</option>
                                        <option value="Pacific Time Zone">Pacific Time Zone</option>
                                        <option value="Hawaiian Time Zone">Hawaiian Time Zone</option>
                                        <option value="Alaskan Time Zone">Alaskan Time Zone</option>
                                    </select>
                                </div>
                            </div>
                            <div className={bookingInfo.timezone === "" ? "book-now-field_hidden" : "book-now-field"}>
                                <label htmlFor="">What kind of services are you looking for?</label>
                                <select 
                                    disabled={bookingInfo.timezone === "" ? true : false} name="serviceType" required value={bookingInfo.serviceType} onChange={e => handleInputChange(e)}>
                                    <option 
                                        value="" defaultValue>Select a service type
                                    </option>
                                    <option value="HAIR" >Hair</option>
                                    <option value="MAKEUP" > Luxe Makeup</option>
                                    <option value="NAIL" >Nail</option>
                                    <option value="HENNA" >Henna</option>
                                </select>
                            </div>
                            {/* ---------- MAKEUP INPUTS ---------- */}
                            {
                                bookingInfo.serviceType === "MAKEUP" ?  
                                    <div>
                                        <h1>TELL US ABOUT YOUR SKIN</h1>
                                        {/* <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">What kind of makeup service are you looking for?</label>
                                            <select disabled={bookingInfo.serviceType === "" ? true : false} name="service" required value={bookingInfo.service} onChange={e => handleInputChange(e)}>
                                                <option 
                                                    onChange={bookingInfo.service === "" ? bookingInfo.skinType = "" : "" }
                                                    value="" defaultValue>Select a service</option>
                                                {services.map((val, index) => (
                                                    bookingInfo.serviceType === val.service_type ?
                                                        val.service_live ?
                                                            <option key={index} value={val.service} >{val.service}</option>
                                                        : ""
                                                    : ""
                                                ))}
                                            </select>
                                        </div> */}
                                        <div style={{display: "none"}}>
                                            {bookingInfo.service = "Luxe Makeup"}
                                            {bookingInfo.servicePrice = 150}
                                        </div>
                                        <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">What is your skin type?</label>
                                            <select disabled={bookingInfo.service === "" ? true : false} name="skinType" required value={bookingInfo.skinType} onChange={e => handleInputChange(e)}>
                                                <option 
                                                    onChange={bookingInfo.skinType === "" ? bookingInfo.skinComplexion = "" : "" } 
                                                    value="" defaultValue>Select a type</option>
                                                <option value="Normal">Normal</option>
                                                <option value="Dry">Dry</option>
                                                <option value="Combination">Combination</option>
                                                <option value="Oily">Oily</option>
                                                <option value="Sensitive">Sensitive</option>                                            
                                            </select>
                                        </div>
                                        <div className={bookingInfo.skinType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <div>
                                                <label htmlFor="">What is your skin complexion?</label>
                                                <p className={bookingInfo.skinType === "" ? "book-now-field_noteHidden" : "book-now-field_note"}>
                                                    * BeautyLynk uses the <a href="https://www.sephora.com/product/pro-filtr-soft-matte-longwear-foundation-P87985432" target="_blank">Fenty</a> foundation shade.
                                                </p>
                                            </div>
                                            <select className="book-now-field_note-input" disabled={bookingInfo.skinType === "" ? true : false} name="skinComplexion" type="text" required value={bookingInfo.skinComplexion} onChange={e => handleInputChange(e)} style={{height: "70%"}}>
                                                <option 
                                                    onChange={bookingInfo.skinComplexion === "" ? bookingInfo.allergies = "" : "" }
                                                    value="" defaultValue>Select a type</option>
                                                {skinComplex.map((val, index) => (
                                                    <option value={val.fentyFoundationShade} >{val.fentyFoundationShade}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={bookingInfo.skinComplexion === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Do you have any allergies?</label>
                                            <select disabled={bookingInfo.skinComplexion === "" ? true : false} name="allergies" required value={bookingInfo.allergies} onChange={e => handleInputChange(e)}>
                                                <option
                                                    onChange={bookingInfo.allergies === "" ? bookingInfo.skinConditions = "" : "" }
                                                    value="" defaultValue>Select an answer</option>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                        <div className={bookingInfo.allergies === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Do you suffer from any skin conditions? </label>
                                            <select disabled={bookingInfo.allergies === "" ? true : false} name="skinConditions" type="text" required value={bookingInfo.skinConditions} onChange={e => handleInputChange(e)}>
                                                <option 
                                                    onChange={bookingInfo.skinConditions === "" ? bookingInfo.makeupLook = "" : "" }
                                                    value="" defaultValue>Select an answer</option>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                        
                                        <div className={bookingInfo.skinConditions === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">What type of look are you looking for? </label>
                                            <select disabled={bookingInfo.skinConditions === "" ? true : false} name="makeupLook" type="text" required value={bookingInfo.makeupLook} onChange={e => handleInputChange(e)}>
                                                <option 
                                                    onChange={bookingInfo.makeupLook === "" ? bookingInfo.makeupLashes = "" : "" }
                                                    value="" defaultValue>Select an answer</option>
                                                <option value="Daytime">Daytime</option>
                                                <option value="Natural (Light Contouring)">Natural (Light Contouring)</option>
                                                <option value="High Glam (Heavy Contouring)">High Glam (Heavy Contouring)</option>
                                                <option value="Evening">Evening</option>
                                                <option value="Gothic (Dark Makeup)">Gothic (Dark Makeup)</option>
                                            </select>
                                        </div>
                                        <div className={bookingInfo.makeupLook === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Would you like lashes? </label>
                                            <select disabled={bookingInfo.makeupLook === "" ? true : false} name="makeupLashes" required value={bookingInfo.makeupLashes} onChange={e => handleInputChange(e)}>
                                                <option 
                                                    value="" defaultValue>Select an answer</option>
                                                <option value={15}>Yes</option>
                                                <option value={0}>No</option>
                                            </select>
                                        </div>

                                    </div> 
                                : ""
                            }
                            {/* ---------- MAKE-UP INPUTS ---------- */}

                            
                            {/* ---------- NAIL INPUTS ---------- */}
                            {
                                bookingInfo.serviceType === "NAIL" ?  
                                <div>
                                    <h1>TELL US ABOUT YOUR NAIL</h1>
                                    <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What kind of nail service are you looking for?</label>
                                        <select disabled={bookingInfo.serviceType === "" ? true : false} name="service" required value={bookingInfo.service} onChange={e => handleInputChange(e)}>
                                            <option
                                            value="" defaultValue>Select a service</option>
                                            {services.map((val, index) => (
                                                bookingInfo.serviceType === val.service_type ?
                                                    val.service_live ?
                                                        <option key={index} value={val.service} >{val.service}</option>
                                                    : ""
                                                : ""
                                            ))}
                                        </select>
                                    </div>
                                    <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">Do you have a specific design in mind?</label>
                                        <select disabled={bookingInfo.service === "" ? true : false} name="nailDesc" required value={bookingInfo.nailDesc} onChange={e => handleInputChange(e)}>
                                            <option
                                            value="" defaultValue>Select a service</option>
                                                <option value="Natural" >Natural</option>
                                                <option value="Gel Overlay">Gel Overlay</option>
                                                <option value="Full Set (acrylic tips) ">Full Set (acrylic tips)</option>
                                                <option value="I do not know how to describe my nails">I do not know how to describe my nails</option>
                                        </select>
                                    </div>
                                    <div className={bookingInfo.nailDesc === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">Select your preferred Nail shape:</label>
                                        <select disabled={bookingInfo.nailDesc === "" ? true : false} name="nailShape" required value={bookingInfo.nailShape} onChange={e => handleInputChange(e)}>
                                            <option
                                            value="" defaultValue>Select a service</option>
                                                <option value="Round" >Round</option>
                                                <option value="Square">Square </option>
                                                <option value="Oval">Oval</option>
                                                <option value="Almond" >Almond</option>
                                                <option value="Coffin">Coffin </option>
                                                <option value="Stiletto">Stiletto</option>
                                        </select>
                                    </div>
                                    <div className={bookingInfo.nailShape === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">Prefered Polish Color:</label>
                                        <select disabled={bookingInfo.nailShape === "" ? true : false} name="nailPolish" required value={bookingInfo.nailPolish} onChange={e => handleInputChange(e)}>
                                            <option
                                            value="" defaultValue>Select a service</option>
                                                <option value="Pinks" >Pinks</option>
                                                <option value="Reds">Reds </option>
                                                <option value="Blues">Blues</option>
                                                <option value="Bright Colors" >Bright Colors</option>
                                                <option value="Neon Colors">Neon Colors </option>
                                                <option value="Browns">Stiletto</option>
                                                <option value="Neutral Colors" >Neutral Colors</option>
                                                <option value="Burgundy">Burgundy </option>
                                                <option value="Black">Black</option>
                                                <option value="White">White</option>
                                                <option value="Other">I have a specific color </option>
                                        </select>
                                    </div>
                                    {
                                            bookingInfo.nailPolish === "Other" ? 
                                                <div className={bookingInfo.nailShape === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                    {/* <label htmlFor="">Prefered Polish Color:</label> */}
                                                    <br/>
                                                    <input type="text" name="nailPolishOther" id="nailPolishOther" placeholder="Specify a color" required onChange={e => handleInputChange(e)}/>
                                                </div>
                                            : ""
                                        }
                                </div> 
                                : ""
                            }
                            {/* ---------- NAIL INPUTS ---------- */}

                            {/* ---------- HENNA INPUTS ---------- */}
                            {
                                bookingInfo.serviceType === "HENNA" ?  
                                <div>
                                    <h1>TELL US ABOUT YOUR HENNA</h1>
                                    <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">How long do you have to have design applied?</label>
                                        <select disabled={bookingInfo.serviceType === "" ? true : false} name="service" required value={bookingInfo.service} onChange={e => handleInputChange(e)}>
                                            <option
                                            value="" defaultValue>Select a service</option>
                                            {services.map((val, index) => (
                                                bookingInfo.serviceType === val.service_type ?
                                                    val.service_live ?
                                                        <option key={index} value={val.service} >{val.service}</option>
                                                    : ""
                                                : ""
                                            ))}
                                        </select>
                                    </div>
                                    <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">How long do you have to have design applied?</label>
                                        <select disabled={bookingInfo.service === "" ? true : false} name="hennaLengthVal" required value={bookingInfo.hennaLengthVal} onChange={e => handleInputChange(e)}>
                                            <option
                                            value="" defaultValue>Select a length</option>
                                                <option value="1 hour/ upchargeHennaLength/ / hennaLength">1 hour</option>
                                                <option value="2 hours/ upchargeHennaLength/ 100/ hennaLength">2 hours</option>
                                                <option value="3 hours/ upchargeHennaLength/ 200/ hennaLength">3 hours</option>
                                                <option value="4 hours/ upchargeHennaLength/ 300/ hennaLength">4 hours</option>
                                        </select>
                                    </div>
                                    <div className={bookingInfo.hennaLengthVal === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">How large would you like the design?</label>
                                        <select disabled={bookingInfo.hennaLengthVal === "" ? true : false} name="hennaSizeVal" required value={bookingInfo.hennaSizeVal} onChange={e => handleInputChange(e)}>
                                            <option
                                            value="" defaultValue>Select a service</option>
                                                <option value="Small (simple hand)/ upchargeHennaSize/ / hennaSize" >Small (simple hand)</option>
                                                <option value="Medium (hand and partial arm)/ upchargeHennaSize/ 40/ hennaSize">Medium (hand and partial arm)</option>
                                                <option value="Large (hands, feet and partial arm)/ upchargeHennaSize/ 60/ hennaSize" >Large (hands, feet and partial arm)</option>
                                                <option value="Extra Large (hands, feet and belly)/ upchargeHennaSize/ 100/ hennaSize" >Extra Large (hands, feet and belly)</option>
                                        </select>
                                    </div>
                                    <div className={bookingInfo.hennaSizeVal === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">Do you have a specific design in mind?</label>
                                        <select disabled={bookingInfo.hennaSizeVal === "" ? true : false} name="hennaDesign" required value={bookingInfo.hennaDesign} onChange={e => handleInputChange(e)}>
                                            <option
                                            value="" defaultValue>Select a service</option>
                                                <option value={true} >Yes</option>
                                                <option value={false}>No</option>
                                        </select>
                                    </div>
                                    <div className={bookingInfo.hennaDesign === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What color would you like?</label>
                                        <select disabled={bookingInfo.hennaDesign === "" ? true : false} name="hennaColor" required value={bookingInfo.hennaColor} onChange={e => handleInputChange(e)}>
                                            <option
                                            value="" defaultValue>Select a service</option>
                                                <option value="Brown" >Brown</option>
                                                <option value="Orange-Brown">Orange-Brown </option>
                                                <option value="Reddish-Brown">Reddish-Brown </option>
                                        </select>
                                    </div>
                                </div> 
                                : ""
                            }
                            {/* ---------- HENNA INPUTS ---------- */}


                            {/* ---------- HAIR INPUTS ---------- */}
                            {
                                bookingInfo.serviceType === "HAIR" ? 
                                    <div>
                                        <h1>TELL US ABOUT YOUR HAIR</h1>
                                        <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">What is your hair texture?</label>
                                            <select disabled={bookingInfo.serviceType === "" ? true : false} name="hairType" type="text" required value={bookingInfo.hairType} onChange={e => handleInputChange(e)}>
                                                <option 
                                                    onChange={bookingInfo.hairType === "" ? bookingInfo.hairDensity = "" : "" }
                                                    value="" defaultValue>Select a type</option>
                                                {hairType.map((val, index) => (
                                                    <option value={val.hair_type} >{val.hair_type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={bookingInfo.hairType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">What is your hair density? </label>
                                            <select disabled={bookingInfo.hairType === "" ? true : false} name="hairDensity" required value={bookingInfo.hairDensity} onChange={e => handleInputChange(e)}>
                                                <option 
                                                    onChange={bookingInfo.hairDensity === "" ? bookingInfo.service = "" : "" }
                                                    value="" defaultValue>Select a density</option>
                                                <option value="Very Thick">Very Thick</option>
                                                <option value="Somewhat Thick">Somewhat Thick</option>
                                                <option value="Medium Thickness">Medium Thickness</option>
                                                <option value="Thin">Thin</option>
                                                <option value="Very Thin">Very Thin</option>
                                            </select>
                                        </div>
                                        <div className={bookingInfo.hairDensity === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">What kind of hair service are you looking for?</label>
                                            <select disabled={bookingInfo.hairDensity === "" ? true : false} name="service" required value={bookingInfo.service} onChange={e => handleInputChange(e)}>
                                                <option
                                                    value="" defaultValue>Select a service</option>
                                                {services.map((val, index) => (
                                                    bookingInfo.serviceType === val.service_type ?
                                                        val.service_live ?
                                                            <option key={index} value={val.service} >{val.service}</option>
                                                        :""
                                                    : ""
                                                ))}
                                            </select>
                                        </div>
                                        {services.map((val, index) => (
                                            bookingInfo.service === val.service ?
                                                <div style={{display: "none"}}>
                                                    { bookingInfo.hairServiceDetail = val.service_detail }
                                                </div>
                                            :""
                                        ))}
                                        {
                                            services.map((val, index) => (
                                                    bookingInfo.service === val.service ?
                                                        val.service_detail === "Kids" || bookingInfo.service.includes("Kid")?
                                                        <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                            <label htmlFor="">Will there be an adult(18+) present during the appointment?</label>
                                                            <select disabled={bookingInfo.service === "" ? true : false} name="childSupervision" required value={bookingInfo.childSupervision} onChange={e => handleInputChange(e)}>
                                                                <option value="" defaultValue>Select an answer</option>
                                                                <option value={true} >Yes</option>
                                                                <option value={false}>No</option>
                                                            </select>
                                                        </div>
                                                        :""
                                                    : ""
                                                ))
                                        }  
                                        
                                        {bookingInfo.hairType === "CURLY" ||  bookingInfo.hairType === "COILY"? 
                                            <div>
                                                {/* FOR CURL/NATURAL HAIR SERVICES */}
                                                <h2>TELL US MORE ABOUT YOUR {bookingInfo.hairType} HAIR </h2>
                                                <div className={bookingInfo.hairType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                    <label htmlFor="">What is your curl pattern? </label>
                                                    <select disabled={bookingInfo.hairType === "" ? true : false} name="curlPattern" required value={bookingInfo.curlPattern} onChange={e => handleInputChange(e)}>
                                                        <option 
                                                            onChange={bookingInfo.curlPattern === "" ? bookingInfo.hairCare = "" : "" }
                                                            value="" defaultValue>Select a pattern</option>
                                                        <option value="3A">3A</option>
                                                        <option value="3B">3B</option>
                                                        <option value="3C">3C</option>
                                                        <option value="4A">4A</option>
                                                        <option value="4B">4B</option>
                                                        <option value="4C">4C</option>
                                                    </select>
                                                </div>
                                                <div className={bookingInfo.curlPattern === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                    <label htmlFor="">What kind of hair care do you usually get? </label>
                                                    <select disabled={bookingInfo.curlPattern === "" ? true : false} name="hairCare" required value={bookingInfo.hairCare} onChange={e => handleInputChange(e)}>
                                                        <option value="" defaultValue>Select an answer</option>
                                                        <option value="I receive professional care at a salon">I receive professional care at a salon</option>
                                                        <option value="I generally wash and style my hair myself">I generally wash and style my hair myself</option>
                                                        <option value="I generally do my own relaxer and/or color treatments">I generally do my own relaxer and/or color treatments</option>
                                                    </select>
                                                </div>
                                            </div>
                                        : ""
                                        }
                                        {bookingInfo.service === "Blowout" ? 
                                            <div>
                                                {/* FOR BLOWOUT SERVICES*/}
                                                <h2>LET'S GET READY FOR YOUR {bookingInfo.service.toUpperCase()}</h2>
                                                <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                    <label htmlFor="">Do you have extensions?</label>
                                                    <select disabled={bookingInfo.service === "" ? true : false} name="hairExt" required value={bookingInfo.hairExt} onChange={e => handleInputChange(e)}>
                                                        <option
                                                            onChange={bookingInfo.hairExt === "" ? bookingInfo.hairExtType = "" : "" }
                                                            value="" defaultValue>Select an answer</option>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                                </div>
                                                {bookingInfo.hairExt === true ?
                                                    <div className={bookingInfo.hairExt === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                        <label htmlFor="">What type of extensions?</label>
                                                        <select disabled={bookingInfo.hairExt === "" ? true : false} name="hairExtType" required value={bookingInfo.hairExtType} onChange={e => handleInputChange(e)}>
                                                            <option value="" defaultValue>Select a type</option>
                                                            <option value="Sew-In" >Sew-In</option>
                                                            <option value="Clip-In" >Clip-In</option>
                                                            <option value="Tape-In" >Tape-In</option>
                                                            <option value="Other" >Other</option>
                                                        </select>
                                                    </div>
                                                    :""
                                                }
                                            </div>
                                            : "" 
                                        }
                                        {
                                            services.map((val, index) => (
                                                bookingInfo.service === val.service ?
                                                    val.service_detail ===  "Natural Hair" ||  bookingInfo.service.includes("Loc")? 
                                                        <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                            <label htmlFor="">Do you need a stylist to dry your hair? </label>
                                                            <select disabled={bookingInfo.service === "" ? true : false} name="hairDry" required value={bookingInfo.hairDry} onChange={e => handleInputChange(e)}>
                                                                <option 
                                                                    value="" defaultValue>Select an answer</option>
                                                                <option value={true}>Yes</option>
                                                                <option value={false}>No</option>
                                                            </select>
                                                        </div>
                                                    : "" 
                                                :"" 
                                            ))
                                        }
                                        {bookingInfo.service === "Locs Extensions" || bookingInfo.service === "Signature Braid Style w/added hair" || bookingInfo.service === "Wig Installation"  ? 
                                            <div>
                                                {/* FOR BRAIDED EXTENSION SERVICES OR EXTENSION/ WEAVE SERVICES */}
                                                <h2>TELL US ABOUT YOUR SCALP</h2>
                                                <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                    <label htmlFor="">Do you suffer from hair loss?</label>
                                                    <select disabled={bookingInfo.service === "" ? true : false} name="hairLoss" required value={bookingInfo.hairLoss} onChange={e => handleInputChange(e)}>
                                                        <option 
                                                            onChange={bookingInfo.hairLoss === "" ? bookingInfo.hairLossDiag = "" : "" }
                                                            value="" defaultValue>Select an answer</option>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                                </div>
                                                {bookingInfo.hairLoss === true ?
                                                    <div>
                                                        <div className={bookingInfo.hairLoss === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                            <label htmlFor="">Have you been professionally diagnosed?</label>
                                                            <select disabled={bookingInfo.hairLoss === "" ? true : false} name="hairLossDiag" required value={bookingInfo.hairLossDiag} onChange={e => handleInputChange(e)}>
                                                                <option 
                                                                    onChange={bookingInfo.hairLossDiag === "" ? bookingInfo.hairLossCause = "" : "" }
                                                                    value="" defaultValue>Select an answer</option>
                                                                <option value={true}>Yes</option>
                                                                <option value={false}>No</option>
                                                            </select>
                                                        </div>
                                                        {bookingInfo.hairLossDiag === true ?
                                                            <div className={bookingInfo.hairLossDiag === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                                <label htmlFor="">What is the cause?</label>
                                                                <select disabled={bookingInfo.hairLossDiag === "" ? true : false} name="hairLossCause" required value={bookingInfo.hairLossCause} onChange={e => handleInputChange(e)}>
                                                                    <option value="" defaultValue>Select a condition</option>
                                                                    <option value="Alopecia">Alopecia</option>
                                                                    <option value="Childbirth">Childbirth</option>
                                                                    <option value="Thyroid Issues">Thyroid Issues</option>
                                                                    <option value="Hormone Imbalance">Hormone Imbalance</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                            </div> 
                                                            : ""
                                                        }
                                                    </div> 
                                                    : ""
                                                }
                                            </div> 
                                            :""
                                        }
                                    </div> 
                                :   ""
                            }
                            
                            {bookingInfo.service.includes("Loc") ? 
                                <div>
                                    {/* FOR LOC SERVICES */}
                                    <h2>LET'S GET READY FOR YOUR {bookingInfo.service.toUpperCase()} </h2>
                                    <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">How long have you had your locs? </label>
                                        <select disabled={bookingInfo.service === "" ? true : false} name="locTime" required value={bookingInfo.locTime} onChange={e => handleInputChange(e)}>
                                            <option 
                                                onChange={bookingInfo.locTime === "" ? bookingInfo.locColor = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                            <option value="1-3 years">1-3 years</option>
                                            <option value="4-6 years">4-6 years</option>
                                            <option value="7+ years">7+ years</option>
                                        </select>
                                    </div>
                                    <div className={bookingInfo.locTime === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">Have you had your locs professionally colored? </label>
                                        <select disabled={bookingInfo.locTime === "" ? true : false} name="locColor" required value={bookingInfo.locColor} onChange={e => handleInputChange(e)}>
                                            <option value="" defaultValue>Select an answer</option>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </select>
                                    </div>
                                </div> 
                                : ""
                            }
                            {
                                services.map((val, index) => (
                                    bookingInfo.service === val.service ?
                                        val.service_detail === "Braided Extension" ? 
                                            <div>
                                                <h2>LET'S GET READY FOR YOUR {bookingInfo.service.toUpperCase()} </h2>
                                                <p className="braided-extension_note">* Our team of professionals do NOT do micro-sized braids and does NOT provide hair.</p>
                                                <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                    <label htmlFor="">What length would you like? </label>
                                                    <select disabled={bookingInfo.service === "" ? true : false} name="braidsLengthVal" required value={bookingInfo.braidsLengthVal} onChange={e => handleInputChange(e)}>
                                                        <option 
                                                            onChange={bookingInfo.braidsLengthVal === "" ? bookingInfo.braidsSizeVal = "" : "" }
                                                            value="" defaultValue>Select a pattern</option>
                                                        <option value="18 inches/ upchargeBraidsLength/ / braidsLength">18 inches (BRA STRAP)</option>
                                                        <option value="20 inches/ upchargeBraidsLength/ 25/ braidsLength">20 inches (MID BACK)</option>
                                                        <option value="22 inches/ upchargeBraidsLength/ 50/ braidsLength">22 inches (WAIST LENGTH)</option>
                                                        <option value="24 inches/ upchargeBraidsLength/ 75/ braidsLength">24 inches (PAST THE WAIST)</option>
                                                    </select>
                                                </div>
                                                <div className={bookingInfo.braidsLengthVal === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                    <label htmlFor="">What size would you like? </label>
                                                    <select disabled={bookingInfo.braidsLengthVal === "" ? true : false} name="braidsSizeVal" required value={bookingInfo.braidsSizeVal} onChange={e => handleInputChange(e)}>
                                                        <option 
                                                            // onChange={bookingInfo.braidsSizeVal === "" ? bookingInfo.braidsLength = "" : "" }
                                                            value="" defaultValue>Select a pattern</option>
                                                        <option value="Large/ upchargeBraidsSize/ / braidsSize">Large (Thumb size)</option>
                                                        <option value="Medium/ upchargeBraidsSize/ 25/ braidsSize">Medium (Pinky Sized)</option>
                                                        <option value="Small/ upchargeBraidsSize/ 50/ braidsSize">Small (Smaller than Pinky Sized)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        : ""
                                    :""
                                ))
                            }
                            {
                                bookingInfo.service.includes("Cornrow") ?  
                                    <div>
                                        <h2>A COUPLE MORE QUESTIONS ABOUT YOUR CORNROWS </h2>
                                        <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">How many cornrows would you like? </label>
                                            <select disabled={bookingInfo.service === "" ? true : false} name="cornrowsCountVal" required value={bookingInfo.cornrowsCountVal} onChange={e => handleInputChange(e)}>
                                                <option 
                                                    onChange={bookingInfo.cornrowsCountVal === "" ? bookingInfo.cornrowsStyle = "" : "" }
                                                    value="" defaultValue>Select a pattern</option>
                                                <option value="2/ upchargeCornrowsCount/ / cornrowsCount">2</option>
                                                <option value="3/ upchargeCornrowsCount/ 10/ cornrowsCount">3</option>
                                                <option value="4/ upchargeCornrowsCount/ 20/ cornrowsCount">4</option>
                                                <option value="5/ upchargeCornrowsCount/ 30/ cornrowsCount">5</option>
                                                <option value="6/ upchargeCornrowsCount/ 40/ cornrowsCount">6</option>
                                                <option value="7/ upchargeCornrowsCount/ 50/ cornrowsCount">7</option>
                                                <option value="8/ upchargeCornrowsCount/ 60/ cornrowsCount">8</option>
                                            </select>
                                        </div>
                                        { 
                                            bookingInfo.service.includes("Cornrow & Single Style") ?
                                            <div className={bookingInfo.cornrowsCountVal === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                <label htmlFor="">Select your braid style? </label>
                                                <select disabled={bookingInfo.cornrowsCountVal === "" ? true : false} name="cornrowsStyle" required value={bookingInfo.cornrowsStyle} onChange={e => handleInputChange(e)}>
                                                    <option 
                                                        value="" defaultValue>Select a pattern</option>
                                                    <option value="Twist/Braids">Twist/Braids</option>
                                                    <option value="Sade Adu">Sade Adu</option>
                                                    <option value="Fulani">Fulani</option>
                                                    <option value="Tribal Braid">Tribal Braid</option>
                                                </select>
                                            </div>
                                            : ""
                                        }
                                    </div> 
                                : ""          
                            }

                            {bookingInfo.service === "Wig Installation" ? 
                                <div>
                                    {/* FOR Wig SERVICES */}
                                    <h2>LET'S GET READY FOR YOUR {bookingInfo.service.toUpperCase()}</h2>
                                    <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">Has a wig been purchased? </label>
                                        <select disabled={bookingInfo.service === "" ? true : false} name="wigPurchased" required value={bookingInfo.wigPurchased} onChange={e => handleInputChange(e)}>
                                            <option 
                                                onChange={bookingInfo.wigPurchased === "" ? bookingInfo.wigPurchaseAsst = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </select>
                                    </div>
                                    {
                                        bookingInfo.wigPurchased === true ?
                                            // If yes redirect to wellcapped.com
                                            ""
                                        : <div className={bookingInfo.wigPurchased === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Do you need assistance purchasing a wig </label>
                                            <select disabled={bookingInfo.wigPurchased === "" ? true : false} name="wigPurchaseAsst" required value={bookingInfo.wigPurchaseAsst} onChange={e => handleInputChange(e)}>
                                                <option 
                                                onChange={bookingInfo.wigPurchaseAsst === "" ? bookingInfo.wigHairType = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                    }
                                    <div className={bookingInfo.wigPurchased === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">Choose hair type of wig? </label>
                                        <select disabled={bookingInfo.wigPurchased === "" ? true : false} name="wigHairType" required value={bookingInfo.wigHairType} onChange={e => handleInputChange(e)}>
                                            <option 
                                            onChange={bookingInfo.wigHairType === "" ? bookingInfo.wigInstallType = "" : "" }
                                            value="" defaultValue>Select an answer</option>
                                            <option value="Synthetic">Synthetic</option>
                                            <option value="100% human">100% human</option>
                                            <option value="Custom Made 100% Human Hair">Custom Made 100% Human Hair</option>
                                        </select>
                                    </div>
                                    <div className={bookingInfo.wigHairType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What type of wig are we installing? </label>
                                        <select disabled={bookingInfo.wigHairType === "" ? true : false} name="wigInstallType" required value={bookingInfo.wigInstallType} onChange={e => handleInputChange(e)}>
                                            <option 
                                            onChange={bookingInfo.wigInstallType === "" ? bookingInfo.wigPrice = "" : "" }
                                            value="" defaultValue>Select an answer</option>
                                            <option value="360 Frontal">360 Frontal</option>
                                            <option value="T part wig">T part wig</option>
                                            <option value="Lace front">Lace front</option>
                                            <option value="Closure">Closure</option>
                                        </select>
                                    </div>
                                    <div className={bookingInfo.wigInstallType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">How much do you spend on wig? </label>
                                        <select disabled={bookingInfo.wigInstallType === "" ? true : false} name="wigPrice" required value={bookingInfo.wigPrice} onChange={e => handleInputChange(e)}>
                                            <option 
                                            onChange={bookingInfo.wigPrice === "" ? bookingInfo.upchargeWigStyle = "" : "" }
                                            value="" defaultValue>Select an answer</option>
                                            <option value="<$50">{"<$50"}</option>
                                            <option value="$50+">$50+</option>
                                            <option value="$200+">$200+</option>
                                            <option value="$1,000+">$1,000+</option>
                                        </select>
                                    </div>
                                    <div className={bookingInfo.wigPrice === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">Do you need the wig styled? </label>
                                        <select disabled={bookingInfo.wigPrice === "" ? true : false} name="upchargeWigStyle" required value={bookingInfo.upchargeWigStyle} onChange={e => handleInputChange(e)}>
                                            <option value="" defaultValue>Select an answer</option>
                                            <option value={80}>Yes</option>
                                            <option value={0}>No</option>
                                        </select>
                                    </div>
                                    
                                    
                                </div> 
                                : bookingInfo.service.includes("Custom Wig Installation") ? 
                                    <div>
                                        {/* FOR CUSTOM Wig SERVICES */}
                                        <h2>LET'S GET READY FOR YOUR {bookingInfo.service.toUpperCase()}</h2>
                                        <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Do you know your wig measurements? </label>
                                            <select disabled={bookingInfo.service === "" ? true : false} name="customWigSizeCheck" required value={bookingInfo.customWigSizeCheck} onChange={e => handleInputChange(e)}>
                                                <option 
                                                    onChange={bookingInfo.customWigSizeCheck === "" ? bookingInfo.customWigSize = "" : "" }
                                                    value="" defaultValue>Select an answer</option>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                        {
                                            bookingInfo.customWigSizeCheck === true ?
                                                <>
                                                    <div className={bookingInfo.customWigSizeCheck === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                    <label htmlFor="">What are your wig measurements? (in INCHES)</label>
                                                    <select disabled={bookingInfo.customWigSizeCheck === "" ? true : false} name="customWigSize" required value={bookingInfo.customWigSize} onChange={e => handleInputChange(e)}>
                                                        <option 
                                                        onChange={bookingInfo.customWigSize === "" ? bookingInfo.customWigInstallType = "" : "" }
                                                        value="" defaultValue>Select an answer</option>
                                                        <option value="Small">Small</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="Large">Large</option>
                                                        <option value="Custom">Custom</option>
                                                    </select>
                                                    </div>
                                                    {
                                                        
                                                        bookingInfo.customWigSize === "Custom" ? 
                                                            <>
                                                                <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                                    <label className="customWig_label" htmlFor=""> Circumference:</label>
                                                                    <input type="text" name="customWigSizeCirc" id="customWigSizeCirc" placeholder={`21" - 23.5"`} required onChange={e => handleInputChange(e)}/>
                                                                </div>
                                                                <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                                    <label className="customWig_label" htmlFor=""> Front to nape:</label>
                                                                    <input type="text" name="customWigSizeNape" id="customWigSizeNape" placeholder={`13" - 15"`} required onChange={e => handleInputChange(e)}/>
                                                                </div>
                                                                <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                                    <label className="customWig_label" htmlFor=""> Ear to ear across forehead:</label>
                                                                    <input type="text" name="customWigSizeForehead" id="customWigSizeForehead" placeholder={`11.5" = 12.5"`} required onChange={e => handleInputChange(e)}/>
                                                                </div>
                                                                <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                                    <label className="customWig_label" htmlFor=""> Ear to ear overtop head:</label>
                                                                    <input type="text" name="customWigSizeOverlap" id="customWigSizeOverlap" placeholder={`12" - 13.5"`} required onChange={e => handleInputChange(e)}/>
                                                                </div>
                                                                <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                                    <label className="customWig_label" htmlFor=""> Temple to temple around back:</label>
                                                                    <input type="text" name="customWigSizeTempleBack" id="customWigSizeTempleBack" placeholder={`15" - 16"`} required onChange={e => handleInputChange(e)}/>
                                                                </div>
                                                                <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                                    <label className="customWig_label" htmlFor=""> Nape of neck:</label>
                                                                    <input type="text" name="customWigSizeNeck" id="customWigSizeNeck" placeholder={`5" - 6"`} required onChange={e => handleInputChange(e)}/>
                                                                </div>
                                                            </>
                                                        : bookingInfo.customWigSize === "Small" ? 
                                                            <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field_dets"}>
                                                                <label htmlFor=""> <h5> Wig measurement details for Small (in INCHES): </h5></label>
                                                                <div>
                                                                    <h3>
                                                                        •	Circumference: 21-21.5” <br />
                                                                        •	Front to nape: 13.5” <br />
                                                                        •	Ear to ear across forehead: 11.5” <br />
                                                                        •	Ear to ear overtop head: 12” <br />
                                                                        •	Temple to temple around back: 15” <br />
                                                                        •	Nape of neck: 5” <br />
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                        : bookingInfo.customWigSize === "Medium" ? 
                                                            <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field_dets"}>
                                                                <label htmlFor=""> <h5> Wig measurement details for Small (in INCHES): </h5></label>
                                                                <div>
                                                                    <h3>
                                                                        •	Circumference: 22-22.5” <br />
                                                                        •	Front to nape: 14” <br />
                                                                        •	Ear to ear across forehead: 12” <br />
                                                                        •	Ear to ear overtop head: 12.5” <br />
                                                                        •	Temple to temple around back: 15.5” <br />
                                                                        •	Nape of neck: 5.5” <br />
                                                                    </h3>
                                                                </div>
                                                            </div> 
                                                        : bookingInfo.customWigSize === "Large" ? 
                                                            <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field_dets"}>
                                                                <label htmlFor=""> <h5> Wig measurement details for Small (in INCHES): </h5></label>
                                                                <div>
                                                                    <h3>
                                                                        •	Circumference: 23-23.5” <br />
                                                                        •	Front to nape: 15” <br />
                                                                        •	Ear to ear across forehead: 12.5” <br />
                                                                        •	Ear to ear overtop head: 13.5” <br />
                                                                        •	Temple to temple around back: 16” <br />
                                                                        •	Nape of neck: 6” <br />
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                        : ""
                                                    }
                                                </>
                                            : "" // If no display video
                                        }
                                        <div className={bookingInfo.customWigSize === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">What type of wig install do you want? </label>
                                            <select disabled={bookingInfo.customWigSize === "" ? true : false} name="customWigInstallType" required value={bookingInfo.customWigInstallType} onChange={e => handleInputChange(e)}>
                                                <option 
                                                onChange={bookingInfo.customWigInstallType === "" ? bookingInfo.customWigHairType = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                                <option value="360 Frontal">360 Frontal</option>
                                                <option value="T part wig">T part wig</option>
                                                <option value="Lace front">Lace front</option>
                                                <option value="Closure">Closure</option>
                                            </select>
                                        </div>
                                        <div className={bookingInfo.customWigInstallType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Choose a hair type of wig: </label>
                                            <select disabled={bookingInfo.customWigInstallType === "" ? true : false} name="customWigHairType" required value={bookingInfo.customWigHairType} onChange={e => handleInputChange(e)}>
                                                <option 
                                                onChange={bookingInfo.customWigHairType === "" ? bookingInfo.customWigStyle = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                                <option value="Virgin Hair Human Hair">Virgin Hair Human Hair </option>
                                                <option value="Chemically Treated Human Hair">Chemically Treated Human Hair </option>
                                                <option value="Human Hair Blend">Human Hair Blend(syn. / human hair )</option>
                                                <option value="Synthetic">Synthetic</option>
                                            </select>
                                        </div>
                                        <div className={bookingInfo.customWigHairType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Choose a wig style:  </label>
                                            <select disabled={bookingInfo.customWigHairType === "" ? true : false} name="customWigStyle" required value={bookingInfo.customWigStyle} onChange={e => handleInputChange(e)}>
                                                <option 
                                                onChange={bookingInfo.customWigStyle === "" ? bookingInfo.customWigDensityVal = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                                <option value="Pixie Cut ">Pixie Cut</option>
                                                <option value="Bob">Bob</option>
                                                <option value="Long">Long</option>
                                                <option value="Short">Short</option>
                                                <option value="Layered Wigs">Layered Wigs</option>
                                                <option value="Custom Cut">Custom Cut</option>
                                                <option value="Straight Wig">Straight Wig</option>
                                                <option value="Curly Wig">Curly Wig</option>
                                                <option value="Wavy Wig">Wavy Wig</option>
                                                <option value="Mid Length Wigs">Mid Length Wigs</option>
                                                <option value="Long Wigs">Layered Wigs</option>
                                            </select>
                                        </div>
                                        <div className={bookingInfo.customWigStyle === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Select the wig density you would like: </label>
                                            <select disabled={bookingInfo.customWigStyle === "" ? true : false} name="customWigDensityVal" required value={bookingInfo.customWigDensityVal} onChange={e => handleInputChange(e)}>
                                                <option 
                                                onChange={bookingInfo.customWigDensityVal === "" ? bookingInfo.customWigTexture = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                                <option value="Extra Light Density 50-60%/ upchargeCustomWigDensity/ 50/ customWigDensity">Extra Light Density 50-60% </option>
                                                <option value="Light Density 80%/ upchargeCustomWigDensity/ 100/ customWigDensity">Light Density 80% </option>
                                                <option value="Heavy Density 150%/ upchargeCustomWigDensity/ 150/ customWigDensity">Heavy Density 150%</option>
                                                <option value="Extra Heavy Density 200%/ upchargeCustomWigDensity/ 200/ customWigDensity">Extra Heavy Density 200% </option>
                                            </select>
                                        </div>
                                        <div className={bookingInfo.customWigDensityVal === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Choose a hair type of wig? </label>
                                            <select disabled={bookingInfo.customWigDensityVal === "" ? true : false} name="customWigTexture" required value={bookingInfo.customWigTexture} onChange={e => handleInputChange(e)}>
                                                <option 
                                                onChange={bookingInfo.customWigTexture === "" ? bookingInfo.upchargeCustomWigColor = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                                <option value="Straight">Straight</option>
                                                <option value="Kinky Straight">Kinky Straight</option>
                                                <option value="Bodywave">Bodywave</option>
                                                <option value="Loose">Loose</option>
                                                <option value="Brazilian Wave">Brazilian Wave</option>
                                                <option value="Kinky Curly">Kinky Curly</option>
                                                <option value="I don’t know">I don’t know. Need to speak to professional </option>
                                            </select>
                                        </div>
                                        <div className={bookingInfo.customWigTexture === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <div>
                                                <label htmlFor="">Do you want custom color hair? </label>
                                                <p className={bookingInfo.customWigTexture === "" ? "book-now-field_noteHidden" : "book-now-field_note"} >
                                                    * BeautyLynk uses the  <a target="_blank" href="https://www.madison-reed.com/hair-color-chart?utm_source=google&utm_medium=cpcbrand&utm_campaign=Madison_Reed-GGL-Core-B-Trademark-SEM-New-NA-Exact-NA&utm_campaignid=14039505012&utm_adgroupid=150612185228&utm_adid=655091100708&utm_keyword=madison%20reed%20hair%20color&utm_keywordid=kwd-77692752394&utm_network=g&utm_content=150612185228&gad=1&gclid=CjwKCAjwp6CkBhB_EiwAlQVyxT0qqc7X0_-2kvMElnors97sUUUYyD8JiSKb_eXXD-Ou5W-LXUTBwxoC0i4QAvD_BwE">Madison Reed</a> color scheme.
                                                </p>
                                                {/* <p className={bookingInfo.skinType === "" ? "book-now-field_noteHidden" : "book-now-field_note"}>
                                                    * BeautyLynk uses the <a href="https://www.sephora.com/product/pro-filtr-soft-matte-longwear-foundation-P87985432" target="_blank">Fenty</a> foundation shade.
                                                </p> */}
                                            </div>
                                            <select className="book-now-field_note-input" disabled={bookingInfo.customWigTexture === "" ? true : false} name="upchargeCustomWigColor" required value={bookingInfo.upchargeCustomWigColor} onChange={e => handleInputChange(e)} style={{height: "70%"}}>
                                                <option 
                                                onChange={bookingInfo.upchargeCustomWigColor === "" ? bookingInfo.upchargeCustomWigInstall = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                                <option value={100}>Yes</option>
                                                <option value={0}>No</option>
                                            </select>
                                            
                                        </div>
                                        <div className={bookingInfo.upchargeCustomWigColor === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Do you need the wig installed? </label>
                                            <select disabled={bookingInfo.upchargeCustomWigColor === "" ? true : false} name="upchargeCustomWigInstall" required value={bookingInfo.upchargeCustomWigInstall} onChange={e => handleInputChange(e)}>
                                                <option 
                                                onChange={bookingInfo.upchargeCustomWigInstall === "" ? bookingInfo.wigInstallType = "" : "" }
                                                value="" defaultValue>Select an answer</option>
                                                <option value={80}>Yes</option>
                                                <option value={0}>No</option>
                                            </select>
                                        </div>
                                        <div className={bookingInfo.upchargeCustomWigInstall === "" ? "book-now-field_hidden" : "book-now-field"}>
                                            <label htmlFor="">Why the wig? </label>
                                            <select disabled={bookingInfo.upchargeCustomWigInstall === "" ? true : false} name="customWigReason" required value={bookingInfo.customWigReason} onChange={e => handleInputChange(e)}>
                                                <option 
                                                value="" defaultValue>Select an answer</option>
                                                <option value="Health reasons">Health reasons</option>
                                                <option value="Religious reasons">Religious reasons</option>
                                                <option value="Versatility">Versatility</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        
                                    </div>
                                    : ""
                            }
                            {/* ---------- HAIR INPUTS ---------- */}


                            {/* ---------- GENERAL INPUTS ---------- */}
                            {bookingInfo.serviceType === "" ? 
                                "" : 
                                <div>
                                    <h1>LAST STEPS TO BOOK YOUR {bookingInfo.serviceType} APPOINTMENT </h1>
                                    {
                                        bookingInfo.serviceType === "HAIR" ?
                                            <div className="book-now-field">
                                                <label htmlFor="">Do you have sensitive scalp?</label>
                                                <select name="upchargeScalp" required value={bookingInfo.upchargeScalp} onChange={e => handleInputChange(e)}>
                                                    <option value="" defaultValue>Select an answer</option>
                                                    <option value={25}>Yes</option>
                                                    <option value={0}>No</option>
                                                </select>
                                            </div>
                                        : ""
                                    }
                                    <div className="book-now-field">
                                        <label htmlFor="">Do you have available parking?</label>
                                        <select name="upchargeParking" required value={bookingInfo.upchargeParking} onChange={e => handleInputChange(e)}>
                                            <option value="" defaultValue>Select an answer</option>
                                            <option value={0}>Yes</option>
                                            <option value={20}>No</option>
                                        </select>
                                    </div>
                                    {
                                        bookingInfo.upchargeParking === "" ? ""
                                        : 
                                            <div className="book-now-field">
                                                <label htmlFor="">Is this a smoke free environment?</label>
                                                <select name="smokeFree" required value={bookingInfo.smokeFree} onChange={e => handleInputChange(e)}>
                                                    {/* <option value="" defaultValue>Select an answer</option> */}
                                                    <option value="" defaultValue>Select an answer</option>
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </select>
                                            </div>
                                    }
                                    {
                                        bookingInfo.smokeFree === "" ? ""
                                        : 
                                            <div className="book-now-field">
                                                <label htmlFor="">Would you like a quiet service? (the beauty professional would be instructed that you would prefer no conversation)</label>
                                                <select name="upchargeQuietServ" required value={bookingInfo.upchargeQuietServ} onChange={e => handleInputChange(e)}>
                                                    <option value="" defaultValue>Select an answer</option>
                                                    <option value={50}>Yes</option>
                                                    <option value={0}>No</option>
                                                </select>
                                            </div>
                                    }
                                    {
                                        bookingInfo.upchargeQuietServ === "" ? ""
                                        : 
                                            <div className="book-now-field">
                                                <label htmlFor="">Are there stairs to get to service area?</label>
                                                <select name="upchargeStairs" required value={bookingInfo.upchargeStairs} onChange={e => handleInputChange(e)}>
                                                    {/* <option value="" defaultValue>Select an answer</option> */}
                                                    <option
                                                    value="" defaultValue>Select an answer</option>
                                                    <option value={20}>Yes</option>
                                                    <option value={0}>No</option>
                                                </select>
                                            </div>
                                    }
                                    

                                    {
                                        bookingInfo.upchargeStairs === "" ? "" 
                                        : <div>
                                            <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                <label htmlFor="">Do you have any pets?</label>
                                                <select name="pet" required value={bookingInfo.pet} onChange={e => handleInputChange(e)}>
                                                    <option 
                                                        onChange={bookingInfo.pet === "" ? bookingInfo.specialAcc = "" : "" }
                                                        value="" defaultValue>Select a answer</option>
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </select>
                                            </div>
                                            {
                                                bookingInfo.pet === true ? 
                                                    <div className="book-now-field">
                                                        <label htmlFor="">What kind of pets?</label>
                                                        <select name="petType" required value={bookingInfo.petType} onChange={e => handleInputChange(e)}>
                                                            <option value="" defaultValue>Select an answer</option>
                                                            <option value="Cat">Cat</option>
                                                            <option value="Dog">Dog</option>
                                                            <option value="Both">Both</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div> : ""
                                            }
                                            <div className="book-now-field">
                                                <label htmlFor="">Please let us know how we may accommodate you to help you enjoy your beauty experience. Do you need special accommodations?</label>
                                                <select name="specialAcc" required value={bookingInfo.specialAcc} onChange={e => handleInputChange(e)}>
                                                    <option
                                                        onChange={bookingInfo.specialAcc === "" ? bookingInfo.specialAccType = "" : "" } 
                                                        value="" defaultValue>Select an answer</option>
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </select>
                                            </div>
                                            {
                                                bookingInfo.specialAcc === true ? 
                                                    <div className="book-now-field">
                                                        <label htmlFor="">What kind of special accommodations will you need?</label>
                                                        <select name="specialAccType" required value={bookingInfo.specialAccType} onChange={e => handleInputChange(e)}>
                                                            <option value="" defaultValue>Select an answer</option>
                                                            <option value="Physical Challenges">Physical Challenges</option>
                                                            <option value="Wheelchair-bound">Wheelchair-bound</option>
                                                            <option value="Bed-bound">Bed-bound</option>
                                                            <option value="Other -- Please call">Other -- Please call</option>
                                                        </select>
                                                    </div> : ""
                                            }
                                        </div> 
                                    }
                                    {/* ---------- GENERAL INPUTS ---------- */}
                                    {
                                        bookingInfo.service ?
                                            <div id="book-now-fieldDesc" className="book-now-field" style={{height: "100%", paddingTop: "15px"}}>
                                                <label htmlFor="">Review your appointment details:</label>
                                                {/* <h3>{val.description}</h3> */}
                                                <span>
                                                    I want a <strong>{bookingInfo.serviceType} </strong>
                                                    in the <strong>{bookingInfo.service} </strong> 
                                                    style. This appointment will take place on <strong>{bookingInfo.date} </strong> 
                                                    at <strong>{formatAMPM(bookingInfo.time)} </strong> 
                                                    in <strong>{bookingInfo.location} </strong> 
                                                    for <strong>
                                                        ${ 
                                                            bookingInfo.servicePrice 
                                                                + (bookingInfo.upchargeParking === "" ? 0 : parseInt(bookingInfo.upchargeParking))
                                                                + (bookingInfo.upchargeScalp === "" ? 0 : parseInt(bookingInfo.upchargeScalp))
                                                                + (bookingInfo.upchargeStairs === "" ? 0 : parseInt(bookingInfo.upchargeStairs))
                                                                + (bookingInfo.upchargeQuietServ === "" ? 0 : parseInt(bookingInfo.upchargeQuietServ))
                                                                + (bookingInfo.makeupLashes === "" ? 0 : parseInt(bookingInfo.makeupLashes))
                                                                + (bookingInfo.upchargeWigStyle === "" ? 0 : parseInt(bookingInfo.upchargeWigStyle))
                                                                + (bookingInfo.upchargeHennaSize === "" ? 0 : parseInt(bookingInfo.upchargeHennaSize))
                                                                + (bookingInfo.upchargeHennaLength === "" ? 0 : parseInt(bookingInfo.upchargeHennaLength))
                                                                + (bookingInfo.upchargeBraidsLength === "" ? 0 : parseInt(bookingInfo.upchargeBraidsLength))
                                                                + (bookingInfo.upchargeBraidsSize === "" ? 0 : parseInt(bookingInfo.upchargeBraidsSize))
                                                                + (bookingInfo.upchargeCornrowsCount === "" ? 0 : parseInt(bookingInfo.upchargeCornrowsCount))
                                                                + (bookingInfo.upchargeCustomWigDensity === "" ? 0 : parseInt(bookingInfo.upchargeCustomWigDensity))
                                                                + (bookingInfo.upchargeCustomWigInstall === "" ? 0 : parseInt(bookingInfo.upchargeCustomWigInstall))
                                                                + (bookingInfo.upchargeCustomWigColor === "" ? 0 : parseInt(bookingInfo.upchargeCustomWigColor))
                                                        } </strong>
                                                </span>
                                            </div>
                                        : ""
                                    }
                                    {
                                        bookingInfo.specialAcc === false || bookingInfo.specialAccType ? 
                                            <div className="book-now-field" style={{height: "100%", color: "#000"}}>
                                                <label  htmlFor="">Please enter the address for your appointment: </label>
                                                <div className="booking-address-fields">
                                                    <label htmlFor="aptAddress1">Address 1:</label>
                                                    <input type="text" id="aptAddress1" name="aptAddress1" placeholder="Enter Address" required onChange={e => handleInputChange(e)}/>
                                                    <label htmlFor="aptAddress2">Address 2:</label>
                                                    <input type="text" id="aptAddress2" name="aptAddress2" placeholder="Enter Unit or Apt #" onChange={e => handleInputChange(e)}/>
                                                    <label htmlFor="aptCity">City/State:</label>
                                                    <select name="aptCity" id="aptCity" disabled required onChange={e => handleInputChange(e)}>
                                                        <>
                                                            {
                                                                bookingInfo["aptCity"] = bookingInfo.location
                                                            }
                                                            <option value={bookingInfo.location} defaultValue>{bookingInfo.location}</option>
                                                        </>
                                                    </select>
                                                    <label htmlFor="aptState">City/State:</label>
                                                    <select name="aptState" id="aptState" disabled required onChange={e => handleInputChange(e)}>
                                                        {cities.map((val, index) => (
                                                            val.city === bookingInfo.location ?
                                                                <>
                                                                    {
                                                                        bookingInfo["aptState"] = val.state
                                                                    }
                                                                    <option value={val.state} defaultValue>{val.state}</option>
                                                                </>
                                                            : ""
                                                        ))}
                                                    </select>
                                                    <label htmlFor="aptCountry">Country:</label>
                                                    <select name="aptCountry" id="aptCountry" required onChange={e => handleInputChange(e)}>
                                                        <option value="" defaultValue>Select a Country</option>
                                                        <option value="US">United States</option>
                                                    </select>
                                                    <label htmlFor="aptZip" >Zip:</label>
                                                    <input type="text" id="aptZip" name="aptZip" placeholder="Enter Zip Code" required onChange={e => handleInputChange(e)}/>
                                                </div>
                                            </div>
                                        : ""
                                    }
                                    <br />
                                    <div className="book-now-submitBtn-container">
                                        <button  className="book-now-submitBtn">NEXT</button>
                                    </div>
                                    
                                </div> 
                            }
                        </form>
                    }
                    <br />
                    <br />
                    {/* ---------- PAYMENT FORM ---------- */}
                    {
                        showPayment ? 
                            <div id="stripeContainer" className="stripe-container">
                                <Elements  stripe={stripeTestPromise}>
                                    <PaymentForm
                                        // handleBookingInfoFormSubmit = {handleBookingInfoFormSubmit}
                                        setBookingInfo = {setBookingInfo}
                                        formatAMPM = {formatAMPM}
                                        bookingInfo = {bookingInfo}
                                        cities = {cities}
                                    />
                                </Elements>
                            </div> 
                        : ""
                    }
                    {/* ---------- PAYMENT FORM ---------- */}
                    
                </div>
            </div>
            <br /><br />
        </Layout>
    )
}

export default BookNow