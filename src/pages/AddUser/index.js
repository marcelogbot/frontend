import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserApi } from '../../service/userApi';
import useAuth from '../../service/userAuth';
import Loading from '../../assets/Loading';
import './addUser.css';
import Header from './../../component/Header'

const AddUser = () => {

    const navigate = useNavigate();
    const { state } = useLocation();
    const userApi = useUserApi();
    const { getCredentials, tokenValidate, theme } = useAuth();
    const [msgResult, setMsgResult] = useState('');
    const [newUser,setNewUser] = useState({firstname:"",lastname:"", username: "", email:"", password:""});
    const [updatePassword, setUpdatePassword] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const handleForm = (event) => {
      if (msgResult !== "") {
        setMsgResult("");
      };
      setNewUser({...newUser, [event.target.name] : event.target.value});
    };

    const alterarSenha = () => {
      setNewUser({...newUser, password:""})
      setUpdatePassword(!updatePassword)
    }

    const saveSubmit = async (event) => {
      event.preventDefault();
      setShowLoading(true);
      setMsgResult('');
      let test = false;
        let camposVazios = "";
        
        if (newUser.firstname === "") {
            camposVazios = "Nome, ";
            test = true;
        };
        if (newUser.username === "") {
            camposVazios += "Usuário, ";
            test = true;
        };
        if (newUser.email === "") {
            camposVazios += "Email, ";
            test = true;
        };
        if (newUser.password === "" && state == null) {
            camposVazios += "Senha, ";
            test = true;
        };
        if (test) {
            setMsgResult("Falta(m) preencher: "+ camposVazios);
            setShowLoading(false);
        } else {
          let result = null;
          
          if (state == null){
            result = await userApi.addUser(newUser, getCredentials().access_token);
          } else {
            result = await userApi.updateUser(newUser, getCredentials().access_token);
          }
            
          await tokenValidate();
      
          if (result?.status ===201 && result?.data?.userID != null && result?.data?.username !== "" && result?.data?.email !== "") {
            if (state == null) {
              limparForm();
              console.log("Usuário Salvo!")
              setMsgResult("Usuário Salvo!")
            } else {
              console.log("Usuário Alterado!")
              setMsgResult("Usuário Alterado!")

            }
            
          } else {
            if (result?.data?.username === "") {
              console.log("Email: ("+ result?.data?.email + ") já existe.")
              setMsgResult("Email: ("+ result?.data?.email + ") já existe.")
            } else if (result?.data?.email === "") {
              console.log("Usuário: ("+ result?.data?.username + ") já existe.")
              setMsgResult("Usuário: ("+ result?.data?.username + ") já existe.")
            };
          };
          setShowLoading(false);
        };
    };
    
  const limparForm = () => {
    if (state != null) {
      setNewUser({firstname:"",lastname:"", username: state.username, email:"", password:""})
    } else {
      setNewUser({firstname:"",lastname:"", username: "", email:"", password:""})
    }
    setMsgResult("");
  };

  useEffect (() => {
    if(state != null) {
      setNewUser({userID: state.userID, firstname: state.firstname, lastname:state.lastname, username: state.username, email: state.email, password: ""});
    };
  },[state]);

  return (
    <>
      <Header />
      <div className='addUser' data-theme={theme}>
        <h1>{state!= null?"Alterar Cadastro de "+state.username:"Cadastro de Novo Usuário"}</h1>
        <div className='addUser_button'>
          <button onClick={() => navigate('/logedPage')}>Voltar</button>
        </div>
        <div className='addUser_form'>
        {showLoading &&
                      <>
                          <div style={{position:"absolute",
                                      height:"100%",
                                      width:"100%",
                                      backgroundColor:"#444444",
                                      opacity:0.7,
                                      zIndex:0 }}/>
                          <Loading />
                      </>   
                  }
          <h3>Preencha o formulário de cadastro</h3><br/>
          <h5 style={{color:theme==='dark'?'#FED8B1':'#FF8C00'}}>{msgResult}</h5>
          <form onSubmit={saveSubmit}>
            <span>Nome: </span>
            <input type='text' name='firstname' value={newUser.firstname} onChange={handleForm} placeholder='Digite seu primeiro.'/>
            <span>Sobrenome: </span>
            <input type='text' name='lastname' value={newUser.lastname} onChange={handleForm} placeholder='Digite seu sobrenome.'/>
            <span>Email: </span>
            <input type='email' name='email' value={newUser.email} onChange={handleForm} placeholder='Digite seu e-mail válido.' />
            <span>Usuário: </span>
            <input type='text' name='username' disabled={state != null?true:false} value={newUser.username} onChange={handleForm} placeholder='Digite seu nome de usuário.' />
            <span>Senha: </span>
            {state != null ?
              <button type='button' onClick={alterarSenha}>Alterar senha</button> : <input type='password' name='password' value={newUser.password} onChange={handleForm} placeholder='Digite sua senha para acessar o sistema.' />
            }
            {updatePassword ? <input type='password' name='password' value={newUser.password} onChange={handleForm} placeholder='Digite sua nova senha.' /> : ""}
            <div style={{display:'flex', alignItems:'flex-start'}}>
              <button 
                className='addUser_form_gravar' type='submit' >Gravar</button>
              <button 
                className='addUser_form_limpar' type='button' onClick={limparForm}>Limpar</button>
            </div>
          </form>
        </div>

      </div>
    </>
  ) 
}

export default AddUser;
