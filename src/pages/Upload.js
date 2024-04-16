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
        let name = proInfo.map(info => (info.full_name))

        console.log(name)

        // const url = `${supabase.supabaseUrl}/storage/v1/object/assignments/${auth.user.email}/${Date.now()}_${image.name}`;
        // const headers = supabase._getAuthHeaders();

        // const req = new XMLHttpRequest();
        // req.upload.onprogress = updateProgress;
        // req.upload.onload = transferComplete;
        // // You might want to also listen to onabort, onerror, ontimeout
        // req.open("POST", url);
        // for (const [key, value] of Object.entries(headers)) {
        // req.setRequestHeader(key, value);
        // }
        // req.send(image);

        // function updateProgress(e) {
        //     const pct = (e.loaded / e.total) * 100;
        //     console.log(`Upload progress = ${e.loaded} / ${e.total} = ${pct}`);
        // }
          
        // function transferComplete(e) {
        //     console.log("The transfer is complete.");
        //     alert("Image has been uploaded!")

        // }


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
        }

        const {data, error} = await supabase
            .from('BeautyLynk_Bookings')
            .update({ customerPhoto: `https://vfexusiotdfnjqfjkjfv.supabase.co/storage/v1/object/public/submissions/${auth.user.email}/${localImageUrl}` })
            .eq("id", id)
            .select()
        if(error) {
            console.log(error)
            alert(error.message)
        }
        if(data) {
            console.log("Booking has been updated",data)
        }

        // With upsert, if upload exist it updates it and if not it will insert a new row
        // const {data, error} = await supabase.from("BeautyLynk_Bookings").insert({
        //     uploader_id: auth.user.id,
        //     email: auth.user.email,
        //     uploader_name: name.toString(),
        //     url: `https://vfexusiotdfnjqfjkjfv.supabase.co/storage/v1/object/public/submissions/${auth.user.email}/${localImageUrl}`,
        //     embed_url: 'none',
        //     name: image.name
        // })

        // if(error){
        //     console.log(error)
        // }
        // if(data){
        //     setMessage("Image has been uploaded!")
        //     alert("Image has been uploaded!")
        // }

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