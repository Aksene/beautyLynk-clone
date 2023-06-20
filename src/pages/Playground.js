import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import './Playground.css'
import axios from 'axios'

function Playground() {
    // const [textMessage, setTextMessage] = useState('')
    // const [recipient, setRecipient] = useState('')
    const [text, setText] = useState({
        textmessage: '',
        recipient: ''
    })

    const spacer = {
        margin: 8
    }
    const textArea = {
        borderRadius: 4
    }

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

        console.log("Field Value " + fieldValue)
        console.log("Field Name " + fieldName)

        const newFormData = { ...text};
        newFormData[fieldName] = fieldValue
        
        console.log("New form data: ", newFormData)
        setText(newFormData)
    }

    const sendText = (e) => {
        e.preventDefault()
        
        const { textmessage, recipient } = text
        console.log(textmessage, recipient)

        // pass variables within query string
        fetch(`http://localhost:4000/send-text?recipient=${text.recipient}&textmessage=${text.textmessage}`)
        .catch(err => console.error(err))

        // try {
        //     const response = await axios.get("http://localhost:4000/send-text", {
        //         textMessage: textmessage,
        //         recipient: recipient,
        //     })
        //     console.log("Response:",response)
        //     // if(response.data.success) {
        //     //     console.log("Successful payment!")
        //     //     setSuccess(true)
        //     //     handleBookingInfoFormSubmit(e)
        //     // }
        // }
        // catch (error) {
        //     console.log("Error:", error)
        // }
    }

    const handleAcc = (e) => {
        e.preventDefault()
        const test = e.target.className
        console.log(e)
        console.log(test)
        let tempTest = test.replace(' ',`.`)
        console.log(tempTest)



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
                <div className="accordion">
                        <button class="accordion">Section 1</button>
                        <div class="panel">
                        
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>

                        <button onClick={handleAcc} class="accordion">Section 2</button>
                        <div class="panel">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>

                        <button onClick={handleAcc} class="accordion">Section 3</button>
                        <div class="panel">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                </div>
                {/* <div className="accordion">

                </div> */}
            {/* <div style={{ marginTop: 10 }} >
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
