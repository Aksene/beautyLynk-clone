import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Tab from '../components/Tab'
import './Playground.css'
import axios from 'axios'

import JumboHero from '../components/JumboHero'
import HowItWorks from '../components/HowItWorks'
import Carousel from '../components/PageCarousel'
import InstagramBox from '../components/InstagramBox'
import BlogHero from '../components/BlogHero'

import Calendar from 'react-calendar';




function Playground() {
    // const [textMessage, setTextMessage] = useState('')
    // const [recipient, setRecipient] = useState('')
    const [text, setText] = useState({
        textmessage: '',
        recipient: ''
    })
    const [success, setSuccess] = useState(false)

    const tabContent = [
        {
          title: "Chennai",
          content: `Chennai is the capital of the Indian state of Tamil Nadu.
                    Located on the Coromandel Coast of the Bay of Bengal, it is one
                    of the largest cultural, economic and educational centres of
                    south India. According to the 2011 Indian census, it is the
                    sixth-most populous city and fourth-most populous urban
                    agglomeration in India. The city together with the adjoining
                    regions constitutes the Chennai Metropolitan Area, which is the
                    36th-largest urban area by population in the world.`,
        },
        {
          title: "Abu Dhabi",
          content: `Abu Dhabi is the capital and the second-most populous city of
                    the United Arab Emirates (after Dubai). The city of Abu Dhabi is
                    located on an island in the Persian Gulf, off the Central West
                    Coast. Most of the city and the Emirate reside on the mainland
                    connected to the rest of the country. As of 2020, Abu Dhabi's
                    urban area had an estimated population of 1.48 million,[6] out
                    of 2.9 million in the emirate of Abu Dhabi, as of 2016.`,
        },
        {
          title: "New York",
          content: `New York City (NYC), often called simply New York, is the most
                    populous city in the United States. With an estimated 2019
                    population of 8,336,817 distributed over about 302.6 square
                    miles (784 km2), New York City is also the most densely
                    populated major city in the United States.[11] Located at the
                    southern tip of the U.S. state of New York, the city is the
                    center of the New York metropolitan area, the largest
                    metropolitan area in the world by urban landmass.`,
        },
      ];

    const spacer = {
        margin: 8
    }
    const textArea = {
        borderRadius: 4
    }
    
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        // sendText()
        let acc = document.getElementsByClassName("accordion");
        for (var i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("active");
                let panel = this.nextElementSibling;
                if (panel !== null) {
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
                }
                return false;
            });
        }
    }, [])

    const handleInputChange = (e) => {
        const fieldName = e.target.getAttribute("name")
        const fieldValue = e.target.value;

        // console.log("Field Value " + fieldValue)
        // console.log("Field Name " + fieldName)

        const newFormData = { ...text};
        newFormData[fieldName] = fieldValue
        
        // console.log("New form data: ", newFormData)
        setText(newFormData)
    }

    const sendText = async (e) => {
        e.preventDefault()
        
        const { textmessage, recipient } = text
        console.log(textmessage, recipient)

        // pass variables within query string
        try {
            const response = await axios.post("http://localhost:4000/send-text?", {
                    recipient: text.recipient,
                    textMessage: text.textmessage,

            })

            console.log("Twilio | data", response.data.success);
            if(response.data.success) {
                console.log("Message Sent!")
                setSuccess(true)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const handleAcc = (e) => {
        e.preventDefault()
        const test = e.target.className
        // console.log(e)
        // console.log(test)
        let tempTest = test.replace(' ',`.`)
        // console.log(tempTest)



        // let acc = document.getElementsByClassName("accordion");
        // for (var i = 0; i < acc.length; i++) {
        //     acc[i].addEventListener("click", function() {
        //         this.classList.toggle("active");
        //         let panel = this.nextElementSibling;
        //         if (panel !== null) {
        //         if (panel.style.display === "block") {
        //             panel.style.display = "none";
        //         } else {
        //             panel.style.display = "block";
        //         }
        //         }
        //         return false;
        //     });
        // }


         
        // for (i = 1; i < acc.length; i++) {
        //     acc[i].addEventListener("click", function() {
        //       this.classList.toggle("active");
        //       var panel = this.nextElementSibling;
        //       console.log(panel)

        //       if (panel.style.display === "block") {
        //         panel.style.display = "none";
        //       } else {
        //         panel.style.display = "block";

        //       }
        //     });
        // }
    }

    const toggle = (i) => {
    }

    return (
        <Layout>
            <div>
                <JumboHero/>
                <HowItWorks/>
                <Carousel/>
                <InstagramBox/>
                {/* <div>
                    <Calendar onChange={(date) => setDate(date)} value={date} onClickDay={console.log("Selected Date ",date)}></Calendar>
                </div>

                <>
                    <div className="row">
                        <div className="col text-center">
                        <h2>Tab Component</h2>
                        <p>Building Tab component</p>
                        <div className="row text-left">
                            <Tab>
                            {tabContent.map((tab, idx) => (
                                <Tab.TabPane key={`Tab-${idx}`} tab={tab.title}>
                                {tab.content}
                                </Tab.TabPane>
                            ))}
                            </Tab>
                        </div>
                        </div>
                    </div>
                </>

                <div style={{ marginTop: 10 }} >
                    <h2> Send Text Message </h2>
                    <label> Your Phone Number </label>
                    <br />
                    <input 
                        value={text.recipient}
                        name="recipient"
                        onChange={e => handleInputChange(e)}  />
                    <div style={spacer} />
                    <label> Message </label>
                    <br />
                    <textarea 
                        rows={3} 
                        value={text.textmessage} 
                        style={textArea}
                        name="textmessage"
                        onChange={e => handleInputChange(e)} />
                    <div style={spacer} />
                    <button onClick={sendText}> Send Text </button>
                </div> */}
            </div>
        </Layout>
    )
}

export default Playground
