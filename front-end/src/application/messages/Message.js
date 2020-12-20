import React from 'react'
import moment from 'moment'
import ChatGravatar from '../Gravatar';
import MessageManager from './MessageManager'


const styles = {
    messageFromMe: {
        border: '3px solid',
        borderRadius: '20px',
        margin: '15px',
        padding: '15px',
        // backgroundColor: '#66728E',
        ':hover': {
          backgroundColor: 'rgba(255,255,255,.2)',
        },
        backgroundColor: '#87CEFA',
        width: '100%',
        textAlign:'left',
        //marginLeft: 'auto',
        order:'3'
    },
    messageFromAnother: {
        border: '3px solid',
        borderRadius: '20px',
        margin: '15px',
        padding: '15px',
        // backgroundColor: '#66728E',
        ':hover': {
          backgroundColor: 'rgba(255,255,255,.2)',
        },
        backgroundColor: '#FF6347',
        width: '100%',
        textAlign:'left',
        order:'1'
    },
    messageDeleted: {
        border: '3px solid',
        borderRadius: '20px',
        margin: '15px',
        padding: '15px',
        ':hover': {
          backgroundColor: 'rgba(255,255,255,.2)',
        },
        backgroundColor: '#696969',
        width: '100%',
        textAlign:'left',
        fontStyle: 'italic',
        //marginLeft: 'auto',
        order:'3'
    },
    wrapperFromMe: {
        alignSelf:'flex-end',
        width:'50%',
        display: 'flex'
    },
    wrapperFromAnother: {
        width:'50%',
        display:'flex'
    },
    icon : {
        order:'2'
    },
    
};

// fonction nl2br gestion des sauts de ligne
const Nl2br = message => (
    // gestion des sauts de ligne (nl2br)
    message.content
    .split(/(\n +\n)/)
    .filter( el => el.trim() )
    .map( el => <p key={el} >{el}</p>)
);

// Composant message qui contient un message individuel. Une prop = le message à afficher
// de forme  {"author":"47","authorUsername":"T9","authorEmail":"test@mail.com","content":"C3 1","creation":1608381214566,"channelId":"3b","creationForId":"1608381214579429"}

const Message = ({message,me,index,handleDeleteMessage,isCreator,handleModifyMessage,channel,userConnected}) => {
    
    moment.locale('fr', {
        months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact : true,
        weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Aujourd’hui à] LT',
            nextDay : '[Demain à] LT',
            nextWeek : 'dddd [à] LT',
            lastDay : '[Hier à] LT',
            lastWeek : 'dddd [dernier à] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dans %s',
            past : 'il y a %s',
            s : 'quelques secondes',
            m : 'une minute',
            mm : '%d minutes',
            h : 'une heure',
            hh : '%d heures',
            d : 'un jour',
            dd : '%d jours',
            M : 'un mois',
            MM : '%d mois',
            y : 'un an',
            yy : '%d ans'
        },
        dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
        ordinal : function (number) {
            return number + (number === 1 ? 'er' : 'e');
        },
        meridiemParse : /PD|MD/,
        isPM : function (input) {
            return input.charAt(0) === 'M';
        },
        // In case the meridiem units are not separated around 12, then implement
        // this function (look at locale/id.js for an example).
        // meridiemHour : function (hour, meridiem) {
        //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
        // },
        meridiem : function (hours, minutes, isLower) {
            return hours < 12 ? 'PD' : 'MD';
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // Used to determine first week of the year.
        }
    });
      
    const date =moment(message.creation).fromNow(); //new Date(message.creation).toLocaleString("fr-FR");
    
    const dateMod = message.lastModified !== 'never' ? moment(message.creation).fromNow() : null;
    const alive = message.alive ;  // message supprimé ?

    let menuMessageDisplay = me ? true : false ;  // afficher le menu de gestion du message si je suis l'auteur du message
    if (isCreator === 'true') {  // si je suis le créateur du channel, j'ai tt pouvoir !!
        menuMessageDisplay = true;
    }
    if (message.alive === false) {
        menuMessageDisplay = false ;  // si message supprimé: on le resupprime pas ni on le modifie
    }
    
    return (
        <div style={me ? styles.wrapperFromMe : styles.wrapperFromAnother}>
            <div style={!alive ? styles.messageDeleted : me ? styles.messageFromMe : styles.messageFromAnother}>
                <p>
                    <span>{message.authorUsername}</span>
                    {
                        message.avatarPreference === 'gravatarRd' &&
                        <img src={ChatGravatar(message.authorEmail)}  width='30px' alt="Avatar"/> 
                    }
                    {
                        message.avatarPreference === 'defaultRd' &&
                        <img src={require(`./../../login${message.profileImageNoGravatar}.jpg`) } width='30px' alt="Avatar"/>
                    }
                    {
                        message.avatarPreference === 'uploadOwnRd' &&
                        <img src={require(`./../../Images/${message.profileImageNoGravatar}`) } width='30px' alt="Avatar"/>
                    }
                    {' '}
                    <span>{date}</span>
                    {message.lastModified !== 'never' && <p>Modifié {dateMod}</p> }
                </p>
                
                <div>
                    {Nl2br(message)}
                </div>
            </div>
            { menuMessageDisplay &&
                <MessageManager 
                    index={index} 
                    message={message} 
                    handleDeleteMessage={handleDeleteMessage}
                    handleModifyMessage={handleModifyMessage}
                    me={me}
                    channel={channel}
                />
            }
            
        </div>
    );
};

export default Message;