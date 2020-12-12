import React from 'react';
//import Gravatar from 'react-gravatar';
import md5 from 'md5';

const ChatGravatar = () => {
    let userEmail = localStorage.getItem('userEmail');
    var md5 = require('md5');
    var hashGravatar = md5(userEmail);
    var urlGravatar = "https://s.gravatar.com/avatar/"+hashGravatar+"?s=80";
    return urlGravatar;
}

export default ChatGravatar;