import {v2 as cloudinary} from 'cloudinary' ;

const cloudinaryConfig = async () => {
    const cloudName =
        process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;

    cloudinary.config({
        cloud_name: cloudName,
        api_key:process.env.CLOUDINARY_API_KEY ,
        api_secret:process.env.CLOUDINARY_API_SECRET , 
    })
}

export default cloudinaryConfig ;