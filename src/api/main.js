
import { API_URL } from '@env'
import logoutAction from '../components/logoutAction';
import {Alert} from 'react-native';


/**
 *
 * @param deviceToken
 * @param props
 * @returns {Promise<{error}|void|{errors, status}|{error, fields}|any>}
 */
export const sendDeviceToken = async (deviceToken,props) => {
    let url = `tasks/api/task/set-device-token`;
    let result = await postForm(url,{
        deviceToken:deviceToken,
    },true,props);
    return result;

};
export const postForm = async (url,params,  json=true,props=false, method='POST',contentType=false) => {
    let token = props.authToken;

    let body = json ?  JSON.stringify(params) : params;

    if(contentType  && contentType.indexOf("application/x-www-form-urlencoded")!==-1){
        let formBody = [];
        for (let property in params) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        body = formBody;
    }

    let config = {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type':contentType ||  (json ? 'application/json' : 'multipart/form-data'),
        },
        body:body ,
    };


    if(token){
        config.headers['Authorization'] = 'Bearer '+token
    }

    try {
        const response  = await fetch(API_URL+url,config);

        if(response && (response.status===404 || response.status===504 )){
            return {error:'Not found'}
        }
        if(response.status===401){

            if(props.authToken){
                Alert.alert('You do not have credentials for this action!');
                return ;
            }

            if(props && props.setToken&& props.navigation){
                return logoutAction(props);
            }
            return {
                errors:'Unauthorized',
                status:401

            }
        }
        let responseJson = await response.json();

        if(response.status===422){
            return {
                error:'validation',
                fields:responseJson,
            }
        }

        return responseJson;
    }catch (e) {
        console.error(e);
        return false;
    }


};


export const get = (url, props=false) => {
    let token = props.authToken;
    let config = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    if(token){
        config.headers['Authorization'] = 'Bearer '+token
    }
    return fetch(API_URL+url,config)
        .then((response) => {

            if(response.status===404){
                return {
                    errors:'Not found',
                    status:404
                }
            }
            if(response.status===401||response.status===403){


                if(props && props.setToken&&
                    props.navigation){
                    return logoutAction(props);
                }
                return {
                    errors:'Unauthorized',
                    status:401

                }
            }
           return response.json()
        })
        .then((responseJson) => {

            if(!responseJson || responseJson.status===404){
                return {
                    errors:'Not found',
                    status:404
                }
            }
            if(responseJson && responseJson.status===401){
                if(props && props.setToken&&
                    props.navigation){
                    return logoutAction(props);
                }
                return {
                    errors:'Unauthorized',
                    status:401

                }
            }
            return responseJson;
        })
        .catch((error) => {

            console.error(error.status);
            console.error(error);
            return false;
        });
};






