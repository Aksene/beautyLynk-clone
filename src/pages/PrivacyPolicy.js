import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import axios from "axios"
import './PrivacyPolicy.css'

function PrivacyPolicy() {
    return (
        <Layout>
            <div className="privacy-wrap">
                <h1 className="privacy-page_header">Privacy Policy</h1>
                <div className="privacy-page-container">
                    <div className="privacy-section">
                        <h3>Introduction</h3>
                        <p>BeautyLynk, Inc. ("Company" or "We" or "Us") respects your privacy and are committed to protecting it through our compliance with this policy.</p>
                        <p>This policy describes the types of information we may collect from you or that you may provide when you visit the website BeautyLynk.com, blynkme.com, or use the BeautyLynk mobile application (collectively, our "Website") and our practices for collecting, using, maintaining, protecting and disclosing that information.</p>
                        <p>
                            This policy applies to information we collect: <br />
                                - On this Website. <br />
                                - In e-mail, text and other electronic messages between you and this Website. <br />
                                - Through mobile and desktop applications you download from this Website, which provide dedicated non-browser-based interaction between you and this Website. <br />
                                - When you interact with our advertising and applications on third-party websites and services, if those applications or advertising include links to this policy. <br />
                        </p>

                        <p>
                            It does not apply to information collected by: <br />

                            - Us offline or through any other means, including on any other website operated by Company or any third party; or <br />
                            - Any third party, including through any application or content (including advertising) that may link to or be accessible from or on the Website. <br />
                        </p>
                        <p>Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, you may choose not to use our Website. By accessing or using this Website, you agree to this privacy policy. This policy may change from time to time. Your continued use of this Website after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.</p>
                    </div>
                    <div className="privacy-section">
                        <h3>Children Under the Age of 18</h3>
                        <p>Our Website is not intended for children under 18 years of age. No one under age 18 may provide any information to or on the Website. We do not knowingly collect personal information from children under 18. If you are under 18, do not use or provide any information on this Website or on or through any of its features or register on the Website, make any purchases through the Website, use any of the interactive or public comment features of this Website or provide any information about yourself to us, including your name, address, telephone number, e-mail address or any screen name or user name you may use. If we learn we have collected or received personal information from a child under 18 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 18, please contact us at <a href="mailto:support@beautylynk.com">support@beautylynk.com</a>.</p>
                    </div>
                    <div className="privacy-section">
                        <h3>Information We Collect About You and How We Collect It</h3>
                        <p>We collect several types of information from and about users of our Website, including information: <br />
                            - By which you may be personally identified, such as name, postal address, GPS coordinates, e-mail address, mobile telephone number, credit card information and a photograph of your face and hair ("personal information"); <br />
                            - That is about you but individually does not identify you, such as gender and hair texture; and/or <br />
                            - About your Internet connection, including the equipment you use to access our Website and your usage details. <br />
                        </p>
                    </div>
                    <div className="privacy-section">
                        <h3>We collect this information</h3>
                        <p>
                            - Directly from you when you provide it to us. <br />
                            - Automatically as you navigate through the Website. Information collected automatically may include usage details, IP addresses and information collected through cookies, and web beacons. <br />
                            - From third parties, for example, our business partners. <br />
                        </p>
                    </div>
                    <div className="privacy-section">
                        <h3>Information You Provide to Us</h3>
                        <p>
                            The information we collect on or through our Website may include: <br />

                            - Information that you provide by filling in forms on our Website. This includes information provided at the time of registering to use our Website, placing an order for an appointment using our service, or any posting of material. We may also ask you for information when you report a problem with our Website. <br />
                            - Records and copies of your correspondence (including e-mail addresses), if you contact us. <br />
                            - Your responses to surveys that we might ask you to complete for research purposes. <br />
                            - Details of transactions you carry out through our Website, including the history and fulfillment of your orders. You may be required to provide financial information before placing an order through our Website. <br />
                            - Your search queries on the Website. <br />
                        </p>
                        <p>You also may provide information to be published or displayed (hereinafter, "posted") on public areas of the Website, or transmitted to other users of the Website or third parties (collectively, "User Contributions"). Your User Contributions are posted on and transmitted to others at your own risk. Additionally, we cannot control the actions of other users of the Website with whom you may choose to share your User Contributions. Therefore, we cannot and do not guarantee that your User Contributions will not be viewed by unauthorized persons.</p>
                    </div>
                    <div className="privacy-section">
                        <h3>Information We Collect Through Automatic Data Collection Technologies</h3>
                        <p>As you navigate through and interact with our Website, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions and patterns, including:<br />
                            - Details of your visits to our Website, including traffic data, location data, logs and other communication data and the resources that you access and use on the Website.<br />
                            - Information about your computer and Internet connection, including your IP address, operating system and browser type.
                        </p>
                        <p>We also may use these technologies to collect information about your online activities over time and across third-party websites or other online services (behavioral tracking. If you would like to opt out of behavioral tracking, please notify us at support@beautylynk.com. You will be provided with an email notification when behavioral tracking has been disabled.</p>
                        <p>
                            The information we collect automatically is statistical data and may include personal information, but we may maintain it or associate it with personal information we collect in other ways or receive from third parties. It helps us to improve our Website and to deliver a better and more personalized service, including by enabling us to: <br />
                                - Estimate our audience size and usage patterns. <br />
                                - Store information about your preferences, allowing us to customize our Website according to your individual interests. <br />
                                - Speed up your searches. <br />
                                - Recognize you when you return to our Website. <br />
                        </p>
                        <p>
                            The technologies we use for this automatic data collection may include: <br />
                                - Cookies (browser cookies). A cookie is a small file placed on the hard drive of your computer. You may refuse to accept browser cookies by activating the appropriate setting on your browser. However, if you select this setting you may be unable to access certain parts of our Website. Unless you have adjusted your browser setting so that it will refuse cookies, our system will issue cookies when you direct your browser to our Website. <br />
                                - Flash Cookies. Certain features of our Website may use local stored objects (or Flash cookies) to collect and store information about your preferences and navigation to, from and on our Website. Flash cookies are not managed by the same browser settings as are used for browser cookies. <br />
                                - Web Beacons. Pages of the Website may contain small electronic files known as web beacons (also referred to as clear gifs) that permit the Company, for example, to count users who have visited those pages and for other related website statistics (for example, recording the popularity of certain website content and verifying system and server integrity). We do not tie information gathered by web beacons to your personal information. <br />
                        </p>
                    </div>
                    <div className="privacy-section">
                        <h3>Third-party Use of Cookies and Other Tracking Technologies</h3>
                        <p>Some content or applications, including advertisements, on the Website are served by third-parties, including advertisers, ad networks and servers, content providers and application providers. These third parties may use cookies to collect information about you when you use our website. The information they collect may be associated with your personal information or they may collect information, including personal information, about your online activities over time and across different websites and other online services. They may use this information to provide you with interest-based (behavioral) advertising or other targeted content.</p>
                        <p>We do not control these third parties' tracking technologies or how they may be used. If you have any questions about an advertisement or other targeted content, you should contact the responsible provider directly. For information about how you can opt out of receiving targeted advertising from many providers, see the section Choices About How We Use and Disclose Your Information, below.</p>
                    </div>
                    <div className="privacy-section">
                        <h3>How We Use Your Information</h3>
                        <p>
                            We use information that we collect about you or that you provide to us, including any personal information: <br />
                                - To present our Website and its contents to you. <br />
                                - To provide you with information or services that you request from us. <br />
                                - To fulfill any other purpose for which you provide it. <br />
                                - To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection. <br />
                                - To notify you about changes to our Website or any products or services we offer or provide though it. <br />
                                - To allow you to participate in interactive features on our Website. <br />
                                - In any other way we may describe when you provide the information. <br />
                                - For any other purpose with your consent. <br />
                        </p>
                        <p>We may also use your information to contact you about our own and third-parties' goods and services that may be of interest to you. If you do not want us to use your information in this way, please notify us at <a href="mailto:support@beautylynk.com">support@beautylynk.com</a>.</p>
                    </div>
                    <div className="privacy-section">
                        <h3>Disclosure of Your Information</h3>
                        <p>We may disclose aggregated information about our users, and information that does not identify any individual, without restriction.</p>
                        <p>
                            We may disclose personal information that we collect or you provide as described in this privacy policy: <br />
                                - To contractors, and other third parties we use to support our business who are bound by contractual obligations to keep personal information confidential and use it only for the purposes for which we disclose it to them. <br />
                                - To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution or other sale or transfer of some or all of BeautyLynk, Inc.'s assets, whether as a going concern or as part of bankruptcy, liquidation or similar proceeding, in which personal information held by BeautyLynk, Inc. about our Website users is among the assets transferred. <br />
                                - To only select, trusted, third parties to market their products or services to you if you have not opted out of these disclosures. <br />
                                - To fulfill the purpose for which you provide it. For example, if you give us your phone number when booking services on our Website, our Beauty Professionals will use this number to contact you as necessary to provide those services. <br />
                                - For any other purpose disclosed by us when you provide the information. <br />
                                - With your consent. <br />
                        </p>
                        <p>
                            We may also disclose your personal information: <br />
                                - To comply with any court order, law or legal process, including to respond to any government or regulatory request. <br />
                                - To enforce or apply our Terms of Use and other agreements, including for billing and collection purposes. <br />
                                - If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of BeautyLynk, Inc., our customers or others. <br />
                        </p>
                    </div>
                    <div className="privacy-section">
                        <h3>Choices About How We Use and Disclose Your Information</h3>
                        <p>
                            We strive to provide you with choices regarding the personal information you provide to us. We have created mechanisms to provide you with the following control over your information: <br />
                                - Tracking Technologies and Advertising. You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. To learn how you can manage your Flash cookie settings, visit the Flash player settings page on Adobe's website. If you disable or refuse cookies, please note that some parts of this site may then be inaccessible or not function properly. <br />
                                - Promotional Offers from the Company. If you do not wish to have your e-mail address/contact information used by the Company to promote our own or third parties' products or services, you can opt-out by emailing us at <a href="mailto:support@beautylynk.com">support@beautylynk.com</a>. If we have sent you a promotional e-mail, you may send us a return e-mail asking to be omitted from future e-mail distributions. This opt out does not apply to information provided to the Company as a result of a product purchase, warranty registration, product service experience or other transactions. <br />
                                - We do not control third parties' collection or use of your information to serve interest-based advertising. However these third parties may provide you with ways to choose not to have your information collected or used in this way. You can opt out of receiving targeted ads from members of the Network Advertising Initiative ("NAI") on the NAI’s website. <br />
                        </p>
                    </div>
                    <div className="privacy-section">
                        <h3>Accessing and Correcting Your Information</h3>
                        <p>You can review and change your personal information by logging into the Website and visiting your account profile page.</p>
                        <p>You may also send us an e-mail at <a href="mailto:support@beautylynk.com">support@beautylynk.com</a> to request access to, correct or delete any personal information that you have provided to us. We cannot delete your personal information except by also deleting your user account. We may not accommodate a request to change information if we believe the change would violate any law or legal requirement or cause the information to be incorrect.</p>
                        <p>If you delete your User Contributions from the Website, copies of your User Contributions may remain viewable in cached and archived pages, or might have been copied or stored by other Website users. Proper access and use of information provided on the Website, including User Contributions, is governed by our Terms of Use.</p>
                    </div>
                    <div className="privacy-section">
                        <h3>Data Security</h3>
                        <p>We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration and disclosure. All information you provide to us is stored on our secure servers behind firewalls. Any payment transactions will be encrypted using SSL technology.</p>
                        <p>The safety and security of your information also depends on you. Where you have chosen a password for access to certain parts of our Website, you are responsible for keeping this password confidential. We ask you not to share your password with anyone. We urge you to be careful about giving out information in public areas of the Website like message boards. The information you share in public areas may be viewed by any user of the Website.</p>
                        <p>Unfortunately, the transmission of information via the Internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Website. Any transmission of personal information is at your own risk. We are not responsible for circumvention of any privacy settings or security measures contained on the Website.</p>    
                    </div>
                    <div className="privacy-section">
                        <h3>Changes to Our Privacy Policy</h3>
                        <p>It is our policy to post any changes we make to our privacy policy on this page with a notice that the privacy policy has been updated on the Website home page. If we make material changes to how we treat our users' personal information, we will notify you by e-mail to the e-mail address specified in your account and through a notice on the Website home page. The date the privacy policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date active and deliverable e-mail address for you, and for periodically visiting our Website and this privacy policy to check for any changes.</p>
                    </div>
                    <div className="privacy-section">
                        <h3>Contact Information</h3>
                        <p>To ask questions or comment about this privacy policy and our privacy practices, contact us at <a href="mailto:support@beautylynk.com">support@beautylynk.com</a></p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PrivacyPolicy
