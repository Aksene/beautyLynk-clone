import React from 'react'
import './BlogHero.css'
function BlogHero() {
    return (
        <div className="blogHero-container">
            <div className="blogHero-wrap">
                <div className="blogHero-header">
                    <h1>Beauty Re:Fresh</h1>
                </div>
                <div className="blogHero-posts">
                    <div className="blogHero-element">
                        <img src="/images/posts/original_hearts-make-up-bag.jpeg" className="blogHero-image"/>
                        <div className="blogHero-desc">
                            <h6>7 Makeup Elements for Every Beauty</h6>
                            <a href="">Read</a>
                        </div>
                    </div>
                    <div className="blogHero-element">
                        <img src="/images/posts/red_pout.jpeg" className="blogHero-image"/>
                        <div className="blogHero-desc">
                            <h6>The Best Liquid Lipstick For That Perfect Pout</h6>
                            <a href="">Read</a>
                        </div>
                    </div>
                    <div className="blogHero-element">
                        <img src="/images/posts/winter_colors.jpeg" className="blogHero-image"/>
                        <div className="blogHero-desc">
                            <h6>Winter Lip Colors to Try Now</h6>
                            <a href="">Read</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogHero
