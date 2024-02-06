import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from "axios"
import "./PaymentForm.css"

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#b8336c",
			color: "#black",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			// "::placeholder": { color: "#87bbfd" }
			"::placeholder": { color: "#black" }
		},
		invalid: {
			iconColor: "#e02777",
			color: "#e02777"
		}
	}
}



export default function PaymentForm( {setBookingInfo, bookingInfo, formatAMPM}) {
    const [paymentInfo, setPaymentInfo] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        street1: bookingInfo.aptAddress1,
        street2: bookingInfo.aptAddress2,
        city: bookingInfo.aptCity,
        state: bookingInfo.aptState,
        country: bookingInfo.aptCountry,
        postal_code: bookingInfo.aptZip,
        price: bookingInfo.servicePrice*100,
        description: bookingInfo.service,
        paymentIntent: "",
    })
    const [success, setSuccess] = useState(false)
    const [showAddress, setShowAddress] = useState(true)
    const stripe = useStripe()
    const elements = useElements()
    const [stripeRes, setStripeRes] = useState({})
    var paymentIntent

    useEffect(() => {
        console.log("Passed Booking info: ", bookingInfo)
        console.log("Payment info: ", paymentInfo)
        scrollToTarget();
        // console.log("Passed Booking info: ", bookingInfo)
    }, [])

    const handleInputChange = (e) => {
        const fieldName = e.target.getAttribute("name")
        const fieldValue = e.target.value;

        console.log("Field Value " + fieldValue)
        console.log("Field Name " + fieldName)

        const newFormData = { ...paymentInfo};
        newFormData[fieldName] = fieldValue
        
        console.log("New form data: ", newFormData)
        setPaymentInfo(newFormData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const {paymentMethod, error} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
            billing_details: {
                name: `${paymentInfo.fname} ${paymentInfo.lname}`,
                email: paymentInfo.email,
                phone: paymentInfo.phone,
                address: {
                    line1: paymentInfo.street1,
                    line2: paymentInfo.street2,
                    city: paymentInfo.city,
                    state: paymentInfo.state,
                    country: paymentInfo.country,
                    postal_code: paymentInfo.postal_code
                }
            }
        })
        if(!error) {
            console.log("Stripe 23 | token generated!", paymentMethod);
            try {
                const {id} = paymentMethod 
                const response = await axios.post("https://beautylynk-clone-server.vercel.app/payment", {
                // const response = await axios.post("http://localhost:4000/payment", {
                    amount: bookingInfo.totalPrice*100,
                    id: id,
                    description: `${paymentInfo.description} for ${paymentInfo.fname} ${paymentInfo.lname}`,
                    email: paymentInfo.email
                })
                console.log("Stripe 35 | data raw", response);
                console.log("Stripe 35 | data", response.data.success);
                if(response.data.success) {
                    console.log("Successful payment!")
                    setSuccess(true)
                    console.log("Payment Intent ID:",response.data.payment.id)
                    paymentIntent = response.data.payment.id
                    paymentInfo["paymentIntent"] = response.data.payment.id
                    handleBookingInfoFormSubmit(e)

                }
            } catch (error) {
                console.log("Error", error)
            }
        } else {
            console.log(error.message)
        }

        console.log("Payment Intent OBJ:",paymentIntent)

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
        const newPayment = { ...paymentInfo}

        console.log("Booking to be sent to supabase",newBooking)
        console.log("Payment to be sent to supabase",newPayment)

        if(newBooking) {
            // With upsert, if upload exist it updates it and if not it will insert a new row
            const {data, error} = await supabase.from("BeautyLynk_Bookings").insert({
                location: newBooking.location,
                service: newBooking.service,
                serviceType: newBooking.serviceType,
                serviceDesc: `You have booked a ${bookingInfo.serviceType} service in the ${bookingInfo.service} style. This appointment will take place on ${bookingInfo.date} at ${formatAMPM(bookingInfo.time)} in ${bookingInfo.location}, ${bookingInfo.aptState}, ${bookingInfo.aptCountry} for $${bookingInfo.totalPrice}`,
                date: newBooking.date,
                time: newBooking.time,
                timezone: newBooking.timezone,
                firstName: newPayment.fname,
                lastName: newPayment.lname,
                email: newPayment.email,
                phoneNum: newPayment.phone,
                aptAddress1: newBooking.aptAddress1,
                aptAddress2: newBooking.aptAddress2,
                aptCity: newBooking.aptCity,
                aptState: newBooking.aptState,
                aptCountry: newBooking.aptCountry,
                aptZip: newBooking.aptZip,
                totalPrice: newBooking.totalPrice,
                payout: newBooking.payout,
                service_detail: newBooking.hairServiceDetail,
                hairExt: newBooking.hairExt === "" ? false : newBooking.hairExt,
                hairExtType: newBooking.hairExtType,
                hairClass: newBooking.hairClass,
                hairType: newBooking.hairType,
                hairLoss: newBooking.hairLoss === "" ? false : newBooking.hairLoss,
                hairLossDiag: newBooking.hairLossDiag === "" ? false : newBooking.hairLossDiag,
                hairLossCause: newBooking.hairLossCause,
                curlPattern: newBooking.curlPattern,
                hairDensity: newBooking.hairDensity,
                hairDry: newBooking.hairDry === "" ? false : newBooking.hairDry,
                locTime: newBooking.locTime,
                locColor: newBooking.locColor === "" ? false : newBooking.locColor,
                childSupervision: newBooking.childSupervision === "" ? false : newBooking.childSupervision,
                braidsSize: newBooking.braidsSize,
                braidsLength: newBooking.braidsLength,
                cornrowsCount: newBooking.cornrowsCount,
                upchargeCornrowsCount: newBooking.upchargeCornrowsCount,
                upchargeBraidsLength: newBooking.upchargeBraidsLength,
                upchargeBraidsSize: newBooking.upchargeBraidsSize,
                cornrowsStyle: newBooking.cornrowsStyle,
                wigPurchased: newBooking.wigPurchased === "" ? false : newBooking.wigPurchased,
                wigPurchaseAsst: newBooking.wigPurchaseAsst === "" ? false : newBooking.wigPurchaseAsst,
                wigHairType: newBooking.wigHairType,
                wigInstallType: newBooking.wigInstallType,
                wigPrice: newBooking.wigPrice,
                upchargeWigStyle: newBooking.upchargeWigStyle,
                customWigSizeCheck: newBooking.customWigSizeCheck === "" ? false : newBooking.customWigSizeCheck,
                customWigSize: newBooking.customWigSize,
                customWigSizeCirc: newBooking.customWigSizeCirc,
                customWigSizeNape: newBooking.customWigSizeNape,
                customWigSizeForehead: newBooking.customWigSizeForehead,
                customWigSizeOverlap: newBooking.customWigSizeOverlap,
                customWigSizeTempleBack: newBooking.customWigSizeTempleBack,
                customWigSizeNeck: newBooking.customWigSizeNeck,
                customWigColor: newBooking.customWigColor,
                customWigInstallType: newBooking.customWigInstallType,
                customWigHairType: newBooking.customWigHairType,
                customWigStyle: newBooking.customWigStyle,
                customWigDensity: newBooking.customWigDensity,
                customWigTexture: newBooking.customWigTexture,
                customWigHeadMeasurement: newBooking.customWigHeadMeasurement,
                customWigReason: newBooking.customWigReason,
                upchargeCustomWigDensity: newBooking.upchargeCustomWigDensity === "" ? false : newBooking.upchargeCustomWigDensity,
                skinType: newBooking.skinType,
                skinComplexion: newBooking.skinComplexion,
                allergies: newBooking.allergies === "" ? false : newBooking.allergies,
                skinConditions: newBooking.skinConditions === "" ? false : newBooking.skinConditions,
                makeupLook: newBooking.makeupLook,
                makeupLashes: newBooking.makeupLashes,
                hennaSize: newBooking.hennaSize,
                upchargeHennaSize: newBooking.upchargeHennaSize,
                hennaDesign: newBooking.hennaDesign === "" ? false : newBooking.hennaDesign,
                hennaLength: newBooking.hennaLength,
                hennaColor: newBooking.hennaColor,
                nailDesc: newBooking.nailDesc,
                nailShape: newBooking.nailShape,
                nailPolish: newBooking.nailPolish,
                nailPolishOther: newBooking.nailPolishOther,
                pet: newBooking.pet,
                petType: newBooking.petType,
                specialAcc: newBooking.specialAcc,
                specialAccType: newBooking.specialAccType,
                upchargeParking: newBooking.upchargeParking,
                upchargeScalp: newBooking.upchargeScalp === "" ? 0 : parseInt(bookingInfo.upchargeScalp),
                upchargeStairs: newBooking.upchargeStairs,
                upchargeQuietServ: newBooking.upchargeQuietServ,
                smokeFree: newBooking.smokeFree,
                stripeIntent: paymentInfo.paymentIntent,
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

    

    const uploadPaymentInfo = async(e) => {
        // Upload payment information to Supabase 


    }

    const handleRadio = (check) => {
        setShowAddress(check)

        if (check === true) {
            console.log("Truuuuuuu")
            const newFormData = {
                fname: paymentInfo.fname,
                lname: paymentInfo.lname,
                email: paymentInfo.email,
                phone: paymentInfo.phone,
                street1: bookingInfo.aptAddress1,
                street2: bookingInfo.aptAddress2,
                city: bookingInfo.aptCity,
                state: bookingInfo.aptState,
                country: bookingInfo.aptCountry,
                postal_code: bookingInfo.aptZip,
                description: bookingInfo.service
            };

            console.log("New payment form data: ", newFormData)

            setPaymentInfo(newFormData)


        } else if (check === false) {
            console.log("Caaaaaaaap")
            const newFormData = {
                fname: paymentInfo.fname,
                lname: paymentInfo.lname,
                email: paymentInfo.email,
                phone: paymentInfo.phone,
                street1: "",
                street2: "",
                city: "",
                state: "",
                country: "",
                postal_code: "",
                description: "BeautyLynk Test"
            };
            console.log("Reset payment form data: ", newFormData)

            setPaymentInfo(newFormData)
        }
        // console.log(showAddress)
    }

    const scrollToTarget = () => {
        // location.href = "#stripeContainer"
        document.getElementById("firstEl").scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    }
    
    return (
        <>
            {
                !success ? 
                    <div className="payment-container">
                        <br id="firstEl" />
                        <div className="FormGroup-container">
                            <div className="cardAddress-info">
                                <label htmlFor="">Is the address above the same as the billing address? </label>
                            </div>
                            <fieldset className="cardAddress-ans">
                                <legend className="cardAddress-legend">Yes or No:</legend>
                                <div>
                                    <input type="radio" value="Yes" name="showAddress" checked={showAddress} onChange={() => handleRadio(true)}/> <strong>Yes</strong>
                                    <input type="radio" value="No" name="showAddress" onChange={() => handleRadio(false)} /> <strong>No</strong>
                                    {console.log(showAddress)}
                                </div>
                            </fieldset>
                            <div  className="FormGroup-info">
                                <label  htmlFor="">Please confirm your appointment: </label>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <fieldset className="FormGroup">
                                    <div  className="name-fields">
                                        <label for="fname">First name:</label>
                                        <input type="text" id="fname" name="fname" placeholder="First Name" required onChange={e => handleInputChange(e)}/>
                                        <label for="lname">Last name:</label>
                                        <input type="text" id="lname" name="lname" placeholder="Last Name" required onChange={e => handleInputChange(e)}/>
                                        <label for="email">Email:</label>
                                        <input type="text" id="email" name="email" placeholder="Email" required onChange={e => handleInputChange(e)}/>
                                        <label for="phone">Phone:</label>
                                        <input type="tel" name="phone" id="phone" placeholder="781-XXX-XXXX"  required onChange={e => handleInputChange(e)} />
                                    </div>
                                    <div className="FormRow">
                                        <label for="card">Card information:</label>
                                        <CardElement options={CARD_OPTIONS}/>
                                    </div>
                                    {showAddress ? 
                                        "" :
                                        <div className="address-fields">
                                            <label for="country">Country:</label>
                                            <select name="country" id="country" required onChange={e => handleInputChange(e)}>
                                                <option value="" defaultValue>Select a Country</option>
                                                <option value="US">United States</option>
                                            </select>
                                            <label for="street1">Address 1:</label>
                                            <input type="text" id="street1" name="street1" placeholder="3 Cerulean Drive" required onChange={e => handleInputChange(e)}/>
                                            <label for="street2">Address 2:</label>
                                            <input type="text" id="street2" name="street2" placeholder="Apt 2" required onChange={e => handleInputChange(e)}/>
                                            <label for="city">City:</label>
                                            <input type="text" id="city" name="city" placeholder="Boston" required onChange={e => handleInputChange(e)}/>
                                            <label for="state">State:</label>
                                            <select name="state" id="state" required onChange={e => handleInputChange(e)}>
                                                <option value="" defaultValue>Select a State</option>
                                                <option value="Massachusetts">Massachusetts</option>
                                            </select>
                                            <label for="postal_code" >Zip:</label>
                                            <input type="text" id="postal_code" name="postal_code" placeholder="02201" required onChange={e => handleInputChange(e)}/>
                                        </div>
                                    }

                                </fieldset>
                            <div className="FormGroup-confirmBtn-container">
                                <button className="FormGroup-confirmBtn">PAY</button>
                            </div>
                            </form>
                        </div>
                    </div>
                : 
                <div className="FormGroup-confirmMessage">
                   <span>
                        You have booked a <strong>{bookingInfo.serviceType} service </strong>
                        in the <strong>{bookingInfo.service} </strong> 
                        style. This appointment will take place on <strong>{bookingInfo.date} </strong> 
                        at <strong>{formatAMPM(bookingInfo.time)} </strong> 
                        in <strong>{bookingInfo.location}, {bookingInfo.aptState}, {bookingInfo.aptCountry} </strong> 
                        for <strong>${bookingInfo.totalPrice}</strong>
                    </span>
                    <h2> Thank you for booking with BeautyLynk, we will be in contact soon :)</h2> 
                </div>
            }
            
        </>
    )
}