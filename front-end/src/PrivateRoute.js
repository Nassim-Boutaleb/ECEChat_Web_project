// middleware : vérification des tokens pour protéger les routes React (protection front end)
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import api from './api';

const PrivateRoute = ({component: Component, ...rest}) => {
    return (

        // On fait un appel à l'API qui vérifie qu'il y a un token en local storage
        // et qu'il est tjrs valide.
        // Si oui la private route sera accessible, sinon elle sera redirigée vers la page de login
        // tokenExists() renvoie true si le token existe et est 
        <Route {...rest} render={props => (
            api.tokenExists() ?  <Component {...props} />: <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute;