import React from 'react'
import "./HowItWorks.css"

function HowItWorks() {
    return (
        <div className="how_section">
            <div className="how_wrap">
                <header className="how_header">
                    <h1>How it Works</h1>
                    <h3>And by it, we mean BeautyLynk</h3>
                </header>
                <div className="how-body">
                    <div className="how-element">
                        <h3><span>1 </span> LOCATION</h3>
                        <h5>Choose the services you want at your home, office, or hotel.</h5>
                    </div>
                    <div className="how-element">
                        <h3><span>2 </span> SERVICE</h3>
                        <h5>Book the services for the date and time you want.</h5>
                    </div>
                    <div className="how-element">
                        <h3><span>3 </span> LYNK</h3>
                        <h5>We'll lynk you with one of our vetted Beauty Professionals.</h5>
                    </div>
                    <div className="how-element">
                    <h3><span>4 </span> ENJOY</h3>
                        <h5>Knock, knock! Who's there? Our Beauty Professional, getting ready to get YOU ready.</h5>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default HowItWorks
