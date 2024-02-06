import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Tab from '../components/Tab'
import axios from "axios"
import './Dashboard.css'
import { useLocation } from 'react-router-dom'
import { useAuth2 } from '../Auth/auth2'


function Dashboard() {
    const auth = useAuth2()
    var date
    var createdDate
    const [user, setUser] = useState("")
    const [bookingInfo, setBookingInfo] = useState("")
    const [allBookingInfo, setAllBookingInfo] = useState([])
    const [allPros, setAllPros] = useState([])
    const [proInfo, setProInfo] = useState("")
    const [cusInfo, setCusInfo] = useState("")

    const search = useLocation().search;
    const accID=new URLSearchParams(search).get("accID");
    console.log("Search params: accID= " + accID)
    const width = window.screen.width
    console.log("Dashboard screen width: ",width)



    useEffect(() => {
        const getUser = async(e) => {
            const { data: { user } } = await supabase.auth.getUser()
            console.log(auth.user)
            console.log(auth.session)
            setUser(auth.user)
        }

        getUser()
        getProInfo()
        getCusInfo()
        getBooking()
        getAllBooking()
        getAllPros()

        if (accID) {
            setStripeConnect()
        }
    },[proInfo.length || cusInfo.length])

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
            setProInfo(data)
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
            setCusInfo(data)
        }
    }

    const getAllBooking = async() => {
        var query

        if (proInfo.length || cusInfo.length) {

            const {data, error} = await supabase
                .from('BeautyLynk_Bookings')
                .select('*')
            if(error){
                console.log(error)
            }
            if(data){
                // info.push(data)
                console.log("All Booking information", data)
                setAllBookingInfo(data)
                // console.log(data.id)
            }
        }
    }

    const getAllPros = async() => {
        var query

        if (proInfo.length || cusInfo.length) {

            const {data, error} = await supabase
                .from('BeautyLynk_Pros_dup')
                .select('*')
            if(error){
                console.log(error)
            }
            if(data){
                // info.push(data)
                console.log("All Pro information", data)
                setAllPros(data)

                // console.log(data.id)
            }
        }
    }

    const getBooking = async() => {
        var query

        if (proInfo.length) {
            proInfo.map((pro) => {
                query = pro.id
            }) 

            const {data, error} = await supabase
                .from('BeautyLynk_Bookings')
                .select('*')
                .eq("assignedPro", `${query}`)
            if(error){
                console.log(error)
            }
            if(data){
                // info.push(data)
                console.log("Booking information", data)
                setBookingInfo(data)

                // console.log(data.id)
            }
        } else if(cusInfo.length) {
            cusInfo.map((cus) => {
                query = cus.email
            }) 
            
            const {data, error} = await supabase
                .from('BeautyLynk_Bookings')
                .select('*')
                .eq("email", `${query}`)
            if(error){
                console.log(error)
            }
            if(data){
                // info.push(data)
                console.log("Booking information", data)
                setBookingInfo(data)
            }
        }
    }

    const cancelBooking = async(bookingID, intent) => {

        console.log("Deleting booking: ", bookingID, intent)

        if(intent && bookingID){
            console.log("INTENT METHOD")
            const response = await axios.post("https://beautylynk-clone-server.vercel.app/refund", {
            // const response = await axios.post("http://localhost:4000/refund", {
                intent: intent
            })
            console.log("Stripe 35 | data raw", response);
            console.log("Stripe 35 | data", response.data.success);
            if(response.data.success) {
                console.log("Successful refund!")
                // setSuccess(true)
                console.log("Refund data:",response.data.refund)
                if(bookingID){
                    const { data, error } = await supabase
                        .from('BeautyLynk_Bookings')
                        .delete()
                        .eq('id', bookingID)
                    if(error){
                        console.log(error)
                    }
                    if(data){
                        console.log("Deleted booking information", data)
                    }
                    window.location.reload();
                }
            }
        } else if(bookingID) {
            console.log("SUPABASE METHOD")

            const { data, error } = await supabase
                .from('BeautyLynk_Bookings')
                .delete()
                .eq('id', bookingID)
            if(error){
                console.log(error)
            }
            if(data){
                console.log("Deleted booking information", data)
            }
            window.location.reload();
        }
    }

    const setStripeConnect = async() => {
        var acc
        if (proInfo) {
            proInfo.map((info) => acc = info.stripeConnect)
        }

        if(!acc) {
            // With upsert, if upload exist it updates it and if not it will insert a new row
            const {data, error} = await supabase
                .from('BeautyLynk_Pros')
                .update({ stripeConnect: accID })
                .eq("email", `${auth.user.email}`)
                .select()
            if(error) {
                console.log(error)
                alert(error.message)
            }
            if(data) {
                console.log("STRIPE CONNECT has been updated",data)
            }
        } else {
            console.log("STRIPE CONNECT has already been connected", acc)
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
    const timeFormat = (rawDate) => {
        var time = rawDate.split(':'); // convert to array

        // fetch
        var hours = Number(time[0]);
        var minutes = Number(time[1]);
        var seconds = Number(time[2]);

        var timeValue;

        if (hours > 0 && hours <= 12) {
            timeValue= "" + hours;
        } else if (hours > 12) {
            timeValue= "" + (hours - 12);
        } else if (hours == 0) {
            timeValue= "12";
        }
        
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        // timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
        timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

        // show
        console.log(timeValue);
        

        console.log("Time format test " + timeValue)
        return timeValue
    }

    return (
        <Layout>
            <br />
            {
                proInfo.length ?
                    <div>
                        Pro Dashboard
                        <div>
                            <div className="welcome-block">
                                <div className="welcome-profile">
                                    <a href={`/profile?id=${proInfo.map((info) => (info.id))}`}>
                                        {proInfo.map((info) => 
                                            info.avatar ? <img className="welcome-profile_image"  src={info.avatar} alt="" />
                                            : <img className="welcome-profile_image" src="./newProfile.png" alt="" />
                                        )}
                                    </a> 
                                    <h4 className="welcome-profile_text">{proInfo.map((info) => (<>{info.firstName} {info.lastName}</>))}</h4>
                                </div>
                                <div className="box sb2">
                                    {/* <h1>Email: {auth.user.email}</h1> */}
                                    {/* <h2>ID: {auth.user.id}</h2>
                                    <h3>role: {auth.user.role}</h3> */}
                                    <h2>{proInfo.map((info) => (info.firstName))}! Empower Your Passion, Elevate Your Craft. Welcome back to your BeautyLynk dashboard, where every touch makes a difference. Stay informed, stay inspired.</h2>
                                </div>
                            </div>
                            {
                                proInfo.map((info) => (
                                    info.stripeConnect ? <div className="stripe-connect_button">
                                            <h4> Stripe Connect ID: {info.stripeConnect}</h4>
                                        </div> 
                                    : <div className="stripe-connect_button">
                                        <form action="//beautylynk-clone-server.vercel.app/onboard-user" method="POST">
                                            <button type="submit">
                                                {/* <img src="/public/stripe.webp" alt="" /> */}
                                            </button>
                                        </form>
                                        <h4>Set-up Stripe Connect! <br /> Get paid after every booking</h4>

                                    </div>
                                ) )
                            }
                            

                            <>
                                <div className="tab-row">
                                    <h1>Stylist Booking History</h1>
                                    <h4 className="dashboard-header_sub" >Stay Organized, Stay Efficient! Manage your appointments here.</h4>
                                    <br />
                                    <div className="tab-row text-left">
                                        <Tab>
                                            <Tab.TabPane key={`Tab-1`} tab={"Confirmed Appointment"}>
                                                <div className="dashboard-table">
                                                    {
                                                        bookingInfo.length ? 
                                                            <table className="darkTable">
                                                                <thead>
                                                                    <tr>
                                                                        <th><h4>Service</h4></th>
                                                                        <th><h4>Customer Detail</h4></th>
                                                                        {width > 1000 ? <th><h4>Location</h4></th> : ""}
                                                                        <th><h4>Date/Time</h4></th>
                                                                        <th><h4>Service Status</h4></th>
                                                                        {width > 1000 ? <th><h4>Payout</h4></th> : ""}
                                                                        <th><h4>Customer Photo</h4></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {bookingInfo.map((booking) => (
                                                                        booking.isAccepted ? 
                                                                            <tr key={booking.id}>
                                                                                <td className="dashboard-table_serviceType">
                                                                                    <a title="Click here to view more details" href={`/booking-details?id=${booking.id}`} to={`/booking-details?id=${booking.id}`}>
                                                                                        {booking.serviceType} {' service in the '} {booking.service} {"style"}
                                                                                    </a>
                                                                                </td>
                                                                                <td>{booking.firstName} {booking.lastName}</td>
                                                                                {width > 1000 ? <td>{booking.location}</td> : ""}
                                                                                <td>{dateFormat(booking.date)} at {timeFormat(booking.time)}</td>
                                                                                <td>
                                                                                    {
                                                                                        booking.isCompleted ? <p className="dashboard-table_status-green">Completed</p>
                                                                                            : <p className="dashboard-table_status-grey">Scheduled</p>
                                                                                    }
                                                                                </td>
                                                                                {width > 1000 ? <td>${booking.payout}</td> : ""}
                                                                                <td className="dashboard-table_uploadButton">
                                                                                    {
                                                                                        booking.customerPhoto ? 
                                                                                            <a href={`${booking.customerPhoto}`} target="_blank">
                                                                                                <img src={booking.customerPhoto} width={50} className=""></img>
                                                                                            </a>
                                                                                        :   <a title="Click here to upload images customer photos" href={`/upload?id=${booking.id}`} to={`/upload?id=${booking.id}`}>
                                                                                                Upload Images
                                                                                            </a>
                                                                                    }
                                                                                </td>
                                                                            </tr>    
                                                                        : ""
                                                                    ))}
                                                                </tbody>
                                                            </table> 
                                                        : <table className="darkTable">
                                                            <thead>
                                                            </thead>
                                                            <tbody className="empty-pending">
                                                                <h1> No Pending Appointments </h1>
                                                            </tbody>
                                                        </table>  
                                                    }
                                                </div>
                                            </Tab.TabPane>
                                            <Tab.TabPane key={`Tab-2`} tab={"Pending Appointment"}>
                                                <div className="dashboard-table">
                                                    {
                                                        allBookingInfo.length ? 
                                                             <table className="darkTable">
                                                                <thead>
                                                                    <tr>
                                                                        <th><h4>Service</h4></th>
                                                                        <th><h4>Customer Detail</h4></th>
                                                                        {width > 1000 ? <th><h4>Location</h4></th> : ""}
                                                                        <th><h4>Appointment Date/Time</h4></th>
                                                                        {width > 1000 ? <th><h4>Posted Date/Time</h4></th> : ""}
                                                                        <th><h4>Payout</h4></th>
                                                                        <th><h4>Actions</h4></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        proInfo.map((pro) => (
                                                                            allBookingInfo.map((booking) => (
                                                                                pro.location === booking.aptState && booking.isAccepted === false ? 
                                                                                    <tr key={booking.id}>
                                                                                        <td className="dashboard-table_serviceType">{booking.serviceType} {' service in the '} {booking.service} {" style"}</td>
                                                                                        <td>{booking.firstName} {booking.lastName}</td>
                                                                                        {width > 1000 ? <td>{booking.location}</td> : ""}
                                                                                        <td>{dateFormat(booking.date)} at {timeFormat(booking.time)}</td>
                                                                                        {width > 1000 ? <td>{dateFormat(booking.created_at)} at {dateTimeFormat(booking.created_at)}</td> : ""}
                                                                                        <td>${booking.payout}</td>
                                                                                        <td className="dashboard-booking_detail">
                                                                                            <a title="Click here to view more details or accept this booking" href={`/booking-confirmation?id=${booking.id}`} to={`/booking-confirmation?id=${booking.id}`}>
                                                                                                View Details
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr> : ""
                                                                            ))         
                                                                        ))
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            : <table className="darkTable">
                                                                <thead>
                                                                </thead>
                                                                <tbody className="dahsboard-empty_pending">
                                                                    <h1> No Pending Appointments </h1>
                                                                </tbody>
                                                            </table>
                                                    }
                                                </div>
                                            </Tab.TabPane>
                                        </Tab>
                                    </div>
                                </div>
                            </>
                        </div>
                    </div>
                : cusInfo.length ?   <div>
                        Customer Dashboard
                        <div className="welcome-block">
                            <div className="welcome-profile">
                                <a href="">
                                    {cusInfo.map((info) => 
                                            info.avatar ? <img className="welcome-profile_image"  src={info.avatar} alt="" />
                                            : <img className="welcome-profile_image" src="./newProfile.png" alt="" />
                                    )}
                                </a> 
                                <h4 className="welcome-profile_text">{cusInfo.map((info) => (info.firstName))}</h4>
                            </div>
                            <div className="box sb2">
                                {/* <h1>Email: {auth.user.email}</h1> */}
                                {/* <h2>ID: {auth.user.id}</h2>
                                <h3>role: {auth.user.role}</h3> */}
                                <h2>{cusInfo.map((info) => (info.firstName))}! Empower Your Passion, Elevate Your Craft. Welcome back to your BeautyLynk dashboard, where every touch makes a difference. Stay informed, stay inspired.</h2>
                            </div>
                            <br /><br />
                        </div>
                        <>
                                <div className="tab-row">
                                    <h1>Customer Booking History</h1>
                                    <h4 className="dashboard-header_sub" >Stay Organized, Stay Efficient! Manage your appointments here.</h4>
                                    <br />
                                    <div className="tab-row text-left">
                                        <Tab>
                                            <Tab.TabPane key={`Tab-3`} tab={"Current Appointments"}>
                                                <div className="dashboard-table">
                                                    {
                                                        bookingInfo.length ? 
                                                            <table className="darkTable">
                                                                <thead>
                                                                    <tr>
                                                                        <th><h4>Service</h4></th>
                                                                        <th><h4>Location</h4></th>
                                                                        <th><h4>Date/Time</h4></th>
                                                                        <th><h4>Appointment Status</h4></th>
                                                                        {width > 1000 ? <th><h4>Stylist</h4></th> : ""}
                                                                        <th><h4>Actions</h4></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {bookingInfo.map((booking) => (
                                                                        !booking.isCompleted && booking.email == cusInfo.map((info)=> info.email)? 
                                                                            <tr key={booking.id}>
                                                                                <td className="dashboard-table_serviceType">
                                                                                    <a title="Click here to view more details" href={`/booking-details?id=${booking.id}`} to={`/booking-details?id=${booking.id}`}>
                                                                                        {booking.serviceType} {' service in the '} {booking.service} {"style"}
                                                                                    </a>
                                                                                </td>
                                                                                <td>{booking.location}</td>
                                                                                <td>{dateFormat(booking.date)} at {timeFormat(booking.time)}</td>
                                                                                <td>
                                                                                    {
                                                                                        booking.isAccepted ? <p className="dashboard-table_status-green">Confirmed</p>
                                                                                            : <p className="dashboard-table_status-grey">Pending...</p>
                                                                                    }
                                                                                </td>
                                                                                {width > 1000 ? <td>
                                                                                    {
                                                                                        booking.assignedPro ? 
                                                                                            <a className="dashboard-table_stylist" href={`/profile?id=${booking.assignedPro}`}> 
                                                                                                {allPros.map((pro) => pro.id == booking.assignedPro ? `${pro.firstName} ${pro.lastName}` : "")}
                                                                                            </a>
                                                                                            : "..."
                                                                                    }
                                                                                </td> : ""}
                                                                                <td className="dashboard-table_actions">
                                                                                    {
                                                                                        <div>
                                                                                            {/* <img className="able-edit_btn" src="./icons/trash.png" alt="" srcset="" /> */}
                                                                                            {/* <button className="table-edit_btn">X</button> */}
                                                                                            <div >
                                                                                                <img className="table-delete_btn" src="./icons/trash.png" alt="" onClick={() => cancelBooking(booking.id, booking.stripeIntent)}/>
                                                                                            </div>  
                                                                                        </div>
                                                                                    }
                                                                                </td>
                                                                            </tr>    
                                                                        : ""
                                                                    ))}
                                                                </tbody>
                                                            </table> 
                                                        : <table className="darkTable">
                                                            <thead>
                                                            </thead>
                                                            <tbody className="dahsboard-empty_pending">
                                                                <h1> No Pending Appointments </h1>
                                                            </tbody>
                                                        </table>  
                                                    }
                                                </div>
                                            </Tab.TabPane>
                                            <Tab.TabPane key={`Tab-4`} tab={"Past Appointments"}>
                                                <div className="dashboard-table">
                                                    {
                                                        bookingInfo.length ?
                                                             <table className="darkTable">
                                                                <thead>
                                                                    <tr>
                                                                        <th><h4>Service</h4></th>
                                                                        <th><h4>Location</h4></th>
                                                                        <th><h4>Date/Time</h4></th>
                                                                        {width > 1000 ? <th><h4>Created</h4></th> : ""}
                                                                        <th><h4>Appointment Status</h4></th>
                                                                        {width > 1000 ? <th><h4>Stylist</h4></th> : ""}
                                                                        <th><h4>View Details</h4></th>
                                                                        <th><h4>Photo</h4></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        
                                                                            allBookingInfo.map((booking) => (
                                                                                booking.isCompleted && booking.email == cusInfo.map((info)=> info.email)? 
                                                                                    <tr key={booking.id}>
                                                                                        <td className="dashboard-table_serviceType">{booking.serviceType} {' service in the '} {booking.service} {" style"}</td>
                                                                                        {width > 1000 ? <td>{booking.location}</td> : ""}
                                                                                        <td>{dateFormat(booking.date)} at {timeFormat(booking.time)}</td>
                                                                                        {width > 1000 ? <td>{dateFormat(booking.created_at)} "at" {dateTimeFormat(booking.created_at)}</td> : ""}
                                                                                        <td className="dashboard-booking_detail">
                                                                                            <a title="Click here to view more details" href={`/booking-details?id=${booking.id}`} to={`/booking-details?id=${booking.id}`}>
                                                                                                View Details
                                                                                            </a>
                                                                                        </td>
                                                                                        <td className="dashboard-table_uploadButton">
                                                                                            {
                                                                                                booking.customerPhoto ? 
                                                                                                    <a href={`${booking.customerPhoto}`} target="_blank">
                                                                                                        <img src={booking.customerPhoto} width={50} className=""></img>
                                                                                                    </a>
                                                                                                :   "Unavailable"
                                                                                            }
                                                                                        </td>
                                                                                    </tr> : ""
                                                                            ))      
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            : <table className="darkTable">
                                                                <thead>
                                                                </thead>
                                                                <tbody className="dahsboard-empty_pending">
                                                                    <h1> No Past Bookings </h1>
                                                                </tbody>
                                                            </table>
                                                    }
                                                </div>
                                            </Tab.TabPane>
                                        </Tab>
                                    </div>
                                </div>
                            </>
                    </div>
                : <div>
                    <h4>Loading...</h4>
                    <br />
                    <br />
                    <br />
                </div>
            }
            <br /><br /><br /><br />

            {
                proInfo.length ? 
                    <div className="dashboard-videos">
                        <h1> Training Videos</h1>
                        <h4 className="dashboard-header_sub" >Stay Ahead of Trends! Check out our newest beauty tutorials.</h4>
                        <br />

                        <div className="dashboard-videos_container">
                            <iframe
                                className="dashboard-video"
                                src={`https://www.youtube.com/embed/RGA8HGa59jg`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                            />
                            <iframe
                                className="dashboard-video"
                                src={`https://www.youtube.com/embed/Flha1Dzb5Fo`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                            />
                            <iframe
                                className="dashboard-video"
                                src={`https://www.youtube.com/embed/truSLwkJs5s`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                            />
                            <iframe
                                className="dashboard-video"
                                src={`https://www.youtube.com/embed/QDtOQXfCbaM`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                            />
                        </div>
                    </div>
                    : ""
            }
            <br /><br /><br />
        </Layout>
        
    )
}

export default Dashboard
