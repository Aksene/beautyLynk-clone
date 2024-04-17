import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import DeletePopup from '../components/DeletePopup'
import PayoutPopup from '../components/PayoutPopup'
import Tab from '../components/Tab'
import axios from "axios"
import './Dashboard.css'
import { useLocation } from 'react-router-dom'
import { useAuth2 } from '../Auth/auth2'
import emailjs from "@emailjs/browser";

import Pagination from '../components/Pagination';




function Dashboard() {
    const auth = useAuth2()
    var date
    var createdDate
    var lengthCount = 0
    const [user, setUser] = useState("")
    const [bookingInfo, setBookingInfo] = useState("")
    const [allBookingInfo, setAllBookingInfo] = useState([])
    const [allPros, setAllPros] = useState([])
    const [applicants, setApplicants] = useState([])
    const [proInfo, setProInfo] = useState("")
    const [cusInfo, setCusInfo] = useState("")
    const [changePassword, setChangePassword] = useState()
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [showPayoutPopup, setShowPayoutPopup] = useState(false)
    const [selectedDeleteRow, setSelectedDeleteRow] = useState(null);
    const [selectedPayoutRow, setSelectedPayoutRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentBookingPage, setCurrentBookingPage] = useState(1);
    const [currentBookingCompPage, setCurrentBookingCompPage] = useState(1);
    const [allBookingPage, setAllBookingPage] = useState(1);
    const [currentProPage, setCurrentProPage] = useState(1);
    const [currentProCompPage, setCurrentProCompPage] = useState(1);
    const [currentApplicantsPage, setCurrentApplicantsPage] = useState(1);
    const [currentApplicantsCompPage, setCurrentApplicantsCompPage] = useState(1);
    const [rowsPerPge, SetPostsPerPage] = useState(5);
    


    // Pagination variable and methods for Bookings and Pros
    // BOOKING PAGINATION
    const indexOfLastBooking = currentBookingPage * rowsPerPge;
    const indexOfFirstBooking = indexOfLastBooking - rowsPerPge;
    const currentBookings = bookingInfo.slice(indexOfFirstBooking, indexOfLastBooking);
    // ADMIN BOOKING PAGINATION
    const indexOfLastAdminBooking = currentBookingPage * rowsPerPge;
    const indexOfFirstAdminBooking = indexOfLastAdminBooking - rowsPerPge;
    var currentAdminBookings
    if (bookingInfo.length) {
        currentAdminBookings = bookingInfo.filter((booking) => booking.isCompleted == false).slice(indexOfFirstAdminBooking, indexOfLastAdminBooking);
    }
    // COMPLETED BOOKINGS PAGINATION (2ND TAB)
    const indexOfLastBookingComp = currentBookingCompPage * rowsPerPge;
    const indexOfFirstBookingComp = indexOfLastBookingComp - rowsPerPge;
    const currentCompBookings = bookingInfo.slice(indexOfFirstBookingComp, indexOfLastBookingComp);
    // ALL BOOKINGS PAGINATION
    const indexOfLastAllBooking = allBookingPage * rowsPerPge;
    const indexOfFirstAllBooking = indexOfLastAllBooking - rowsPerPge;
    var allBooking = allBookingInfo.slice(indexOfFirstAllBooking, indexOfLastAllBooking)
    // ALL PRO BOOKINGS PAGINATION
    const indexOfLastAllProBooking = allBookingPage * rowsPerPge;
    const indexOfFirstAllProBooking = indexOfLastAllProBooking - rowsPerPge;
    var allProBooking
    if (proInfo.length) {
         allProBooking = proInfo.map((pro) => allBookingInfo.filter((booking) => pro.location === booking.aptState && booking.isAccepted === false ? true : ""))[0].slice(indexOfFirstAllProBooking, indexOfLastAllProBooking);
    }
    // PROS PAGINATION
    const indexOfLastPro = currentProPage * rowsPerPge;
    const indexOfFirstPro = indexOfLastPro - rowsPerPge;
    const currentPros = allPros.slice(indexOfFirstPro, indexOfLastPro);
    // COMPLETED PROS PAGINATION (2ND TAB)
    const indexOfLastProComp = currentProCompPage * rowsPerPge;
    const indexOfFirstProComp = indexOfLastProComp - rowsPerPge;
    const currentProsComp = allPros.slice(indexOfFirstProComp, indexOfLastProComp);
    // PRO APPLICANTS PAGINATION
    const indexOfLastApplicant = currentApplicantsPage * rowsPerPge;
    const indexOfFirstApplicant = indexOfLastApplicant - rowsPerPge;
    var currentApplicants
    if (applicants.length) {
        currentApplicants = applicants.filter((applicant) => applicant.isAccepted == false && applicant.isDeclined == false ).slice(indexOfFirstApplicant, indexOfLastApplicant);
    }
    const indexOfLastApplicantComp = currentApplicantsCompPage * rowsPerPge;
    const indexOfFirstApplicantComp = indexOfLastApplicantComp - rowsPerPge;
    var currentApplicantsComp
    if (applicants.length) {
        currentApplicantsComp = applicants.filter((applicant) => applicant.isAccepted == true && applicant.isDeclined == false ).slice(indexOfFirstApplicantComp, indexOfLastApplicantComp);
    }

    const handleBookingPagination = (pageNumber,type) => {
        // console.log(allBookingInfo.find((booking) => booking.isCompleted == true))
        // lengthCount = 0
        lengthCount = bookingInfo.filter((booking) => booking.isCompleted == false).slice(indexOfFirstBooking,indexOfLastBooking)
        const lengthTest = bookingInfo.filter((booking) => booking.isCompleted && booking.email == cusInfo.map((info)=> info.email))
        console.log("lengthCount:", lengthCount)
        console.log("lengthTest:", lengthTest)
        console.log("All BOOKINGS:", allProBooking)
        console.log("Pagination: pgNum =",pageNumber + " type",type)
        if(type == "bookings"){
            setCurrentBookingPage(pageNumber);
        }else if(type == "bookingsComp"){
            setCurrentBookingCompPage(pageNumber);
        }else if(type == "pros"){
            setCurrentProPage(pageNumber);
        }else if(type == "prosComp"){
            setCurrentProCompPage(pageNumber);
        }else if(type == "allBookings"){
            setAllBookingPage(pageNumber);
        }else if(type == "applicants"){
            setCurrentApplicantsPage(pageNumber);
        }else if(type == "applicantsComp"){
            setCurrentApplicantsCompPage(pageNumber);
        }
    }
    // const handlePagination = (pageNumber) => {
    //     setCurrentBookingPage(pageNumber);
    // }



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
        emailjs.init("ELhMlmYCSWK5Xb-Xg")
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0;
        console.log("scrolling")

        const fetchFunc = async () => {
            setLoading(true);
            try {
                getUser()
                getProInfo()
                getCusInfo()
                getBooking()
                getAllBooking()
                getAllPros()
                getApplicants()
                setLoading(false)
            } catch (error) {
                console.log(error);
            }
        }
        fetchFunc();

        

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
            changePassword = data.map((info) => (info.changePassword))
            console.log("Has password been changed", changePassword )

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

    const getApplicants = async() => {

        if (proInfo.length || cusInfo.length) {

            const {data, error} = await supabase
                .from('BeautyLynk_Applicants')
                .select('*')
            if(error){
                console.log(error)
            }
            if(data){
                // info.push(data)
                console.log("All Applicants information", data)
                setApplicants(data)
                // console.log("Applicant is accepted", data[0].isAccepted ? "Yurrr" : "nahh")


                // console.log(data.id)
            }
        }
    }

    const getBooking = async() => {
        var query
        var admin

        if (proInfo.length) {
            proInfo.map((pro) => {
                query = pro.id
            }) 

            const {data, error} = await supabase
                .from('BeautyLynk_Bookings')
                .select('*')
                .eq("assignedPro", `${query}`)
                .order('created_at', { ascending: true })
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
                admin = cus.isAdmin
            })

            if (admin){
                const {data, error} = await supabase
                .from('BeautyLynk_Bookings')
                .select('*')
                .order('isAccepted', { ascending: false })
                .order('created_at', { ascending: true })
                // .range(0, 6)
                if(error){
                    console.log(error)
                }
                if(data){
                    // info.push(data)
                    console.log("Booking information", data)
                    setBookingInfo(data)
                }
            }else {
                cusInfo.map((cus) => {
                    query = cus.email
                }) 
                
                const {data, error} = await supabase
                    .from('BeautyLynk_Bookings')
                    .select('*')
                    .eq("email", `${query}`)
                    .order('created_at', { ascending: false })
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
    }

    const stripeReminder = async(name, email) => {
        emailjs.send("gmail","template_95wje5k",{
            subject: "Important: Complete Your Stripe Setup to Receive Payments from BeautyLynk",
            name: `${name}`,
            message: `I hope this message finds you well. We've noticed that you haven't yet completed setting up your Stripe account, which is essential for receiving your payments through BeautyLynk. To ensure you can be paid quickly and securely for your services, we kindly ask that you finalize your Stripe account setup as soon as possible.`,
            email: email,
        });
        alert(`An email reminder has been sent to ${name} to set up StripeConnect`)
    }

    const openPopup = (row, type) => {

        if(type == "delete"){
            setSelectedDeleteRow(row);
            setShowDeletePopup(true)
        }else if(type == "payout"){
            if(row.assignedPro){
                setSelectedPayoutRow(row);
                setShowPayoutPopup(true)
            }else{
                console.log("This booking hasn't been accepted yet")
                alert("This booking hasn't been accepted yet")
            }
        }
    }

    const bookingPayout = async( amount, connect) => {
        var pro = allPros.find((pro) => pro.id == selectedPayoutRow.assignedPro ? pro :null)

        console.log("Selected OBJ: ", selectedPayoutRow)
        // console.log("Ass. Pro:", pro + " email: ",pro.email+ " stripeConnect: ",pro.stripeConnect)

        if(pro.stripeConnect){
            console.log("Payout booking info:",selectedPayoutRow)
            console.log("Payout amount:",amount + " StripeConnect:",pro.stripeConnect)

            const response = await axios.post("http://localhost:4000/payout", {
                amount: amount*100,
                stripeConnect: pro.stripeConnect,
            })
            console.log("Stripe 35 | data raw", response);
            console.log("Stripe 35 | data", response.data.success);
            if(response.data.success) {
                console.log("Successful refund!")
                // setSuccess(true)
                console.log("Payout data:",response.data.refund)
                if(selectedPayoutRow.id){
                    const { data, error } = await supabase
                        .from('BeautyLynk_Bookings')
                        .update({isCompleted: true})
                        .eq('id', selectedPayoutRow.id)
                    if(error){
                        console.log(error)
                    }
                    if(data){
                        console.log("Payout booking information", data)
                        if (allPros.map((pro) => pro.id == selectedPayoutRow.assignedPro)){
                            emailjs.send("gmail","template_95wje5k",{
                                subject: "Booking Payment",
                                name: allPros.map((pro) => pro.id == `${selectedPayoutRow.assignedPro}` ? pro.firstName : ""),
                                message: `A payment of ${selectedPayoutRow.payout} has been made by the Admin for a ${selectedPayoutRow.serviceType}
                                selectedPayoutRow in the ${selectedPayoutRow.service} style on ${dateFormat(selectedPayoutRow.date)} at ${timeFormat(selectedDeleteRow.time)}
                                 in ${selectedPayoutRow.location}, ${selectedPayoutRow.aptState}, ${selectedPayoutRow.aptCountry}`,
                                email: pro.email
                            });
                        }

                    }
                    window.location.reload();
                }
            }
        }else {
            console.log("StripeConnect is not connected")
            alert("StripeConnect is not connected")
        }

    }

    const cancelBooking = async( type, event) => {
        var pro = allPros.find((pro) => pro.id == selectedDeleteRow.assignedPro ? pro :null)
        console.log("Deleting booking: ", selectedDeleteRow.id, selectedDeleteRow.stripeIntent)
        console.log("Booking OBJ: ", selectedDeleteRow)
        console.log("Test", pro)

        emailjs.send("gmail","template_95wje5k",{
            subject: "Booking Cancellation",
            name: `${selectedDeleteRow.firstName}`,
            message: `The booking has been canceled by ${type == "client" ? "you" : type == "admin" ? "the admin" : "the pro"}`,
            email: selectedDeleteRow.email,
        });
        

        if(pro){
            emailjs.send("gmail","template_95wje5k", {
                subject: "Booking Cancellation",
                name:  `${pro.firstName }`,
                message: `The booking has been canceled by ${type == "pro" ? "you" : type == "admin" ? "the admin" : "the client"}`,
                email: `${pro.email}`,
            })
        }
        

        // if(selectedDeleteRow.stripeIntent && selectedDeleteRow.id){
        //     console.log("INTENT METHOD")
        //     const response = await axios.post("https://beautylynk-clone-server.vercel.app/refund", {
        //     // const response = await axios.post("http://localhost:4000/refund", {
        //         intent: selectedDeleteRow.stripeIntent
        //     })
        //     console.log("Stripe 35 | data raw", response);
        //     console.log("Stripe 35 | data", response.data.success);
        //     if(response.data.success) {
        //         console.log("Successful refund!")
        //         // setSuccess(true)
        //         console.log("Refund data:",response.data.refund)
        //         if(selectedDeleteRow.id){
        //             const { data, error } = await supabase
        //                 .from('BeautyLynk_Bookings')
        //                 .delete()
        //                 .eq('id', selectedDeleteRow.id)
        //             if(error){
        //                 console.log(error)
        //             }
        //             if(data){
        //                 console.log("Deleted booking information", data)

        //             }
        //             window.location.reload();
        //         }
        //     }
        // } else if(selectedDeleteRow.id) {
        //     console.log("SUPABASE METHOD")

        //     const { data, error } = await supabase
        //         .from('BeautyLynk_Bookings')
        //         .delete()
        //         .eq('id', selectedDeleteRow.id)
        //     if(error){
        //         console.log(error)
        //     }
        //     if(data){
        //         console.log("Deleted booking information", data)
        //     }
        //     window.location.reload();
        // }
    }

    const setStripeConnect = async() => {
        var acc
        if (proInfo) {
            proInfo.map((info) => acc = info.stripeConnect)
        }

        if(!acc) {
            // With upsert, if upload exist it updates it and if not it will insert a new row
            const {data, error} = await supabase
                .from('BeautyLynk_Pros_dup')
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
                                    <div className="dashboard-toolbar">
                                        {
                                            info.changePassword ? "" 
                                            : <div className="profile-edit_button">
                                                <a href={`/profile-edit?id=${proInfo.map((info) => (info.id))}`}>
                                                    <button>
                                                        {/* <img src="/public/stripe.webp" alt="" /> */}
                                                    </button>
                                                </a>
                                                <h4>Welcome! Please click here update your password </h4>

                                            </div>
                                        }
                                        {
                                            info.stripeConnect ? <div className="stripe-connect_button">
                                                <h4> Stripe Connect ID: {info.stripeConnect}</h4>
                                            </div> 
                                            : <div className="stripe-connect_button">
                                                <form action="https://beautylynk-clone-server.vercel.app/onboard-user" method="POST">
                                                    <button type="submit">
                                                        {/* <img src="/public/stripe.webp" alt="" /> */}
                                                    </button>
                                                </form>
                                                <h4>Set-up Stripe Connect! <br /> Get paid after every booking</h4>

                                            </div>
                                        }
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
                                                            <>
                                                                <table className="darkTable">
                                                                    <thead>
                                                                        <tr>
                                                                            <th><h4>Service</h4></th>
                                                                            {width > 1000 ? <th><h4>Customer Detail</h4></th> : ""}
                                                                            {width > 1000 ? <th><h4>Location</h4></th> : ""}
                                                                            <th><h4>Date/Time</h4></th>
                                                                            <th><h4>Service Status</h4></th>
                                                                            {width > 1000 ? <th><h4>Payout</h4></th> : ""}
                                                                            <th><h4>Customer Photo</h4></th>
                                                                            <th><h4>Actions</h4></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {currentBookings.map((booking) => (
                                                                            booking.isAccepted ? 
                                                                                <tr key={booking.id}>
                                                                                    <td className="dashboard-table_serviceType">
                                                                                        <a title="Click here to view more details" href={`/booking-details?id=${booking.id}`} to={`/booking-details?id=${booking.id}`}>
                                                                                            {booking.serviceType} {' service in the '} {booking.service} {"style"}
                                                                                        </a>
                                                                                    </td>
                                                                                    {width > 1000 ? <td>{booking.firstName} {booking.lastName}</td> : "" }
                                                                                    {width > 1000 ? <td>{booking.location}</td> : ""}
                                                                                    <td>{dateFormat(booking.date)} at {timeFormat(booking.time)}</td>
                                                                                    <td>
                                                                                        {
                                                                                            booking.isCompleted ? <p className="dashboard-table_status-pink">Completed</p>
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
                                                                                    <td className="dashboard-table_actions">
                                                                                            {
                                                                                                <div>
                                                                                                    {/* <img className="able-edit_btn" src="./icons/trash.png" alt="" srcset="" /> */}
                                                                                                    {/* <button className="table-edit_btn">X</button> */}
                                                                                                    <div >
                                                                                                        {/* <img className="table-delete_btn" src="./icons/trash.png" alt="" onClick={() => cancelBooking(booking.id, booking.stripeIntent, booking, "client")}/> */}
                                                                                                        {/* <img className="table-delete_btn" src="./icons/trash.png" alt="" onClick={() => { setShowDeletePopup(true) }}/> */}
                                                                                                        <img className="table-delete_btn" title="Click here to DELETE this booking" src="./icons/trash.png" alt="" onClick={() => openPopup(booking, "delete") }/>

                                                                                                        {/* <DeletePopup
                                                                                                            trigger={showDeletePopup} 
                                                                                                            setTrigger={setShowDeletePopup} 
                                                                                                            bookingID={booking.id}
                                                                                                            stripeIntent={booking.stripeIntent}
                                                                                                            booking={booking}
                                                                                                            type={"pro"}
                                                                                                            handleDeleteClick={cancelBooking}
                                                                                                        ></DeletePopup> */}
                                                                                                        <DeletePopup
                                                                                                            trigger={showDeletePopup} 
                                                                                                            setTrigger={setShowDeletePopup} 
                                                                                                            type={"pro"}
                                                                                                            handleDeleteClick={cancelBooking}
                                                                                                        ></DeletePopup>
                                                                                                    </div> 
                                                                                                </div>
                                                                                            }
                                                                                    </td>
                                                                                </tr>    
                                                                            : ""
                                                                        ))}
                                                                    </tbody>
                                                                </table> 
                                                                <Pagination  length={bookingInfo.filter((booking) => booking.isAccepted == true).length} currentPage={currentBookingPage} type="bookings" rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} />
                                                            </>
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
                                                             <>
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
                                                                                allProBooking.map((booking) => (
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
                                                                <Pagination  length={proInfo.map((pro) => allBookingInfo.filter((booking) => pro.location === booking.aptState && booking.isAccepted === false ? true : ""))[0].length} currentPage={allBookingPage} type="allBookings" rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} />
                                                             </>

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
                : cusInfo.length ?   
                    <div>
                        Customer Dashboard
                        <div className="welcome-block">
                            <div className="welcome-profile">
                                <a href={`/profile-edit?id=${cusInfo.map((info) => (info.id))}`}>
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

                    {
                        cusInfo.map((info) => info.isAdmin ? 
                            <div className="tab-row">
                                <div className="tab-row text-left">
                                    <h1>StripeConnect Status</h1>
                                    <h4 className="dashboard-header_sub" >Make sure your pros are ready! Manage the stripe connects here.</h4>
                                    <br />
                                    <Tab>
                                        <Tab.TabPane key={`Tab-3`} tab={"Pending StripeConnect"}>
                                            <div className="dashboard-table">
                                                {
                                                    allPros.length ?
                                                        <>
                                                            <table className="darkTable">
                                                                    <thead>
                                                                        <tr>
                                                                            <th><h4>First Name</h4></th>
                                                                            <th><h4>Last Name</h4></th>
                                                                            <th><h4>Email</h4></th>
                                                                            {width > 1000 ? <th><h4>Location</h4></th> : ""}
                                                                            <th><h4>StripeConnect</h4></th>
                                                                            <th><h4>Actions</h4></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {currentPros.map((pro) => (
                                                                            !pro.stripeConnect? 
                                                                                <tr key={pro.id}>
                                                                                    <td className="dashboard-table_serviceType">
                                                                                        <p>{pro.firstName}</p>
                                                                                    </td>
                                                                                    <td>{pro.lastName}</td>
                                                                                    <td>{pro.email}</td>
                                                                                    {width > 1000 ? <td>
                                                                                        <p>{pro.location}</p>
                                                                                    </td> : ""}
                                                                                    <td>
                                                                                        {pro.stripeConnect ? pro.stripeConnect : "Pending"}
                                                                                    </td>
                                                                                    <td className="dashboard-table_actions">
                                                                                        {
                                                                                            <div>
                                                                                                {/* <img className="able-edit_btn" src="./icons/trash.png" alt="" srcset="" /> */}
                                                                                                {/* <button className="table-edit_btn">X</button> */}
                                                                                                <div >
                                                                                                    <img className="table-delete_btn" src="./icons/remind.png" alt="" onClick={() => stripeReminder(pro.firstName, pro.email)}/>
                                                                                                </div>  
                                                                                            </div>
                                                                                        }
                                                                                    </td>
                                                                                </tr>    
                                                                            : ""
                                                                        ))}
                                                                    </tbody>
                                                                </table> 
                                                                <Pagination length={allPros.filter((pro) => pro.stripeConnect == false).length} rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} currentPage={currentProPage} type="pros"/>
                                                        </>
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
                                        <Tab.TabPane key={`Tab-4`} tab={"Linked StripeConnect"}>
                                            <div className="dashboard-table">
                                                {
                                                    allPros.length ?
                                                        <>
                                                            <table className="darkTable">
                                                                <thead>
                                                                    <tr>
                                                                        <th><h4>First Name</h4></th>
                                                                        <th><h4>Last Name</h4></th>
                                                                        <th><h4>Email</h4></th>
                                                                        {width > 1000 ? <th><h4>Location</h4></th> : ""}
                                                                        {width > 1000 ? <th><h4>StripeConnect</h4></th> : ""}
                                                                        {/* <th><h4>Actions</h4></th> */}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {currentProsComp.map((pro) => (
                                                                        pro.stripeConnect? 
                                                                            <tr key={pro.id}>
                                                                                <td className="dashboard-table_serviceType">
                                                                                    <p>{pro.firstName}</p>
                                                                                </td>
                                                                                <td>{pro.lastName}</td>
                                                                                <td>{pro.email}</td>
                                                                                {width > 1000 ? <td>
                                                                                    <p>{pro.location}</p>
                                                                                </td> : ""}
                                                                                {width > 1000 ?
                                                                                    <td>
                                                                                        {pro.stripeConnect ? pro.stripeConnect : "Pending"}
                                                                                    </td>
                                                                                :""}
                                                                            </tr>    
                                                                        : ""
                                                                    ))}
                                                                </tbody>
                                                            </table> 
                                                            <Pagination length={allPros.filter((pro) => pro.stripeConnect).length} rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} currentPage={currentProsComp} type="prosComp"/>
                                                        </>

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

                        :"")
                    }
                    <br />
                    {
                        cusInfo.map((info) => info.isAdmin ? 
                            <div className="tab-row">
                                <div className="tab-row text-left">
                                    <h1>BeautyLynk Pro Applicants</h1>
                                    <h4 className="dashboard-header_sub" > Review new pros and grow your network! Manage BeautyLynk pro applicants here.</h4>
                                    <br />
                                    <Tab>
                                        <Tab.TabPane key={`Tab-3`} tab={"Pending Applicants"}>
                                            <div className="dashboard-table">
                                                {
                                                    applicants.length ?
                                                        <>
                                                            <table className="darkTable">
                                                                    <thead>
                                                                        <tr>
                                                                            <th><h4>Name</h4></th>
                                                                            <th><h4>Email</h4></th>
                                                                            {width > 1000 ? <th><h4>Location</h4></th> : ""}
                                                                            <th><h4>Licensed</h4></th>
                                                                            <th><h4>Submission Date</h4></th>
                                                                            <th><h4>Available By</h4></th>
                                                                            <th><h4>Actions</h4></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {currentApplicants.map((applicant) => (
                                                                            !applicant.isAccepted && !applicant.isDeclined? 
                                                                                <tr key={applicant.id}>
                                                                                    <td className="dashboard-table_serviceType">
                                                                                        <p>{applicant.firstName} {applicant.lastName}</p>
                                                                                    </td>
                                                                                    <td>{applicant.email}</td>
                                                                                    {width > 1000 ? <td>
                                                                                        <p>{applicant.location}</p>
                                                                                    </td> : ""}
                                                                                    <td>
                                                                                        {applicant.isLicensed ? "Yes" : "No"}
                                                                                    </td>
                                                                                    <td>{dateFormat(applicant.created_at)}</td>
                                                                                    <td>{dateFormat(applicant.datesAvailable)}</td>
                                                                                    <td className="dashboard-booking_detail">
                                                                                        {
                                                                                            <div >
                                                                                                <a title="Click here to view more details or accept this applicant" href={`/pro-applicant?id=${applicant.id}`} to={`/pro-applicant?id=${applicant.id}`}>
                                                                                                    View Details
                                                                                                </a>
                                                                                            </div>  
                                                                                        }
                                                                                    </td>
                                                                                </tr>    
                                                                            : ""
                                                                        ))}
                                                                    </tbody>
                                                                </table> 
                                                                <Pagination length={applicants.filter((applicant) => applicant.isAccepted == false && applicant.isDeclined == false).length} rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} currentPage={currentApplicantsPage} type="applicants"/>
                                                        </>
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
                                        <Tab.TabPane key={`Tab-4`} tab={"Accepted Applicants"}>
                                            <div className="dashboard-table">
                                                {
                                                    applicants.length ?
                                                        <>
                                                            <table className="darkTable">
                                                                    <thead>
                                                                        <tr>
                                                                            <th><h4>Name</h4></th>
                                                                            <th><h4>Email</h4></th>
                                                                            {width > 1000 ? <th><h4>Location</h4></th> : ""}
                                                                            {width > 1000 ? <th><h4>Licensed</h4></th> : ""}
                                                                            {width > 1000 ? <th><h4>Submission Date</h4></th> : ""}
                                                                            <th><h4>Available By</h4></th>
                                                                            <th><h4>Actions</h4></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {currentApplicantsComp.map((applicant) => (
                                                                            applicant.isAccepted? 
                                                                                <tr key={applicant.id}>
                                                                                    <td className="dashboard-table_serviceType">
                                                                                        <p>{applicant.firstName} {applicant.lastName}</p>
                                                                                    </td>
                                                                                    <td>{applicant.email}</td>
                                                                                    {width > 1000 ? <td>
                                                                                        <p>{applicant.location}</p>
                                                                                    </td> : ""}
                                                                                    {width > 1000 ?
                                                                                        <td>
                                                                                            {applicant.isLicensed ? "Yes" : "No"}
                                                                                        </td>
                                                                                    :""}
                                                                                    {width > 1000 ? <td>{dateFormat(applicant.created_at)}</td> : ""}
                                                                                    <td>{dateFormat(applicant.datesAvailable)}</td>
                                                                                    <td className="dashboard-table_actions">
                                                                                        {
                                                                                            applicant.isAccepted ? <p className="dashboard-table_status-green">ACCEPTED</p>
                                                                                                : <p className="dashboard-table_status-grey">DECLINED</p>
                                                                                        }
                                                                                    </td>
                                                                                </tr>    
                                                                            : ""
                                                                        ))}
                                                                    </tbody>
                                                                </table> 
                                                                <Pagination length={applicants.filter((applicant) => applicant.isAccepted == true && applicant.isDeclined == false).length} rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} currentPage={currentApplicantsCompPage} type="applicantsComp"/>
                                                        </>

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

                        :"")
                    }
                    <br />
                        <>
                            <div className="tab-row">
                                <h1>{cusInfo.map((info) => info.isAdmin ? "Customer Booking History [ADMIN VIEW]" : "Customer Booking History")}</h1>
                                <h4 className="dashboard-header_sub" >Stay Organized, Stay Efficient! Manage your appointments here.</h4>
                                <br />
                                {cusInfo.map((info) => info.isAdmin ? 
                                    <>
                                        <div className="tab-row text-left">
                                            <Tab onClick={() => console.log("pending TEST")} >
                                                <Tab.TabPane key={`Tab-5`} tab={"Pending Appointments"} onClick={() => console.log("pending TEST")} >
                                                    <div className="dashboard-table">
                                                        {
                                                            bookingInfo.length ? 
                                                                <>
                                                                    <table className="darkTable" onLoad={() => handleBookingPagination(1,"pros")}>
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
                                                                            {
                                                                                currentAdminBookings.map((booking) => (
                                                                                    !booking.isCompleted? 
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
                                                                                                    booking.isAccepted ? <p className="dashboard-table_status-pink">Confirmed</p>
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
                                                                                                            {/* <img className="table-delete_btn" src="./icons/trash.png" alt="" onClick={() => cancelBooking(booking.id, booking.stripeIntent, booking, "client")}/> */}
                                                                                                            {/* <img className="table-delete_btn" title="Click here to DELETE this booking" src="./icons/trash.png" alt="" onClick={() => { setShowDeletePopup(true) }}/> */}
                                                                                                            <img className="table-delete_btn" title="Click here to DELETE this booking" src="./icons/trash.png" alt="" onClick={() => openPopup(booking, "delete") }/>
                                                                                                            <img className="table-payout_btn" title="Click here to PAYOUT this booking" src="./icons/payout.webp" alt="" onClick={() => openPopup(booking, "payout")}/>
                                                                                                            {/* <img className="table-payout_btn" title="Click here to PAYOUT this booking" src="./icons/payout.webp" alt="" onClick={() => bookingPayout(booking, booking.payout, allPros.map((pro) => (pro.id == booking.assignedPro ? pro.stripeConnect : "")))}/> */}
                                                                                                            {/* <button onClick={() => bookingPayout(booking, booking.payout, allPros.map((pro) => (pro.id == booking.assignedPro ? pro.stripeConnect : "")))}>
                                                                                                                Pay
                                                                                                            </button> */}
                                                                                                            <DeletePopup
                                                                                                                trigger={showDeletePopup} 
                                                                                                                setTrigger={setShowDeletePopup} 
                                                                                                                type={"admin"}
                                                                                                                handleDeleteClick={cancelBooking}
                                                                                                            ></DeletePopup>
                                                                                                            <PayoutPopup
                                                                                                                trigger={showPayoutPopup} 
                                                                                                                setTrigger={setShowPayoutPopup} 
                                                                                                                payout={selectedPayoutRow ? selectedPayoutRow.payout : ""}
                                                                                                                handlePayoutClick={bookingPayout}
                                                                                                            ></PayoutPopup>
                                                                                                        </div>  
                                                                                                    </div>
                                                                                                }
                                                                                            </td>
                                                                                        </tr>    
                                                                                    : ""
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                    <Pagination length={bookingInfo.filter((booking) => booking.isCompleted == false).length} rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} currentPage={currentBookingPage} type="bookings"/>

                                                                </> 
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
                                                <Tab.TabPane key={`Tab-6`} tab={"Completed Appointments"}>
                                                    <div className="dashboard-table">
                                                        {
                                                            bookingInfo.length && bookingInfo.find((booking) => booking.isCompleted == true) ?
                                                                <>
                                                                    <table className="darkTable" onLoad={() => handleBookingPagination(1,"booking")}>
                                                                        <thead>
                                                                            <tr>
                                                                                <th><h4>Service</h4></th>
                                                                                {width > 1000 ? <th><h4>Location</h4></th> :"" }
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
                                                                                
                                                                                currentCompBookings.map((booking) => (
                                                                                        booking.isCompleted ? 
                                                                                            <tr key={booking.id}>
                                                                                                <td className="dashboard-table_serviceType">{booking.serviceType} {' service in the '} {booking.service} {" style"}</td>
                                                                                                {width > 1000 ? <td>{booking.location}</td> : ""}
                                                                                                <td>{dateFormat(booking.date)} at {timeFormat(booking.time)}</td>
                                                                                                {width > 1000 ? <td>{dateFormat(booking.created_at)} "at" {dateTimeFormat(booking.created_at)}</td> : ""}
                                                                                                <td>
                                                                                                {
                                                                                                    booking.isCompleted ? <p className="dashboard-table_status-green">COMPLETED</p>
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
                                                                    <Pagination length={bookingInfo.filter((booking) => booking.isCompleted == true).length} rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} currentPage={currentCompBookings} type="bookingsComp"/>
                                                                </>
                                                                : <table className="darkTable" >
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
                                            
                                    </>
                                    : 
                                    <div className="tab-row text-left">
                                        <Tab>
                                            <Tab.TabPane key={`Tab-5`} tab={"Current Appointments"}>
                                                <div className="dashboard-table">
                                                    {
                                                        bookingInfo.length ? 
                                                            <>
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
                                                                        {currentBookings.map((booking) => (
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
                                                                                            booking.isAccepted ? <p className="dashboard-table_status-pink">Confirmed</p>
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
                                                                                                    {/* <img className="table-delete_btn" src="./icons/trash.png" alt="" onClick={() => cancelBooking(booking.id, booking.stripeIntent, booking, "client")}/> */}
                                                                                                    <img className="table-delete_btn" title="Click here to DELETE this booking" src="./icons/trash.png" alt="" onClick={() => openPopup(booking, "delete") }/>
                                                                                                    <DeletePopup
                                                                                                        trigger={showDeletePopup} 
                                                                                                        setTrigger={setShowDeletePopup}
                                                                                                        type={"client"}
                                                                                                        handleDeleteClick={cancelBooking}
                                                                                                    ></DeletePopup>
                                                                                                </div>  
                                                                                            </div>
                                                                                        }
                                                                                    </td>
                                                                                </tr>    
                                                                            : ""
                                                                        ))}
                                                                    </tbody>
                                                                </table> 
                                                                <Pagination length={bookingInfo.filter((booking) => !booking.isCompleted && booking.email == cusInfo.map((info)=> info.email)).length} rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} currentPage={currentBookingPage} type="bookings"/>
                                                            </>

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
                                            <Tab.TabPane key={`Tab-6`} tab={"Past Appointments"}>
                                                <div className="dashboard-table">
                                                    {
                                                        bookingInfo.length ?
                                                            <>
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
                                                                            
                                                                            currentCompBookings.map((booking) => (
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
                                                                <Pagination length={bookingInfo.filter((booking) => booking.isCompleted && booking.email).length} rowsPerPage={rowsPerPge} handlePagination={handleBookingPagination} currentPage={currentCompBookings} type="bookingsComp"/>
                                                            </>
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
                                )}
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