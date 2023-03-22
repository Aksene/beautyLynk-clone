import React from 'react'
import "./Hero.css"

function Hero() {
    return (
        <div className="hero-wrap">
            <figure>
                <img className="heroImage" src="/images/hero/jeanna.jpg" alt="BeautyLynk hero image"/>
                <figcaption>
                    We work around your schedule to provide beauty on-demand
                    <br />
                    <br />
                    <a href="/book-now">
                        Book Now
                    </a>
                </figcaption>
            </figure>
        </div>
    )
}

export default Hero