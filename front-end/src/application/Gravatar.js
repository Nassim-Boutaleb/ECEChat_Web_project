import React from 'react';
//import Gravatar from 'react-gravatar';
import md5 from 'md5';

const ChatGravatar = () => {
    let userEmail = localStorage.getItem('userEmail'); // a retirer
    // a partir de l'email du username du user qui a posté le msg (ou de son id plutot)
    // récupérer son mail
    var md5 = require('md5');
    var hashGravatar = md5(userEmail);
    var urlGravatar = "https://s.gravatar.com/avatar/"+hashGravatar+"?s=80";
    return urlGravatar;
}

export default ChatGravatar;