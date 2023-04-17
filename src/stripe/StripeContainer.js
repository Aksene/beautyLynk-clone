import React from 'react'
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
// import PaymentForm from "./PaymentForm"

const PUBLIC_KEY = "pk_test_51MoCtmEVU6ZnQpdRdHaK75tHjASejdCH7Gy3WHNeoLZBgK7fcfxqxAgqTAhpqNzwo6PjrqtOsqM85tv4RHBJkhYP00KMP9pjog"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export default function StripeContainer() {
    return (
        <Elements stripe={stripeTestPromise}>
            {/* <PaymentForm/> */}
        </Elements>
    )
}
