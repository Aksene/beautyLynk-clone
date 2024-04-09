import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import axios from "axios"
import Pagination from '../components/Pagination';

import './AboutUs.css'


function AboutUs() {
    const [allArticles, setAllArticles] = useState([])
    const [currentArticlesPage, setCurrentArticlesPage] = useState(1);
    const [rowsPerPge, SetPostsPerPage] = useState(4);

    // Article PAGINATION
    const indexOfLastArticle = currentArticlesPage * rowsPerPge;
    const indexOfFirstArticle = indexOfLastArticle - rowsPerPge;
    const currentArticles = allArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const handleArticlePagination = (pageNumber, type) => {
        // console.log(allBookingInfo.find((booking) => booking.isCompleted == true))
        // lengthCount = 0
        console.log("Current articles:", currentArticles)
        console.log("Pagination: pgNum =",pageNumber)
        if(type == "articles"){
            setCurrentArticlesPage(pageNumber);
        }
    }


    useEffect(() => {
        getAllArticles()
    }, [])

    const getAllArticles = async() => {
        const {data, error} = await supabase
            .from('BeautyLynk_Articles')
            .select('*')
            .order('id', { ascending: true })
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("All Articles", data)
            setAllArticles(data)
            // console.log(data.id)
        }
    }


    return (
        <Layout>
            <div className="aboutUs-wrap">
                <div className="aboutUs-header">
                    <div className="aboutUs-header_container">
                        <div className="header_content">
                            <h1>About Us</h1>
                            <p>BeautyLynk is an inclusive, on-demand beauty service platform that connects clients with professional beauty services tailored to their unique needs, anytime, anywhere.</p>
                        </div>
                        <div className="header_image">
                            <img src="../images/group.jpeg" alt="" srcset="" />
                        </div>
                    </div>
                </div>
                <div className="aboutUs-section">
                    <div className="aboutUs-mission">
                        <div className="mission_image">
                            <img src="../images/working.jpeg" alt="" srcset="" />
                        </div>
                        <div className="mission_content">
                            <h2>Our Mission:</h2>
                            <p>Empowering Beauty, Connecting Hearts – BeautyLynk is dedicated to revolutionizing the beauty industry by bridging the gap between skilled beauty professionals and discerning clients. Our mission is to provide personalized, inclusive, and accessible beauty experiences that not only enhance external beauty but also nurture inner confidence and connection. Through innovation, excellence, and a profound respect for diversity, we aim to build a community where everyone feels seen, valued, and empowered to express their unique beauty. At BeautyLynk, we believe that true beauty transcends boundaries, and together, we are redefining beauty standards, one connection at a time.</p>
                        </div>
                    </div>
                </div>
                <div className="aboutUs-section">
                    <div className="aboutUs-story">
                        <div className="story_content">
                            <h2>Our Story:</h2>
                            <p>At BeautyLynk, we recognize and celebrate the artistry and dedication of beauty professionals across the industry. As the most inclusive on-demand beauty company, we are committed to connecting clients with top-tier beauty services that cater to their unique needs and preferences. Our platform is designed to support and uplift the diverse talents within the beauty community, providing long-term services that ensure clients feel their best, anytime, anywhere. By fostering a nurturing environment for both our professionals and clients, BeautyLynk is at the forefront of personalized, accessible beauty experiences, redefining the way beauty services are delivered and experienced.</p>
                        </div>
                        <div className="story_image">
                            <img src="../images/bg/group-003.jpg" alt="" srcset="" />
                        </div>
                    </div>
                </div>
                <div className="articles-wrap">
                    <h1>Read More About BeautyLynk</h1>
                    <div className="articles-container">
                        {
                            currentArticles.map((article) => (
                                    <div className="article-card">
                                        <a href={article.link}>

                                            <div className="article-card_image">
                                                <img src={article.image} alt="" />
                                            </div>
                                            <div className="article-card_info">
                                                <h2>{article.website}</h2>
                                                <div className="article-preview">
                                                    <p>{article.preview ? article.preview.substring(0, 200) : ""}...</p> 
                                                </div>
                                            </div>
                                            {/* <img src="" alt="" srcset="" /> */}
                                        </a>
                                    </div>
                            ))
                        }
                    </div>
                    <br />
                    <Pagination className="article-pagination" length={allArticles.length} currentPage={currentArticlesPage} type="articles" rowsPerPage={rowsPerPge} handlePagination={handleArticlePagination} />
                    <br /><br />
                </div>
            </div>
            
        </Layout>
    )
}

export default AboutUs
