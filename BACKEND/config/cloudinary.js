const cloudinary = require('cloudinary').v2

exports.cloudnairyconnect= ()=>{
    try {
        cloudinary.config({
            cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
            api_key : process.env.CLOUDINARY_API_KEY,
            api_secret : process.env.CLOUDINARY_API_SECRET
        })
        console.log("CD connected");

        
    } catch (error) {
        console.log("error connecting CD"+error)
    }
}