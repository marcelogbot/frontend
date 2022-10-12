    import { createContext, useEffect, useState, useRef } from "react";
    import { useApi } from "../service/api";

    export const AuthContext = createContext({});

    export const AuthProvider = ({ children }) => {
        const [validToken, setValidToken] = useState(true);
        const [user, setUser] = useState();
        const [theme, setTheme] = useState(localStorage.getItem('theme'));
        const tempTokenValidate = useRef();
        const api = useApi();

        useEffect(() => { 
            tempTokenValidate.current();
        },[]);

        const setCredentials = (access_token, refresh_token, userStore) => {

            if (access_token && refresh_token) {
                
                try {
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);
                    if (userStore != null) {
                        localStorage.setItem('user', JSON.stringify(userStore))
                        setUser(userStore);
                    }
                    
                    setValidToken(true);

                    return;
                } catch (error) {
                    console.log("Erro:"+error)
                }
            }
            return "Sem credenciais!";
        }

        const getCredentials = () => {
            const credentials = {access_token: localStorage.getItem('access_token'), 
                                 refresh_token: localStorage.getItem('refresh_token'),
                                 user: localStorage.getItem('user')};

            return credentials;
        }

        const signout = () => {

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            api.signout();
            setUser(null);
            setValidToken(false);
        }

        const tokenValidate = async () => {
            const tokens = getCredentials();
            let isLoged = false;
            console.log("Refreshing token!");
            if (tokens.access_token !== null && tokens.refresh_token !== null) {
                var result = await api.validateToken(tokens.refresh_token);
                if (result?.status === 200) {
                    isLoged = true;
                    setCredentials(result.data.access_token, result.data.access_token);
                    if (user == null) {
                        var userTmp = getCredentials().user;
                        setUser(JSON.parse(userTmp));
                    };
                } else { 
                    console.log("Token inválido!");
                    isLoged = false;
                };
            } else {
                console.log("Sem token!");
                isLoged = false;
            };
            setValidToken(isLoged);
        }

        const switchTheme = async () => {
            let themeTmp = theme ==='dark'? 'light' : 'dark';
            setTheme(themeTmp);
            localStorage.setItem('theme', themeTmp);
        }

        tempTokenValidate.current = () => tokenValidate();

        return <AuthContext.Provider 
                    value={{user, validToken, theme, switchTheme, setCredentials, getCredentials, signout, tokenValidate }}
                >
                    {children}
                </AuthContext.Provider>;
    };

