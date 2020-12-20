



// Recoit l'email de celui qui a envoyé le message
const ChatGravatar = (userEmail) => {
    // a partir de l'email du username du user qui a posté le msg (ou de son id plutot)
    // récupérer son mail
    var md5 = require('md5');
    var hashGravatar = md5(userEmail);
    var urlGravatar = "https://s.gravatar.com/avatar/"+hashGravatar+"?s=80&d=mp";
    return urlGravatar;
}

export default ChatGravatar;