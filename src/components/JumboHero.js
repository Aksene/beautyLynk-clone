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
    const [bookingInfo, setBookingInfo] = useState({
        location: "",
        service: "",
        date: "",
        time: "",
    })
    const [cities, setCities] = useState([])
    const [services, setServices] = useState([])

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
            .select('city')
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
            .select('service')

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
                <img className="heroImage" src="/images/hero/bg_2.gif" alt="BeautyLynk hero image"/>
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
                                    <option key={index} value={val.city} >{val.city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="booking-field">
                            <select className="booking-field_select" name="service" required value={bookingInfo.service} onChange={e => handleInputChange(e)}>
                                <option value="" defaultValue>Select a service</option>
                                {services.map((val, index) => (
                                    <option key={index} value={val.service} >{val.service}</option>
                                ))}
                            </select>
                        </div>
                        <div className="booking-field">
                            <input className="booking-field_input" type="date" name="date" required value={bookingInfo.date} onChange={e => handleInputChange(e)}/>
                        </div>
                        <div className="booking-field">
                            <input className="booking-field_input" type="time" name="time" required value={bookingInfo.time} onChange={e => handleInputChange(e)}/>
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
