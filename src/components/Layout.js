import React, { useState, useEffect } from 'react'
import './Layout.css'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';
import { useAuth2 } from '../Auth/auth2'
import { useNavigate } from "react-router-dom";

// import abdousWorld from '/images/abdousWorld.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";


const Layout = ({children}) => {
    const [showMenu, setShowMenu] = useState(false)
    const closeMobileMenu = () => setShowMenu(false);

    let navigate = useNavigate();
    const auth = useAuth2()


    const handleLogout = async(e) => {
        e.preventDefault()

        auth.Logout()
        navigate("../", { replace: true });

    }

    return (
        <div>
            <header className="header">
                <div className="header-image-container">
                    <Link to={"/"}>
                        <img className="header-image" src={"/images/logo.svg"} alt="Slaymasters" />
                        {/* <p>BeautyLynk</p> */}
                    </Link>
                </div>

                <div className={showMenu ? 'menu-icon active' : 'menu-icon'} onClick={() => setShowMenu(!showMenu)}>
                    {
                            showMenu ?
                            <FontAwesomeIcon
                            icon={faXmark}
                            onClick={() => setShowMenu(!showMenu)}
                            /> 
                            :                    
                            <FontAwesomeIcon
                            icon={faBars}
                            onClick={() => setShowMenu(!showMenu)}
                            />
                    }
                </div>



                <div className="header-links">
                    <ul className={showMenu ? 'nav-menu active' : 'nav-menu'}>
                        {/* <li className="nav-item" >
                            <Link className={showMenu ? 'nav-links active' : 'nav-links'} onClick={closeMobileMenu} to={"/"}>
                                Home
                            </Link>
                        </li> */}
                        <li className="nav-item" >
                            <Link className={showMenu ? 'nav-links active' : 'nav-links'} onClick={closeMobileMenu} to="/book-now" state={{homeInfo: ""}}>
                                Book Now
                            </Link>
                        </li>
                        <li className="nav-item" >
                            <Link className={showMenu ? 'nav-links active' : 'nav-links'} onClick={closeMobileMenu} to={"/advisor"}>
                                Advisor
                            </Link>
                        </li>
                        {/* <li className="nav-item" >
                            <Link className={showMenu ? 'nav-links active' : 'nav-links'} onClick={closeMobileMenu} to={"/playground"}>
                                Playground
                            </Link>
                        </li> */}
                        {auth.user ? 
                                <>
                                    <li className="nav-item">
                                        <Link className={showMenu ? 'nav-links active' : 'nav-links'} to={"/dashboard"} onClick={closeMobileMenu}>
                                            Dashboard
                                        </Link>
                                    </li>

                                    {/* {showAdminTabs()} */}

                                    <li onClick={closeMobileMenu} className="nav-item">
                                        <a className={showMenu ? 'nav-links-red active' : 'nav-links-red'} onClick={auth.Logout} to={"/log-out"}>
                                            <button className="nav-btn" onClick={handleLogout} to={"/log-out"}>Log-out</button>
                                        </a>
                                    </li>
                                </>
                                :
                                <li className="nav-item">
                                    <Link className={showMenu ? 'nav-links active' : 'nav-links'} onClick={closeMobileMenu} to={"/login"}>
                                        Login
                                    </Link>
                                </li>
                            }
                    </ul>
                </div>

            </header>

            <main>
            <div className={showMenu ? 'no-scroll' : ''}>
                {children}
            </div>
                
            </main>

            <footer>
                <div className="footer-links">
                    <div className="slaymaster-logo-bottom-container">
                            <a href="" to="/">
                                <img className="slaymaster-logo-bottom" src={"/images/logo--white.svg"} alt="SlaymasterLogoBottom" />
                            </a>
                            {/* BeautyLynk */}
                    </div>
                    <div className="footer-aboutUs">
                        <ul>
                            <h3 className="footer-cat_header">Company</h3>
                            {/* <li className="footer-cat_links">
                                <Link to="/book-now" state={{homeInfo: ""}}>
                                    <span>Book Now</span>
                                </Link>
                            </li> */}
                            <li className="footer-cat_links">
                                <a href="/about-us/">
                                    <span>About Us</span>
                                </a>
                            </li>
                            <li className="footer-cat_links">
                                <a href="/privacy-policy/">
                                    <span>Privacy Policy</span>
                                </a>
                            </li>
                            <li className="footer-cat_links">
                                <a href="/term-of-use/">
                                    <span>Term of Use</span>
                                </a>
                            </li>
                            <li className="footer-cat_links">
                                <a href="/term-of-sale/">
                                    <span>Term of Sale</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-links_services">
                        <ul>
                            <h3 className="footer-cat_header">Connect</h3>
                            <li className="footer-cat_links">
                                <Link to="https://form.typeform.com/to/WXlKI39T?typeform-source">
                                        <span>Join the Team</span>
                                </Link>
                            </li>
                            <li className="footer-cat_links">
                                <a href="//medium.com/beauty-re-fresh">
                                    <span>Blog</span>
                                </a>
                            </li>
                            <li className="footer-cat_links">
                                <a href="/advisor">
                                    <span>Advisor</span>
                                </a>
                            </li>
                            <li className="footer-cat_links">
                                <a href="/contact-us">
                                    <span>Contact Us</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* <div className="footer-links_contact">
                        <ul>
                            <h3>Contact Information</h3>
                            <li className="footer-cat_links">
                                Number: <span> </span>
                                <a>
                                    <span>+1(978)xxx-xxxx</span>
                                </a>
                            </li>
                            <li className="footer-cat_links">
                                E-mail: <span> </span> 
                                <a href="mailto:kembacorp@gmail.com" target="_blank">
                                    <span>kembacorp@gmail.com</span>
                                </a>
                            </li>
                            <li className="footer-cat_links">
                                Address: <span> </span>
                                <a>
                                    <span>2222 Boylston St, Boston, MA, 01945</span>
                                </a>
                            </li>
                        </ul>
                    </div> */}
                </div>
                <div className="footer-info">
                    <div className="footer-copyright">
                        <p className="footer-copyright-text">Copyright © 2023 <a href="" to='/'>BeautyLynk</a>. All Rights Reserved.</p>
                    </div>
                    <div className="footer-signature">
                        {/* <p className="footer-signature-text"> 
                            Powered by
                        </p>
                        <a href="http://abdous-world.vercel.app" target="_blank">
                            <img className="footer-signature-logo" src={"/abdousWorld.png"} alt="Abdou's World" />
                        </a> */}

                    </div>
                    <div className="footer-icon-group">
                        <ul>
                            {/* <li>
                                <Link to="/faq" target='_blank'>
                                    FAQ
                                </Link>
                            </li> */}
                            <li>
                                <Link className="footer-icon-group_social" to="//twitter.com/BeautyLynk" target='_blank'>
                                    <FaTwitter/>
                                </Link>
                            </li>
                            <li>
                                <Link className="footer-icon-group_social" to="//instagram.com/BeautyLynk" target='_blank'>
                                    <FaInstagram/>
                                </Link>
                            </li>
                            <li>
                                <Link className="footer-icon-group_social" to="//facebook.com/BeautyLynk" target='_blank'>
                                    <FaFacebook/>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Layout
