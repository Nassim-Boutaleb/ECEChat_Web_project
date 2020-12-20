import React, {useState} from 'react';
import ImageContainer from './ImageContainer';
import ImageForm from './ImageForm';

const AppImageUpload = () => {
    const [ newImage, setNewImage ] = useState([]);
    const handleNewImage = () => {
        setNewImage([...newImage, 'Nouvelle Image']);
    }
    return (
        <div>
            <ImageContainer newImage={newImage} />
            <ImageForm handleNewImage={handleNewImage} />
        </div>
    );
}

export default AppImageUpload;