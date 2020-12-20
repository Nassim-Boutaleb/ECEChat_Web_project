import React, { useState, useEffect} from 'react';
import axios from 'axios';
//import {API_URL} from './url';

const ImageContainer = ({newImage}) => {
    const [ images, setImages] = useState([]);
    const [ fallback, setFallback] = useState('');
    const url = 'http://localhost:3001' ;
    const getImages = async () => {
        try {
            //const res = await axios.get(API_URL + 'api/images');
            const res = await axios.get(`${url}/Image`);
            if (!res.data.files){
                setFallback(res.data.msg);
                return;
            } else {
                setImages(res.data.files);
            }
        }catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getImages();
    }, [newImage]);

    const configureImage = image => {
        //return API_URl + image;
        return image;
    }
        console.log(images);

    return (
        <div>
            {images.length > 0 ?
            (
                images.map(image => (
                    <img src={configureImage(image)} key={image} alt={image} width="200"
                    height="200" className="image" />
                ))
            )
            :
            <>
                <h1>
                    {fallback}
                </h1>
                <hr />
                <h3>Upload images here</h3>
            </>
            }
        </div> 
    )
}
export default ImageContainer;