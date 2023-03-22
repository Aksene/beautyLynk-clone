import React, { useState} from 'react'
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './PageCarousel.css'
 


function PageCarousel() {

    return (
        <div className="carousel-container">
            {/* <div className="carousel-inner">
                <div className="carousel-item">
                    <h1>"My stylist did an amazing job - she puts the "artist" in makeup artist"</h1>
                </div>
                <div className="carousel-item">
                    <h1>"This undeniably beats waiting in a packed salon on Saturday mornings"</h1>
                </div>
                <div className="carousel-item">
                    <h1>"I LOVE BeautyLynk - How convenient!"</h1>
                </div>
                <div className="carousel-item">
                    <h1>"Beautylynk is amazing, great staff, great end results, on time and always show up in style"</h1>
                </div>
                <a href="http://">
                    <button>Book Now</button>
                </a>
            </div> */}

            <Carousel 
                className="carousel-wrap" 
                showArrows={false} 
                autoPlay={true} 
                infiniteLoop={true}
                showIndicators={false}
                showStatus={false}
                stopOnHover={false}
                showThumbs={false}
            >
                <div className="carousel-slide">
                    <h1>"My stylist did an amazing job - she puts the "artist" in makeup artist"</h1>
                </div>
                <div className="carousel-slide">
                    <h1>"This undeniably beats waiting in a packed salon on Saturday mornings"</h1>
                </div>
                <div className="carousel-slide">
                    <h1>"I LOVE BeautyLynk - How convenient!"</h1>
                </div>
                <div className="carousel-slide">
                    <h1>"Beautylynk is amazing, great staff, great end results, on time and always show up in style"</h1>
                </div>
            </Carousel>
            <Link to="/book-now" state={{homeInfo: ""}} className="carousel-button">
                Book Now
            </Link>
        </div>
    )
}

export default PageCarousel
