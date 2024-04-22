import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import "./JumboHero.css"
import { supabase } from '../database/Database'



function JumboHero() {
    // const [bookingList, setBookingList] = useState([{
    //     location: "",
    //     service: "",
    //     date: "",
    //     time: "",
    // }])
    var raw = new Date()

    const [bookingInfo, setBookingInfo] = useState({
        location: "",
        serviceType: "",
        // date: `${raw.getFullYear()}-${raw.getDate()}-${raw.getMonth()+1}`,
        date: "",
        time: "",
        // time: raw.getTime(),
        timezone:"",
    })
    const [cities, setCities] = useState([])
    const [services, setServices] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [currHero, setCurrHero] = useState("")
    const heros = ["/images/hero/bg_1.gif", "/images/hero/bg_2.gif", "/images/hero/bg_3.gif", "/images/hero/bg_4.gif"]
    var newDate = `${raw.getFullYear()}-${raw.getDate()}-${raw.getMonth()+1}`
    console.log("Todays date: ", newDate)
    
    if(!isLoaded) {
        setCurrHero(heros[(Math.floor(Math.random() * heros.length))]);
        setIsLoaded(true)
        console.log("hero has been loaded", currHero)
    }

    useEffect(() => {

        getCities()
        getServices()
       
    },[])

    const handleInputChange = (e) => {
        const fieldName = e.target.getAttribute("name")
        const fieldValue = e.target.value;

        console.log("Field Value" + fieldValue)
        console.log("Field Name" + fieldName)

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

        const newBooking = {
            location: bookingInfo.location,
            service: bookingInfo.service,
            date: bookingInfo.date,
            time: bookingInfo.time,
        }

        console.log(newBooking)

        if(newBooking) {
            // With upsert, if upload exist it updates it and if not it will insert a new row
            const {data, error} = await supabase.from("BeautyLynk_Bookings").insert({
                location: newBooking.location,
                service: newBooking.service,
                date: newBooking.date,
                time: newBooking.time,
            })
            if(error) {
                console.log(error)
                alert(error.message)
            }
            if(data) {
                console.log(data)
                setBookingInfo({
                    location: "",
                    service: "",
                    date: "",
                    time: "",
                })
            }
        }
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
            console.log("Data info for user")
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
            console.log("Data info for user")
            console.log(data)
            setServices(data)

            // console.log(data.id)
        }
    }

    return (
        <div className="jumbo-wrap">
            <figure>
                <img className="heroImage" src={currHero} alt="BeautyLynk hero image"/>
                <figcaption>
                    <div className="row justify-content-end">
                        <h2>Beauty. On Your Time.</h2>
                        <p>Get makeup, hair, and skincare services done by certified beauty professionals from the comfort of your home or office</p>
                    </div>
                </figcaption>
                <div className="booking-wrap">
                    <form onSubmit={handleBookingInfoFormSubmit} className="booking-select_wrap">
                        <div className="booking-field">
                            <select className="booking-field_select" name="location" type="text" required value={bookingInfo.location} onChange={e => handleInputChange(e)}>
                                <option value="" defaultValue>Select a location</option>
                                {cities.map((val, index) => (
                                    val.city_status === "live" ?
                                        <option key={index} value={val.city} >{val.city}</option>
                                    : ""
                                ))}
                            </select>
                        </div>
                        <div className="booking-field">
                            <select className="booking-field_select" name="serviceType" required value={bookingInfo.serviceType} onChange={e => handleInputChange(e)}>
                                <option 
                                    value="" defaultValue>Select a service type
                                </option>
                                <option value="HAIR" >Hair</option>
                                <option value="MAKEUP" >Makeup</option>
                                <option value="NAIL" >Nail</option>
                                <option value="HENNA" >Henna</option>
                            </select>
                        </div>
                        <div className="booking-field">
                            <input placeholder={ bookingInfo.date ? "" : "MM/DD/YYYY"} type="date"  className="booking-field_input" name="date" required value={bookingInfo.date} onChange={e => handleInputChange(e)}/>
                        </div>
                        <div className="booking-field">
                            <input placeholder={ bookingInfo.time ? "" : "--:-- --"} className="booking-field_input"  type="time" name="time" required value={bookingInfo.time} onChange={e => handleInputChange(e)}/>
                        </div>
                        <div className="booking-field">
                                <select className="booking-field_select"  name="timezone" id="timezone" name="timezone" required value={bookingInfo.timezone} onChange={e => handleInputChange(e)}>
                                    <option value="" defaultValue>Select a time zone</option>
                                    <option value="Eastern Time Zone">Eastern Time Zone</option>
                                    <option value="Central Time Zone">Central Time Zone</option>
                                    <option value="Mountain Time Zone">Mountain Time Zone</option>
                                    <option value="Pacific Time Zone">Pacific Time Zone</option>
                                    <option value="Hawaiian Time Zone">Hawaiian Time Zone</option>
                                    <option value="Alaskan Time Zone">Alaskan Time Zone</option>
                                </select>                        
                        </div>
                        <div className="booking-field">
                            <Link to="/book-now" state={{homeInfo: bookingInfo}}>
                                <button className="booking-field_button"> BOOK NOW</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </figure>
        </div>
    )
}

export default JumboHero
