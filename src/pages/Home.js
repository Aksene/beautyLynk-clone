import React, {useEffect} from 'react'
import "./Home.css"
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Layout from '../components/Layout'
import JumboHero from '../components/JumboHero'
import Carousel from '../components/PageCarousel'
import InstagramBox from '../components/InstagramBox'
import BlogHero from '../components/BlogHero'


function Home() {
    useEffect(() => {
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0;
        console.log("scrolling up")
    }, [])
    return (
       <Layout>
            <div className="home_wrap">
                {/* Just testing */}
                {/* <Hero/> */}
                <JumboHero/>
                <HowItWorks/>
                <Carousel/>
                <InstagramBox/>
                <BlogHero/>
            </div>
       </Layout>
    )
}

export default Home
