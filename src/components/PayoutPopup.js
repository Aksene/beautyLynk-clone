import React from 'react'
import './DeletePopup.css'


function PayoutPopup(props) {
    
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}> X</button>
                <div className="prompt-container">
                    <h1> Are you sure you want to PAYOUT ${`${props.payout}`} for this booking? </h1>
                    <div className="button-container">
                        <a className="cancel-btn" onClick={() => props.setTrigger(false)}> 
                            Cancel 
                        </a>
                        <a className="delete-btn" type="button" onClick={() => props.handlePayoutClick( props.payout)}> 
                            Payout 
                        </a>
                    </div>      
                </div>
            </div>
        </div>
    ) : "";
}



export default PayoutPopup
