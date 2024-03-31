import React from 'react'
import './ContactUs.css'
// import logo from './images/[FINAL]ORF-Backwoods_MINI.png'
import Layout from '../components/Layout'




function ContactUs() {
    return (
        <Layout>
            <div>
                <img className="contactMe_wall" src={'/images/walls/purple.jpg'} alt="" srcset="" />
                <text className="contactMe__Title"> Let's Talk!</text>
                <br /><br />
                <div class="contactMe_row">
                    <div class="column1">
                        <form className="container1" action="https://submit-form.com/XOxuMUP6">
                            <label for="name">Name: </label>
                            <input type="text" id="name" name="name" placeholder="Name" required="required" />
                            <label for="number">Number: </label>
                            <input type="text" id="number" name="number" placeholder="Phone Number" required="required" />
                            <label for="email">E-mail: </label>                
                            <input type="email" id="email" name="email" placeholder="Email" required="required" />
                            <label for="message">Message: </label>
                            <textarea
                            id="message"
                            name="message"
                            placeholder="Type your message here"
                            required="required"
                            ></textarea>
                            <div className="contactMe-submit_container">
                                <button type="submit" className="contactMe__submit-button">
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="column2">
                        <div className="container2">
                            <div>
                                <label for="number">Name: </label>
                                <text for="number">BeautyLynk</text>
                           </div>
                           <div>
                                <label for="number">Number: </label>
                                <text for="number">###-###-####</text>
                           </div>
                           <div>
                                <label for="email">E-mail: </label>   
                                <text for="email">hello@beautylynk.com</text>
                           </div>
                            <br />
                            <div className="contactMe-logo_container">
                                <img src={'/images/logo--white.svg'} className="contactMe-logo" alt="Abdous-world" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <br />
        </Layout>
    )
}

export default ContactUs
