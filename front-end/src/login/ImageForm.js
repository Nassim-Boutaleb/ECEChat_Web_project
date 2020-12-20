import React, { useState, useEffect} from 'react';
import UploadAction  from './UploadAction';


const ImageForm = ({handleNewImage}) => {
    const [ image, setImages] = useState('');
    const [ preview, setPreview] = useState(false);

    const handleImageUpload= e => {
       setImages(e.target.files[0]);
       setPreview(true);
    }
    const clearImage = () => {
        setPreview(false);
        setImages('');
    }
    const handleSubmit = () => {
        UploadAction(image);
        setPreview(false);
        setImages(false);
        handleNewImage();
    }

    return (
        <div>
            {preview ?
            <>
                <button onClick={clearImage}>x</button>
                <h5> Image Preview </h5>
                <img src={URL.createObjectURL(image)} alt="preview of upload" height="90px"/>
                <button onClick={handleSubmit}>Upload!</button>
            </> :
            <>
                <input type="file" onChange={handleImageUpload} accept="png jpg jpeg" />
            </>
            }
        </div> 
    )
}

export default ImageForm;