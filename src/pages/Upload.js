import React from 'react'
import { useEffect, useState } from 'react'
import { useAuth2 } from '../Auth/auth2'
import { useLocation } from 'react-router-dom'

import Layout from '../components/Layout'
import { supabase } from '../database/Database'
import "./Upload.css"


function UploadImages() {
    const auth = useAuth2();
    const [proInfo, setProInfo] = useState([])
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [message, setMessage] = useState("")
    const [finish, setFinish] = useState(false)


    const search = useLocation().search;
    const id=new URLSearchParams(search).get("id");
    console.log("Search params: " + id)

    useEffect(() => {
        getProInfo()
    }, [auth])

    const getProInfo = async() => {
        let info = [];

        const {data, error} = await supabase
            .from("BeautyLynk_Pros")
            .select()
            .eq("email", `${auth.user.email}`)

        if(error){
            console.log(error)
        }
        if(data){
            // info.push(data)
            // console.log("Data info for user")
            // console.log(info)
            setProInfo(data)
            console.log("Data info for user")
            console.log(data)
            // console.log(data.id)
        }
    }


    // This method stores the file in a bucket 
    // Then it saves the url in the profile table 
    const handleSubmit = async (e) => {
        e.preventDefault()
        let localImageUrl = ""
        let name = proInfo.map(info => (info.firstName))

        console.log(name)


        if(image) {
            const {data, error} = await supabase.storage.from(`submissions/${auth.user.email}`).upload(`${Date.now()}_${image.name}`, image)

            if(error) {
                console.log(error)
                alert(error.message)
            }
            if(data) {
                setImageUrl(data.path)
                setFinish(true)
                // data.map( res => localImageUrl = res.key)
                localImageUrl = data.path
            console.log("Image has been uploaded",data)
            }

            const {data1, error1} = await supabase
                .from('BeautyLynk_Bookings')
                .update({ customerPhoto: `https://vfexusiotdfnjqfjkjfv.supabase.co/storage/v1/object/public/submissions/${auth.user.email}/${localImageUrl}` })
                .eq("id", id)
                .select()
            if(error1) {
                console.log(error1)
                alert(error1.message)
            }
            if(data1) {
                console.log("Booking has been updated",data1)
            }
        }

    }
    

    return (
        
        <Layout>
        <div className="uploadImages-layout">

            <div className="uploadImages-form-grid">
                <h1>BOOKING PHOTOS</h1> 
                {imageUrl ? <img src={`https://vfexusiotdfnjqfjkjfv.supabase.co/storage/v1/object/public/submissions/${auth.user.email}/${imageUrl}`} width={200} alt=""/> : <h3 className="uploadImage-form-preview">Image has not been uploaded</h3>}
                { finish ? 
                    <div>
                        <h4>{message && message}</h4>
                        <div className="form-group-bottom">
                            <a href="/dashboard" to="/dashboard">
                                <button className="uploadImages-form-button" type={"submit"} style={{width: "200px"}}> <h4>GO BACK TO DASHBOARD</h4> </button>
                            </a>
                        </div>
                    </div>
                    : <form onSubmit={handleSubmit}>
                        <div className="form-group-top">
                            <label className="choose-image-label" htmlFor="image">Choose a image: </label>
                            <input 
                                type="file" 
                                accept={"image/*;capture=camera"}
                                onChange={e => setImage(e.target.files[0])}
                            />
                        </div>

                        <div className="form-group-bottom">
                            <button className="uploadImages-form-button" type={"submit"}> <h2>UPLOAD</h2> </button>
                        </div>
                </form>
                }  
            </div>
        </div>
        </Layout>
    )
}

export default UploadImages