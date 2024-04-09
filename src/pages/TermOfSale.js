import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import './TermOfSale.css'
function TermOfSale() {
    return (
        <Layout>
            <div className="termOfSale-wrap">
                <h1 className="termOfSale-page_header">Terms of Sale</h1>
                <div className="termOfSale-page-container">
                    <div className="termOfSale-section">
                        <h3>Contractual Relationship</h3>
                        <p>Your reservation and use of the Services described in the following section ("Services") constitute your agreement to be bound by these Terms of Sale ("Terms"), which establishes a contractual relationship between you and BeautyLynk, Inc. ("BeautyLynk"). If you do not agree to these Terms, you may not access or use the Services. BeautyLynk may immediately terminate these Terms or any Services with respect to you, or generally cease offering or deny access to the Services or any portion thereof, at any time for any reason.</p>
                        <p>Supplemental terms may apply to certain Services, such as policies for a particular event, activity or promotion, and such supplemental terms will be disclosed to you in connection with the applicable Service(s). Supplemental terms are in addition to, and shall be deemed a part of, the Terms for the purposes of the applicable Service(s). Supplemental terms shall prevail over these Terms in the event of a conflict with respect to the applicable Services.</p>
                        <p>BeautyLynk may amend the Terms related to the sale of Services from time to time. Amendments will be effective upon BeautyLynk's posting of such updated Terms at this location and notification on the Website's homepage. Your continued access or use of the Services after such posting constitutes your consent to be bound by the Terms, as amended.</p>
                        <p>Our collection and use of personal information in connection with the Services is as provided in BeautyLynk's Privacy Policy.</p>
                    </div>
                    <div className="termOfSale-section">
                        <h3>The Services</h3>
                        <p>BeautyLynk is an immersive technology platform with devices designed to deliver individualized beauty services on-demand. BeautyLynk deploys independently contracted Beauty Professionals into people's homes, offices, and hotels providing personal and professional beauty, hair, makeup, and related services. Unless otherwise agreed by BeautyLynk in a separate written agreement with you, the Services are made available solely for your personal, noncommercial use.</p>
                    </div>
                    <div className="termOfSale-section">
                        <h3>Restrictions</h3>
                        <p>You may not: (i) reproduce, misappropriate, license, sell, resell, transfer, publicly display, publicly perform, transmit, stream, broadcast or otherwise exploit the Services except as expressly permitted by BeautyLynk in these Terms of Sale; (ii) unduly burden or hinder the operation and/or functionality of any aspect of the Services; or (iii) attempt to gain unauthorized access to or impair any aspect of the Services.</p>
                    </div>
                    <div className="termOfSale-section">
                        <h3>Provision of the Services</h3>
                        <p>You acknowledge that the beauty services described on the Website are provided by independent Beauty Professionals and BeautyLynk does not engage in the provision of any beauty services.</p>
                    </div>
                    <div className="termOfSale-section">
                        <h3>You acknowledge that the beauty services described on the Website are provided by independent Beauty Professionals and BeautyLynk does not engage in the provision of any beauty services.</h3>
                        <p>You understand that use of the Services may result in charges to you for the services you receive from an Independent Beauty Professional ("Charges"). When you book beauty services through the Website, PayPal, or Stripe will facilitate your payment of the applicable Charges. Payment of the Charges in such manner shall be considered the same as payment made directly by you to BeautyLynk as consideration for the services provided by the Beauty Professional. Charges will be inclusive of applicable taxes where required by law. Charges paid by you are final and only refundable pursuant to BeautyLynk's Cancellation Policy.</p>
                        <p>All Charges are due immediately and payment will be facilitated by Paypal or Stripe, after which BeautyLynk will send you a receipt by email.</p>
                        <p>As between you and BeautyLynk, BeautyLynk reserves the right to establish, remove and/or revise Charges for any or all services or goods obtained through the use of the Services at any time in BeautyLynk's sole discretion.</p>
                        <p>BeautyLynk may from time to time provide certain users with promotional offers and discounts that may result in different amounts charged for the same or similar services or goods obtained through the use of the Services, and you agree that such promotional offers and discounts, unless also made available to you, shall have no bearing on your use of the Services or the Charges applied to you.</p>
                        <p>You may elect to cancel your request for services from a Beauty Professional at any time prior to such Beauty Professional's arrival, in which case you may be charged a cancellation fee pursuant to the terms of BeautyLynk's cancellation policy.</p>
                        <p>This payment structure is intended to fully compensate the Beauty Professional for the services or goods provided. BeautyLynk does not designate any portion of your payment as a tip or gratuity to the Beauty Professional. You understand and agree that, while you are free to provide additional payment as a gratuity to any Beauty Professional who provides you with services obtained through the Website, you are under no obligation to do so. Gratuities are voluntary.</p>
                    </div>
                    <div className="termOfSale-section">
                        <h3>Disclaimers; Limitation of Liability; Indemnity.</h3>
                        <p>DISCLAIMER</p>
                        <p>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." BEAUTYLYNK DISCLAIMS ALL REPRESENTATIONS AND WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, NOT EXPRESSLY SET OUT IN THESE TERMS, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN ADDITION, BEAUTYLYNK MAKES NO REPRESENTATION, WARRANTY, OR GUARANTEE REGARDING THE RELIABILITY, TIMELINESS, QUALITY, SUITABILITY, OR AVAILABILITY OF THE SERVICES OR ANY SERVICES OR GOODS REQUESTED THROUGH THE USE OF THE SERVICES, OR THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE. BEAUTYLYNK DOES NOT GUARANTEE THE QUALITY, SUITABILITY, SAFETY OR ABILITY OF BEAUTY PROFESSIONALS. YOU AGREE THAT THE ENTIRE RISK ARISING OUT OF YOUR USE OF THE SERVICES, AND ANY SERVICE OR GOOD REQUESTED IN CONNECTION THEREWITH, REMAINS SOLELY WITH YOU, TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW.</p>
                        <p>LIMITATION OF LIABILITY</p>
                        <p>BEAUTYLYNK SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, LOST DATA, PERSONAL INJURY, OR PROPERTY DAMAGE RELATED TO, IN CONNECTION WITH, OR OTHERWISE RESULTING FROM ANY USE OF THE SERVICES, EVEN IF BEAUTYLYNK HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. BEAUTYLYNK SHALL NOT BE LIABLE FOR ANY DAMAGES, LIABILITY OR LOSSES ARISING OUT OF: (i) YOUR USE OF OR RELIANCE ON THE SERVICES OR YOUR INABILITY TO ACCESS OR USE THE SERVICES; OR (ii) ANY TRANSACTION OR RELATIONSHIP BETWEEN YOU AND ANY BEAUTY PROFESSIONAL, EVEN IF BEAUTYLYNK HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. BEAUTYLYNK SHALL NOT BE LIABLE FOR DELAY OR FAILURE IN PERFORMANCE RESULTING FROM CAUSES BEYOND BEAUTYLYNK'S REASONABLE CONTROL.</p>
                        <p>THE LIMITATIONS AND DISCLAIMER IN THIS SECTION DO NOT PURPORT TO LIMIT LIABILITY OR ALTER YOUR RIGHTS AS A CONSUMER THAT CANNOT BE EXCLUDED UNDER APPLICABLE LAW.</p>
                        <p>INDEMNITY</p>
                        <p>You agree to indemnify and hold BeautyLynk and its officers, directors, employees, and agents harmless from any and all claims, demands, losses, liabilities, and expenses (including attorneys' fees), arising out of or in connection with: (i) your use of the Services or services or goods obtained through your use of the Services; (ii) your breach or violation of any of these Terms; (iii) BeautyLynk's use of your User Contributions; or (iv) your violation of the rights of any third party, including Beauty Professionals.</p>
                    </div>
                    <div className="termOfSale-section">
                        <h3>Dispute Resolution</h3>
                        <p>At BeautyLynk, Inc.'s sole discretion, it may require you to submit any disputes in connection with the provision of Beauty Services and Terms of Sale, including disputes arising from or concerning their interpretation, violation, invalidity, non-performance, or termination, to final and binding arbitration under the Rules of Arbitration of the American Arbitration Association applying Massachusetts' law.</p>
                    </div>
                </div>
            </div>
            
        </Layout>
    )
}

export default TermOfSale
