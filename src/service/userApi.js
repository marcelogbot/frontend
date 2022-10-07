import axios from "axios";
const urlApi = "http://localhost:8080"

const api = axios.create({
    baseURL: urlApi
});

export const useUserApi = () => ({

    addUser: async (newUser, token) => {

        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        var result = null;
        await api.post('/api/user/save', newUser, config)
        .then(function (response) {
            result = response;
        })
        .catch(function (error) {
            result = error;
        });

        return result;

    },

    updateUser: async (updateUser, token) => {

        const headers = { headers: { Authorization: `Bearer ${token}` }};

        var result = null;
        await api.put('/api/user/update', updateUser, headers)
        .then(function (response) {
            result = response;
        })
        .catch(function (error) {
            result = error;
        });

        return result;

    },

    getUser: async (username, token) => {
        
        var result = null;

        const headers = {headers: { 'Authorization': `Bearer ${token}` }};        
        await api.get('/api/user/'+username, headers)
        .then(function (response) {
            result = response;
        })
        .catch(function (error) {
            result = error;
        });

        return result;
    },
    
    listUsers: async (token) => {
        
        var result = null;

        const headers = {headers: { "Authorization": `Bearer ${token}` }};        
        await api.get('/api/users',headers)
        .then(function (response) {
            result = response;
        })
        .catch(function (error) {
            result = error;
        })

        return result;
    },

    deleteUser: async (username, token) => {
        var result = null;
        const config = { headers: { Authorization: `Bearer ${token}` },
                         data: { username: username }};
        
        await api.delete('/api/user/delete', config)
        .then(function (response) {
            result = response;
        })
        .catch(function (error) {
            console.log(error);
            result = error
        });
        return result;
    },

    enableUser: async (username, token) => {
        var result = null;
        const headers = { headers: { Authorization: `Bearer ${token}` }};
        
        await api.put('/api/user/enable', {username:username}, headers)
        .then(function (response) {
            result = response;
        })
        .catch(function (error) {
            console.log(error);
            result = error
        });
        return result;
    }

})