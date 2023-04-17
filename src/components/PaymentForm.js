import React, {useState, useEffect} from 'react'
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


export default function PaymentForm( {handleBookingInfoFormSubmit, bookingInfo}) {
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
        description: bookingInfo.service
    })
    const [success, setSuccess] = useState(false)
    const [showAddress, setShowAddress] = useState(true)
    const stripe = useStripe()
    const elements = useElements()
    const [stripeRes, setStripeRes] = useState({})

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
                    amount: bookingInfo.totalPrice*100,
                    id: id,
                    description: `${paymentInfo.description} for ${paymentInfo.fname} ${paymentInfo.lname}`,
                    email: paymentInfo.email
                })

                console.log("Stripe 35 | data", response.data.success);
                if(response.data.success) {
                    console.log("Successful payment!")
                    setSuccess(true)
                    handleBookingInfoFormSubmit(e)
                }
            } catch (error) {
                console.log("Error", error)
            }
        } else {
            console.log(error.message)
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
                <div>
                   <h2> Thank you for booking with BeautyLynk :)</h2> 
                </div>
            }
            
        </>
    )
}