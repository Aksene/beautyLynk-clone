import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import './BlogHero.css'
import { Carousel } from 'react-responsive-carousel'


function BlogHero() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getPosts()
    }, [])

    const getPosts = async() => {
        let info = [];

        const {data, error} = await supabase
            .from('BeautyLynk_Blogs')
            .select('id, title, image, link')
            .order('id')
        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            console.log("Medium posts")
            console.log(data)
            setPosts(data)

            // console.log(data.id)
        }
    }

    return (
        <div className="blogHero-container">
            <div className="blogHero-wrap">
                <div className="blogHero-header">
                    <h1>Beauty Re:Fresh</h1>
                </div>
                
                <div className="blogHero-posts">
                    {posts.map((post) => (
                        <div>
                            <div key={post.id} className="blogHero-element">
                                <img src={post.image} className="blogHero-image"/>
                                <div className="blogHero-desc">
                                    <h6>{post.title}</h6>
                                    <a href={post.link} target="_blank">Read</a>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <Carousel 
                        className="carousel-wrap" 
                        // showArrows={false} 
                        autoPlay={true} 
                        infiniteLoop={true}
                        showIndicators={true}
                        showStatus={false}
                        stopOnHover={false}
                        showThumbs={false}
                    >
                        {posts.map((post) => (
                            <div>
                                <div className="carousel-slide">
                                    <div key={post.id} className="blogHero-element">
                                        <img src={post.image} className="blogHero-image"/>
                                        <div className="blogHero-desc">
                                            <h6>{post.id}.{post.title}</h6>
                                            <a href={post.link} target="_blank">Read</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))} 
                    </Carousel>  */}
                </div>
            </div>
        </div>
    )
}

export default BlogHero
