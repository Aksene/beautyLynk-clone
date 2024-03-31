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
                            <p>BeautyLynk's company and culture are a lot like our product. They’re crafted, not cobbled, for a delightful experience.</p>
                        </div>
                        <div className="header_image">
                            <img src="../images/Hubspotters.webp" alt="" srcset="" />
                        </div>
                    </div>
                </div>
                <div className="aboutUs-section">
                    <div className="aboutUs-mission">
                        <div className="mission_image">
                            <img src="../images/grow-better.webp" alt="" srcset="" />
                        </div>
                        <div className="mission_content">
                            <h2>Our Mission: Helping Millions of Organizations Grow Better</h2>
                            <p>We believe not just in growing bigger, but in growing better. And growing better means aligning the success of your own business with the success of your customers. Win-win!</p>
                        </div>
                    </div>
                </div>
                <div className="aboutUs-section">
                    <div className="aboutUs-story">
                        <div className="story_content">
                            <h2>Our Story</h2>
                            <p>In 2004, fellow MIT graduate students Brian Halligan and Dharmesh Shah noticed a major shift in the way people shop and purchase products. Buyers didn’t want to be interrupted by ads, they wanted helpful information. In 2006, they founded HubSpot to help companies use that shift to grow better with inbound marketing.
                                <br/><br/>Along the way, HubSpot expanded beyond marketing into a crafted, not cobbled suite of products that create the frictionless customer experience that buyers expect today. Expertly led by CEO Yamini Rangan, HubSpot uses its customer platform built on an AI-powered Smart CRM to help millions of scaling organizations grow better.</p>
                        </div>
                        <div className="story_image">
                            <img src="../images/Rangan-Halligan.webp" alt="" srcset="" />
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
