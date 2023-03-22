import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import Layout from '../components/Layout'
import './BookNow.css'
import { useLocation } from 'react-router-dom'

function BookNow() {
    const [bookingInfo, setBookingInfo] = useState({
        location: "",
        serviceType: "",
        service: "",
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
    })
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
        newFormData[fieldName] = fieldValue
        
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

        console.log(newBooking)

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
            .select('city')
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
            .select('service')

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

    const handleServiceDelete = () => {
        if (bookingInfo.serviceType === "") {
            console.log("Empty service delete: ", bookingInfo.serviceType)
            bookingInfo.service = ""
            bookingInfo.hairType = ""
        } else if(bookingInfo.serviceType === "Makeup") {
            console.log("Makeup service delete: ", bookingInfo.serviceType)
            bookingInfo.hairType = ""
        } else if(bookingInfo.serviceType === "Nail") {
            console.log("Nail service delete: ", bookingInfo.serviceType)
            bookingInfo.hairType = ""
        } 
        // else if(bookingInfo.serviceType === "Hair") {
        //     console.log("Hair service delete: ", bookingInfo.serviceType)
        //     bookingInfo.service = ""
        // }
        //  & (bookingInfo.serviceType === "" ? (bookingInfo.hairType = "") : "")
        //  || bookingInfo.serviceType === "Hair" || bookingInfo.serviceType === "Makeup" || bookingInfo.serviceType === "Nail" ? bookingInfo.service === "" : "" }
    }

    return (
        <Layout>
            <div className="book-now-container">
                <div className="form-wrap">
                    <form onSubmit={(e) => {
                        e.preventDefault();
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
                                    <option value={val.city} >{val.city}</option>
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
                                disabled={bookingInfo.date === "" ? true : false} type="time" name="time" required value={bookingInfo.time} onChange={e => handleInputChange(e)}/>
                        </div>
                        <div className={bookingInfo.time === "" ? "book-now-field_hidden" : "book-now-field"}>
                            <label htmlFor="">What kind of services are you looking for?</label>
                            <select 
                                disabled={bookingInfo.time === "" ? true : false} name="serviceType" required value={bookingInfo.serviceType} onChange={e => handleInputChange(e)}>
                                <option 
                                    onChange={ handleServiceDelete()}
                                    value="" defaultValue>Select a service
                                </option>
                                <option value="Hair" >Hair</option>
                                <option value="Makeup" >Makeup</option>
                                <option value="Nail" >Nail</option>
                            </select>
                        </div>
                        {/* ---------- MAKEUP INPUTS ---------- */}
                        {
                            bookingInfo.serviceType === "Makeup" ?  
                                <div>
                                    <h1>MAKEUP</h1>
                                    <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What kind of makeup service are you looking for?</label>
                                        <select disabled={bookingInfo.serviceType === "" ? true : false} name="service" required value={bookingInfo.service} onChange={e => handleInputChange(e)}>
                                            <option 
                                                onChange={bookingInfo.service === "" ? bookingInfo.skinType = "" : "" }
                                                value="" defaultValue>Select a service</option>
                                            {services.map((val, index) => (
                                                <option value={val.service} >{val.service}</option>
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
                            bookingInfo.serviceType === "Nail" ?  
                            <div>
                                <h1>Nails</h1>
                                <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                    <label htmlFor="">What kind of nail service are you looking for?</label>
                                    <select disabled={bookingInfo.serviceType === "" ? true : false} name="service" required value={bookingInfo.service} onChange={e => handleInputChange(e)}>
                                        <option value="" defaultValue>Select a service</option>
                                        {services.map((val, index) => (
                                            <option value={val.service} >{val.service}</option>
                                        ))}
                                    </select>
                                </div>
                            </div> 
                            : ""
                        }
                        {/* ---------- NAIL INPUTS ---------- */}


                        {/* ---------- HAIR INPUTS ---------- */}
                        {
                            bookingInfo.serviceType === "Hair" ? 
                                <div>
                                    <h1>HAIR INPUTS</h1>
                                    <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What is your hair type?</label>
                                        <select disabled={bookingInfo.serviceType === "" ? true : false} name="hairType" type="text" required value={bookingInfo.hairType} onChange={e => handleInputChange(e)}>
                                            <option value="" defaultValue>Select a type</option>
                                            {hairType.map((val, index) => (
                                                <option value={val.hair_type} >{val.hair_type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={bookingInfo.hairType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What is your hair type classification?</label>
                                        <select disabled={bookingInfo.hairType === "" ? true : false}  name="hairClass" required value={bookingInfo.hairClass} onChange={e => handleInputChange(e)}>
                                            <option value="" defaultValue>Select a classification</option>
                                            {services.map((val, index) => (
                                                <option value={val.service} >{val.service}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={bookingInfo.hairClass === "" ? "book-now-field_hidden" : "book-now-field"}>
                                        <label htmlFor="">What kind of hair service are you looking for?</label>
                                        <select disabled={bookingInfo.hairClass === "" ? true : false} name="service" required value={bookingInfo.service} onChange={e => handleInputChange(e)}>
                                            <option value="" defaultValue>Select a service</option>
                                            {services.map((val, index) => (
                                                <option value={val.service} >{val.service}</option>
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
                                                    <option value="" defaultValue>Select a service</option>
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </select>
                                            </div>
                                            {bookingInfo.hairExt === true ?
                                                <div className={bookingInfo.hairExt === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                    <label htmlFor="">What type of extensions?</label>
                                                    <select disabled={bookingInfo.hairExt === "" ? true : false} name="hairExtType" required value={bookingInfo.hairExtType} onChange={e => handleInputChange(e)}>
                                                        <option value="" defaultValue>Select a service</option>
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
                                    {bookingInfo.service === "Locs Extensions" || bookingInfo.service === "Signature Braid Style w/added hair"  ? 
                                        <div>
                                            {/* FOR BRAIDED EXTENSION SERVICES OR EXTENSION/ WEAVE SERVICES */}
                                            <h2>1B. BRAIDED EXTENSION SERVICES OR EXTENSION/ WEAVE SERVICES</h2>
                                            <div className={bookingInfo.service === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                <label htmlFor="">Do you suffer from hair loss?</label>
                                                <select disabled={bookingInfo.service === "" ? true : false} name="hairLoss" required value={bookingInfo.hairLoss} onChange={e => handleInputChange(e)}>
                                                    <option value="" defaultValue>Select a style</option>
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </select>
                                            </div>
                                            {bookingInfo.hairLoss === true ?
                                                <div>
                                                    <div className={bookingInfo.hairLoss === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                        <label htmlFor="">Have you been professionally diagnosed?</label>
                                                        <select disabled={bookingInfo.hairLoss === "" ? true : false} name="hairLossDiag" required value={bookingInfo.hairLossDiag} onChange={e => handleInputChange(e)}>
                                                            <option value="" defaultValue>Select a style</option>
                                                            <option value={true}>Yes</option>
                                                            <option value={false}>No</option>
                                                        </select>
                                                    </div>
                                                    {bookingInfo.hairLossDiag === true ?
                                                        <div className={bookingInfo.hairLossDiag === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                            <label htmlFor="">What is the cause?</label>
                                                            <select disabled={bookingInfo.hairLossDiag === "" ? true : false} name="hairLossCause" required value={bookingInfo.hairLossCause} onChange={e => handleInputChange(e)}>
                                                                <option value="" defaultValue>Select a style</option>
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
                                    {bookingInfo.hairType === "CURLY" ? 
                                        <div>
                                            {/* FOR CURL/NATURAL HAIR SERVICES */}
                                            <h2>1C. CURL/NATURAL HAIR SERVICES</h2>
                                            <div className={bookingInfo.hairType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                <label htmlFor="">What is your curl pattern? </label>
                                                <select disabled={bookingInfo.hairType === "" ? true : false} name="curlPattern" required value={bookingInfo.curlPattern} onChange={e => handleInputChange(e)}>
                                                    <option value="" defaultValue>Select a pattern</option>
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
                                                    <option value="" defaultValue>Select a style</option>
                                                    <option value="Very Thick">Very Thick</option>
                                                    <option value="Somewhat Thick">Somewhat Thick</option>
                                                    <option value="Medium Thickness">Medium Thickness</option>
                                                    <option value="Thin">Thin</option>
                                                </select>
                                            </div>
                                            <div className={bookingInfo.hairDensity === "" ? "book-now-field_hidden" : "book-now-field"}>
                                                <label htmlFor="">What kind of hair care do you usually get? </label>
                                                <select disabled={bookingInfo.hairDensity === "" ? true : false} name="hairCare" required value={bookingInfo.hairCare} onChange={e => handleInputChange(e)}>
                                                    <option value="" defaultValue>Select a style</option>
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
                                        <option value="" defaultValue>Select an answer</option>
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
                                <div className={bookingInfo.serviceType === "" ? "book-now-field_hidden" : "book-now-field"}>
                                    <label htmlFor="">Do you have any pets?</label>
                                    <select name="pet" required value={bookingInfo.pet} onChange={e => handleInputChange(e)}>
                                        <option value="" defaultValue>Select a answer</option>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>
                                <div className="book-now-field">
                                    <label htmlFor="">Please let us know how we may accommodate you to help you enjoy your beauty experience. Do you need special accommodations?</label>
                                    <select name="specialAcc" required value={bookingInfo.specialAcc} onChange={e => handleInputChange(e)}>
                                        <option value="" defaultValue>Select an answer</option>
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
                                <br />
                                <div className="book-now-submitBtn-container">
                                    <button className="book-now-submitBtn">SUBMIT</button>
                                </div>
                                
                            </div> 
                        }
                        {/* ---------- GENERAL INPUTS ---------- */}
                    </form>
                    {/* ---------- PAYMENT FORM ---------- */}
                    {
                        showPayment ? 
                            <div>
                                <h1>Testing Payment</h1>
                                <form onSubmit={handleBookingInfoFormSubmit}>
                                    <div className="payment-wrap">
                                        <label htmlFor="">Please confirm your appointment</label>
                                        <div>
                                            <h4>Payment Info</h4>
                                            <div>
                                                <div className="payment-field">
                                                    <label htmlFor="">Name</label>
                                                    <input type="text" />
                                                </div>
                                                <div className="payment-field">
                                                    <label htmlFor="">Name</label>
                                                    <input type="number" name="" id="" />
                                                </div>
                                                <div className="payment-field">
                                                    <label htmlFor="">Name</label>
                                                    <input type="month" name="" id="" />
                                                </div>
                                                <div className="payment-field">
                                                    <label htmlFor="">Name</label>
                                                    <input type="" />
                                                </div>
                                                <div className="payment-field">
                                                    <label htmlFor="">Name</label>
                                                    <input type="text" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
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
