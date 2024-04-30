import './Advisor.css'
import { Widget } from '@typeform/embed-react'
import '@typeform/embed/build/css/widget.css'
import React, {useEffect, useRef} from 'react'
import Layout from '../components/Layout'

// createWidget("KGKfSNK7", {
//     open: 'time',
//     openValue: 60000,
//   })

function Advisor() {
    

    return (                
        <Layout>
            <Widget 
                id="KGKfSNK7" 
                style={{ width: '100%', height: '100%' }} 
                autoResize
                // inlineOnMobile 
                height ="590"
                chat
                opacity="100"
                className="my-form" 
            />
            <br /><br /><br /><br />
        </Layout>
    )

    // return <div ref={tfElement} />

}

export default Advisor
