import React from 'react'
import moment from 'moment'
import ChatGravatar from '../Gravatar';

const styles = {
    messageFromMe: {
        margin: '.2rem',
        padding: '.2rem',
        border: '3px solid',
        borderRadius: '20px',
        margin: '15px',
        padding: '15px',
        // backgroundColor: '#66728E',
        ':hover': {
          backgroundColor: 'rgba(255,255,255,.2)',
        },
        backgroundColor: '#87CEFA',
        width: '50%',
        textAlign:'left',
        alignSelf: 'flex-end'
    },
    messageFromAnother: {
        margin: '.2rem',
        padding: '.2rem',
        border: '3px solid',
        borderRadius: '20px',
        margin: '15px',
        padding: '15px',
        // backgroundColor: '#66728E',
        ':hover': {
          backgroundColor: 'rgba(255,255,255,.2)',
        },
        backgroundColor: '#FF6347',
        width: '50%',
        textAlign:'left'
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
// de forme  {"author": "T9","content": "Bonjour","channelId": "cf"}

const Message = ({message,me}) => {
    
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
      
    const date = moment(message.creation).fromNow();

    return (
        <button style={me ? styles.messageFromMe: styles.messageFromAnother}>
            <p>
                <span>{message.author}</span> {/** A terme message aura seulement l'id, il faudra récupérer le username avec la fonction dédiée dan l'API */}
                <img src={ChatGravatar()}  width='30px'/> 
                {' '}
                <span>{date}</span>
            </p>
            
            <div>
                {Nl2br(message)}
            </div>
        </button>
    );
};

export default Message;