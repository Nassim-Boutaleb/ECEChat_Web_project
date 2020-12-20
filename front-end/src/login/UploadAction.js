import axios from 'axios';
//import { API_URL } from './url';

const uploadAction = async (image) => {
    const url = 'http://localhost:3001' ;
    const fd = new FormData();
    fd.append('image', image);
    const config = {
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    }
    try {
        //const res = await axios.post(API_URL + 'api/images', fd, config);
        const res = await axios.post(`${url}/Image`, fd, config);
        return res.data;

    } catch (err){
        console.log(err);
    }
}

export default uploadAction;