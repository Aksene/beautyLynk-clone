import React, {useState, useEffect} from 'react'
import { supabase } from '../database/Database'
import './BlogHero.css'
import { Carousel } from 'react-responsive-carousel'


function BlogHero() {
    const [posts, setPosts] = useState([])
    const indicatorStyles = {
        background: '#fff',
        width: 8,
        height: 8,
        display: 'inline-block',
        margin: '0 8px',
        
    };
    var mobileAtt
    const width = window.screen.width
     if (width >= 800){
        mobileAtt = {
            centerMode: true
            // etc
        }
        console.log("Attributes for blog hero: ",mobileAtt)
    }else {
        mobileAtt = {
            centerMode: false
            // etc
        }
        console.log("Attributes for blog hero: ",mobileAtt)
    }

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
                    {/* {posts.map((post) => (
                        <div>
                            <div key={post.id} className="blogHero-element">
                                <img src={post.image} className="blogHero-image"/>
                                <div className="blogHero-desc">
                                    <h6>{post.title}</h6>
                                    <a href={post.link} target="_blank">Read</a>
                                </div>
                            </div>
                        </div>
                    ))} */}
                    <Carousel 
                        className="blogHero_carousel-wrap" 
                        selectedItem={1}
                        autoPlay={true} 
                        infiniteLoop={true}
                        showStatus={false}
                        showIndicators={false}
                        stopOnHover
                        swipeable
                        {...mobileAtt}
                        centerSlidePercentage={60}
                        useKeyboardArrows={true}
                        emulateTouch
                        selectedItem={posts.length}
                        transitionTime={750}
                        interval={5000}
                        // renderIndicator={(onClickHandler, isSelected, index, label) => {
                        //     if (isSelected) {
                        //         return (
                        //             <li
                        //                 style={{ ...indicatorStyles, background: '#da1d6f' }}
                        //             />
                        //         );
                        //     }
                        //     return (
                        //         <li
                        //             style={{
                        //                 background: '#562361',
                        //                 width: 8,
                        //                 height: 8,
                        //                 display: 'inline-block',
                        //                 margin: '0 8px',
                        //                 cursor: "pointer",

                        //             }}
                        //             onClick={onClickHandler}
                        //             onKeyDown={onClickHandler}
                        //             value={index}
                        //             key={index}
                        //             role="button"
                        //             tabIndex={0}
                        //         />
                        //     );
                        // }}
                    >
                        {posts.map((post) => (
                            <div key={post.id}>
                                <div className="carousel-slide">
                                    <div key={post.id} className="blogHero-element">
                                        <img src={post.image} className="blogHero-image"/>
                                        <div className="blogHero-desc">
                                            <h6>{post.title}</h6>
                                            <a href={post.link} target="_blank">Read</a>
                                        </div>
                                        <br /><br />
                                    </div>
                                </div>
                            </div>
                        ))} 
                    </Carousel> 
                </div>
            </div>
        </div>
    )
}

export default BlogHero
