import React, {useState} from 'react';
import ImageContainer from './ImageContainer';
import ImageForm from './ImageForm';

const AppImageUpload = ({disabled,setpathOwn}) => {
    const [ newImage, setNewImage ] = useState([]);
    const handleNewImage = () => {
        setNewImage([...newImage, 'Nouvelle Image']);
    }
    return (
        <div>
            <ImageContainer newImage={newImage} />
            <ImageForm handleNewImage={handleNewImage} disabled={disabled} setpathOwn={setpathOwn} />
        </div>
    );
}

export default AppImageUpload;