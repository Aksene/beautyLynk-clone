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
        date: "",
        time: "",
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
        locTime: "",
        locColor: "",
        skinType: "",
        skinComplexion: "",
        allergies: "",
        skinConditions: "",
        makeupLook: "",
        pet: "",
        specialAcc: "",
        specialAccType: "",
        upchargeParking: 0,
        upchargeScalp: 0,
        upchargeStairs: 0,
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
    const [showPayment, setShowPayment] = useState(false)
    

    // Grabs info from JumboHero on the homepage
    const stateBookingInfo = useLocation().state.homeInfo;
    console.log("Props State Value - ", stateBookingInfo)

    useEffect(() => {
        updateBookingFromState()
        getCities()
        getServices()
        getHairType()
       
    },[])

    const updateBookingFromState = (e) => {
        if (stateBookingInfo) {
            bookingInfo["location"] = stateBookingInfo.location
            bookingInfo["date"] = stateBookingInfo.date
            bookingInfo["time"] = stateBookingInfo.time
            bookingInfo["service"] = stateBookingInfo.service
        }
    }


    const handleInputChange = (e) => {
        const fieldName = e.target.getAttribute("name")
        let fieldValue = e.target.value;

        console.log("Field Value: " + fieldValue)
        console.log("Field Name: " + fieldName)

        if (fieldValue === 'true' || fieldValue === 'false') {
            fieldValue = fieldValue === 'true' ? true : false
        }

        const newFormData = { ...bookingInfo};

         // Resets the service, hairClass & hairType when serviceType is changed
        if (fieldName === "serviceType" && (fieldValue === "HAIR" || fieldValue === "MAKEUP" || fieldValue === "NAIL" || fieldValue === "HENNA" )) {
            newFormData["hairType"] = ""
            newFormData["hairClass"] = ""
            newFormData["service"] = ""
            // console.log("ServiceType has changed: ", newFormData)
            // setBookingInfo(newFormData)
        }
        // Resets the fields when service is changed
        if (fieldName === "service"){
            newFormData["hairExt"] = ""
            newFormData["hairExtType"] = ""
            newFormData["hairLoss"] = ""
            newFormData["hairLossDiag"] = ""
            newFormData["hairLossCause"] = ""
            newFormData["curlPattern"] = ""
            newFormData["hairDensity"] = ""
            newFormData["hairCare"] = ""
            newFormData["locTime"] = ""
            newFormData["locColor"] = ""
            newFormData["skinType"] = ""
            newFormData["skinComplexion"] = ""
            newFormData["allergies"] = ""
            newFormData["skinConditions"] = ""
            newFormData["makeupLook"] = ""
            
            services.map((val,index) => (
                fieldValue === val.service ? 
                    newFormData["servicePrice"] = val.service_price
                : ""
            ))
            
        }

        if (fieldName === "upchargeScalp" || fieldName === "upchargeStairs" || fieldName === "upchargeParking") {
            newFormData[fieldName] = parseInt(fieldValue)
            // alert("New price for "+fieldName +": " + typeof parseInt(fieldValue))
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

        
        console.log("New form data: ", newFormData)
        setBookingInfo(newFormData)
    }   

    const handleBookingInfoFormSubmit = async(e) => {
        e.preventDefault();
        console.log("event: Booking info: ", bookingInfo)

        // const formData = {
        //     location: "",
        //     service: "",
        //     date: "",
        //     time: "",
        // }

        // setBookingInfo(formData)

        const newBooking = { ...bookingInfo}

        console.log("Info to be sent to supabase",newBooking)

        // if(newBooking) {
        //     // With upsert, if upload exist it updates it and if not it will insert a new row
        //     const {data, error} = await supabase.from("BeautyLynk_Bookings").insert({
        //         location: newBooking.location,
        //         service: newBooking.service,
        //         date: newBooking.date,
        //         time: newBooking.time,
        //     })
        //     if(error) {
        //         console.log(error)
        //         alert(error.message)
        //     }
        //     if(data) {
        //         console.log(data)
        //         setBookingInfo({
        //             location: "",
        //             service: "",
        //             date: "",
        //             time: "",
        //         })
        //     }
        // }
    }

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
            <div className="book-now-container">
                <div className="form-wrap">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        bookingInfo["totalPrice"] = bookingInfo.servicePrice + bookingInfo.upchargeParking + bookingInfo.upchargeScalp + bookingInfo.upchargeStairs
                        console.log("Booking form info: ", bookingInfo)
                        console.log("Please fill the payment form below")
                        setShowPayment(true)
                    }}>
                    <h1>Main Questions</h1>
                        <div  className="book-now-field">
                            

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
                        <div className={bookingInfo.location === "" ? "book-now-field_hidden" : "book-now-field"}>
                            <label htmlFor="">When do you want your appointment?</label>
                            <input 
                                onChange={bookingInfo.date === "" ? bookingInfo.time = "" : "" } 
                                disabled={bookingInfo.location === "" ? true : false} type="date" name="date" required value={bookingInfo.date} onChange={e => handleInputChange(e)}/>
                        </div>
                        <div className={bookingInfo.date === "" ? "book-now-field_hidden" : "book-now-field"}>
                            <label htmlFor="">What time do you want your appointment?</label>
                            <input 
                                onChange={bookingInfo.time === "" ? bookingInfo.serviceType = "" : "" } 
                                disabled={bookingInfo.date === "" ? true : false} id="time" type="time" name="time" required value={bookingInfo.time} onChange={e => handleInputChange(e)}/>
                        </div>
                        <div className={bookingInfo.time === "" ? "book-now-field_hidden" : "book-now-field"}>
                            <label htmlFor="">What kind of services are you looking for?</label>
                            <select 
                                disabled={bookingInfo.time === "" ? true : false} name="serviceType" required value={bookingInfo.serviceType} onChange={e => handleInputChange(e)}>
                                <option 
                                    value="" defaultValue>Select a service
                                </option>
                                <option value="HAIR" >Hair</option>
                                <option value="MAKEUP" >Makeup</option>
                                <option value="NAIL" >Nail</option>
                                <option value="HENNA" >Henna</option>
                            </select>
                        </div>
                        {/* ---------- MAKEUP INPUTS ---------- */}
                        {
                            bookingInfo.serviceType === "MAKEUP" ?  
                                <div>
                                    <h1>TELL US ABOUT YOUR SKIN</h1>
                                    <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
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
                                    </div>
                                    <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What is your skin type?</label>
                                        <select disabled={bookingInfo.service === "" ? true : false} name="skinType" required value={bookingInfo.skinType} onChange={e => handleInputChange(e)}>
                                            <option 
                                                onChange={bookingInfo.skinType === "" ? bookingInfo.skinComplexion = "" : "" } 
                                                value="" defaultValue>Select a style</option>
                                            {services.map((val, index) => (
                                                <option value={val.service} >{val.service}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={bookingInfo.skinType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What is your skin complexion?</label>
                                        <select disabled={bookingInfo.skinType === "" ? true : false} name="skinComplexion" type="text" required value={bookingInfo.skinComplexion} onChange={e => handleInputChange(e)}>
                                            <option 
                                                onChange={bookingInfo.skinComplexion === "" ? bookingInfo.allergies = "" : "" }
                                                value="" defaultValue>Select a type</option>
                                            {cities.map((val, index) => (
                                                <option value={val.city} >{val.city}</option>
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
                                            <option value="" defaultValue>Select an answer</option>
                                            <option value="Daytime">Daytime</option>
                                            <option value="Natural (Light Contouring)">Natural (Light Contouring)</option>
                                            <option value="High Glam (Heavy Contouring)">High Glam (Heavy Contouring)</option>
                                            <option value="Evening">Evening</option>
                                            <option value="Gothic (Dark Makeup)">Gothic (Dark Makeup)</option>
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
                            </div> 
                            : ""
                        }
                        {/* ---------- NAIL INPUTS ---------- */}


                        {/* ---------- HAIR INPUTS ---------- */}
                        {
                            bookingInfo.serviceType === "HAIR" ? 
                                <div>
                                    <h1>TELL US ABOUT YOUR HAIR</h1>
                                    <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What is your hair type?</label>
                                        <select disabled={bookingInfo.serviceType === "" ? true : false} name="hairType" type="text" required value={bookingInfo.hairType} onChange={e => handleInputChange(e)}>
                                            <option 
                                                onChange={bookingInfo.hairType === "" ? bookingInfo.hairClass = "" : "" }
                                                value="" defaultValue>Select a type</option>
                                            {hairType.map((val, index) => (
                                                <option value={val.hair_type} >{val.hair_type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={bookingInfo.hairType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What is your hair type classification?</label>
                                        <select disabled={bookingInfo.hairType === "" ? true : false}  name="hairClass" required value={bookingInfo.hairClass} onChange={e => handleInputChange(e)}>
                                            <option 
                                                onChange={bookingInfo.hairClass === "" ? bookingInfo.service = "" : "" }
                                                value="" defaultValue>Select a classification</option>
                                            {services.map((val, index) => (
                                                <option value={val.service} >{val.service}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={bookingInfo.hairClass === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What kind of hair service are you looking for?</label>
                                        <select disabled={bookingInfo.hairClass === "" ? true : false} name="service" required value={bookingInfo.service} onChange={e => handleInputChange(e)}>
                                            <option
                                                value="" defaultValue>Select a service</option>
                                            {services.map((val, index) => (
                                                val.service_live ?
                                                        <option key={index} value={val.service} >{val.service}</option>
                                                    : ""
                                            ))}
                                        </select>
                                    </div>
                                    {bookingInfo.service === "Blowout" ? 
                                        <div>
                                            {/* FOR BLOWOUT SERVICES*/}
                                            <h2>1A. BLOWOUT SERVICES</h2>
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
                                        : "" }
                                    {bookingInfo.service === "Locs Extensions" || bookingInfo.service === "Signature Braid Style w/added hair" || bookingInfo.service === "Wig Installation"  ? 
                                        <div>
                                            {/* FOR BRAIDED EXTENSION SERVICES OR EXTENSION/ WEAVE SERVICES */}
                                            <h2>1B. BRAIDED EXTENSION SERVICES, WIG INSTALLATION OR EXTENSION/ WEAVE SERVICES</h2>
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
                                    {bookingInfo.hairType === "CURLY" ||  bookingInfo.hairType === "COILY"? 
                                        <div>
                                            {/* FOR CURL/NATURAL HAIR SERVICES */}
                                            <h2>1C. CURL/NATURAL HAIR SERVICES</h2>
                                            <div className={bookingInfo.hairType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                <label htmlFor="">What is your curl pattern? </label>
                                                <select disabled={bookingInfo.hairType === "" ? true : false} name="curlPattern" required value={bookingInfo.curlPattern} onChange={e => handleInputChange(e)}>
                                                    <option 
                                                        onChange={bookingInfo.curlPattern === "" ? bookingInfo.hairDensity = "" : "" }
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
                                                <label htmlFor="">What is your hair density? </label>
                                                <select disabled={bookingInfo.curlPattern === "" ? true : false} name="hairDensity" required value={bookingInfo.hairDensity} onChange={e => handleInputChange(e)}>
                                                    <option 
                                                        onChange={bookingInfo.hairDensity === "" ? bookingInfo.hairCare = "" : "" }
                                                        value="" defaultValue>Select a density</option>
                                                    <option value="Very Thick">Very Thick</option>
                                                    <option value="Somewhat Thick">Somewhat Thick</option>
                                                    <option value="Medium Thickness">Medium Thickness</option>
                                                    <option value="Thin">Thin</option>
                                                    <option value="Very Thin">Very Thin</option>
                                                </select>
                                            </div>
                                            <div className={bookingInfo.hairDensity === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                <label htmlFor="">What kind of hair care do you usually get? </label>
                                                <select disabled={bookingInfo.hairDensity === "" ? true : false} name="hairCare" required value={bookingInfo.hairCare} onChange={e => handleInputChange(e)}>
                                                    <option value="" defaultValue>Select an answer</option>
                                                    <option value="I receive professional care at a salon">I receive professional care at a salon</option>
                                                    <option value="I generally wash and style my hair myself">I generally wash and style my hair myself</option>
                                                    <option value="I generally do my own relaxer and/or color treatments">I generally do my own relaxer and/or color treatments</option>
                                                </select>
                                            </div>
                                        </div>
                                    : ""
                                    }
                                </div> 
                            :   ""
                        }
                        
                        {bookingInfo.service.includes("Loc") ? 
                            <div>
                                {/* FOR LOC SERVICES */}
                                <h2>1D. LOC SERVICES</h2>
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
                        {/* ---------- HAIR INPUTS ---------- */}


                        {/* ---------- GENERAL INPUTS ---------- */}
                        {bookingInfo.serviceType === "" ? 
                            "" : 
                            <div>
                                <h1>GENERAL</h1>
                                {
                                    bookingInfo.serviceType === "HAIR" ?
                                        <div className="book-now-field">
                                            <label htmlFor="">Do you have sensitive scalp?</label>
                                            <select name="upchargeScalp" required value={bookingInfo.upchargeScalp} onChange={e => handleInputChange(e)}>
                                                {/* <option value="" defaultValue>Select an answer</option> */}
                                                <option value={25}>Yes</option>
                                                <option value={0}>No</option>
                                            </select>
                                        </div>
                                    : ""
                                }
                                <div className="book-now-field">
                                    <label htmlFor="">Do you have available parking?</label>
                                    <select name="upchargeParking" required value={bookingInfo.upchargeParking} onChange={e => handleInputChange(e)}>
                                        {/* <option value="" defaultValue>Select an answer</option> */}
                                        <option value={0}>Yes</option>
                                        <option value={25}>No</option>
                                    </select>
                                </div>
                                {
                                    bookingInfo.upchargeParking === "" ? ""
                                    : 
                                        <div className="book-now-field">
                                            <label htmlFor="">Do you have stairs at your complex?</label>
                                            <select name="upchargeStairs" required value={bookingInfo.upchargeStairs} onChange={e => handleInputChange(e)}>
                                                {/* <option value="" defaultValue>Select an answer</option> */}
                                                <option value={10}>Yes</option>
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
                                {
                                    bookingInfo.service ?
                                        <div id="book-now-fieldDesc" className="book-now-field" style={{height: "100%", paddingTop: "15px"}}>
                                            <label htmlFor="">Review your appointment details:</label>
                                            {/* <h3>{val.description}</h3> */}
                                            <span>
                                                I want a <strong>{bookingInfo.service} </strong>
                                                in the <strong>[serviceStyle] </strong> 
                                                style. This appointment will take place on <strong>{bookingInfo.date} </strong> 
                                                at <strong>{formatAMPM(bookingInfo.time)} </strong> 
                                                in <strong>{bookingInfo.location} </strong> 
                                                for <strong>${bookingInfo.servicePrice + bookingInfo.upchargeParking + bookingInfo.upchargeScalp + bookingInfo.upchargeStairs} </strong>
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
                                                <input type="text" id="aptAddress2" name="aptAddress2" placeholder="Enter Unit or Apt #" required onChange={e => handleInputChange(e)}/>
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
                        {/* ---------- GENERAL INPUTS ---------- */}
                    </form>
                    <br />
                    <br />
                    {/* ---------- PAYMENT FORM ---------- */}
                    {
                        showPayment ? 
                            <div id="stripeContainer" className="stripe-container">
                                <Elements  stripe={stripeTestPromise}>
                                    <PaymentForm
                                        handleBookingInfoFormSubmit = {handleBookingInfoFormSubmit}
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
        </Layout>
    )
}

export default BookNow
