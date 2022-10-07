import axios from "axios";
import qs from "qs";
const urlApi = "http://localhost:8080"

const api = axios.create({
    baseURL: urlApi
});

export const useApi = () => ({
    

    registration: async (firstname, lastname , username , email , password) => {
        
        try {
            var result = null;
            await api.post('/api/v1/registration', { firstname: firstname, lastname: lastname, username: username, email: email, password: password })
            .then(function (response) {
                result = response;
            })
            .catch(function (error) {
                console.log(error);
                result = error;
            });
            return result;

        } catch (error) {
            console.log(error);
            return error; 
        }
    },
    
    registrationConfirm: async (token) => {

        var result = null;
        try {
            await api.get('/api/v1/registration/confirm?token='+token)
            .then(function (response) {
                result = response;
            })
            .catch(function (error) {
                result = error;
                console.log(error);
            })

            return result;            
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    
    validateToken: async (rtoken) => {
        var result = null;
        
        const headers = { headers: { 'Authorization': `Bearer ${rtoken}`, 'Content-Type': 'application/json; charset=utf-8'}};
        try {
            await api.post('/api/token/refresh',null, headers)
            .then(function (response) {
                result = response;
            })
            .catch(function (error) {
                result = error;
                console.log('- '+error);
            })
            
        } catch (error) {
            console.log("erro: "+ error);
            return error;
        }

        return result;
    },

    signin: async (username, password) => {
        
        const config = {headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }}
        
        try {

            var res = null;
            await api.post('/api/login',qs.stringify({ username: username, password: password }), config)
                .then(function (response) {
                    res = response; 
                })
                .catch(function (error) {
                    console.log(error)
                    res = error;  
                });

            return res;
            
        } catch (error) {
            return error;
        }      
    }, 

    signout: async () => {
        console.log('Logout!')
        // try {
        //     await api.post('/logout')
        //         .then(function (response) {
        //             console.log(response);
        //         })
        //         .catch(function (error) {
        //             console.log(error);
        //         });
        // } catch (error) {
        //     console.log(error);
        // }
    }

})