import React, { useEffect, useState } from 'react';
import { useUserApi } from '../../service/userApi';
import useAuth from '../../service/userAuth';
import Loading from '../../assets/Loading';
import './addUser.css';
import Modal from '../../component/Modal';

const AddUser = (props) => {

    const userApi = useUserApi();
    const { getCredentials, tokenValidate, theme } = useAuth();
    const [msgResult, setMsgResult] = useState('');
    const [newUser,setNewUser] = useState({firstname:"",lastname:"", username: "", email:"", password:""});
    const [updatePassword, setUpdatePassword] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [msgModal, setMsgModal] = useState('');

    const handleForm = (event) => {
      if (msgResult !== "") {
        setMsgResult("");
      };
      setNewUser({...newUser, [event.target.name] : event.target.value});
    };

    const alterarSenha = () => {
        setNewUser({...newUser, password:""});
        setUpdatePassword(!updatePassword);
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
        if (newUser.password === "" && (props.user == null)) {
            camposVazios += "Senha, ";
            test = true;
        };
        if (test) {
            setMsgResult("Falta(m) preencher: "+ camposVazios);
            setShowLoading(false);
        } else {
          let result = null;
          
          if (props.user == null){
            result = await userApi.addUser(newUser, getCredentials().access_token);
          } else {
            result = await userApi.updateUser(newUser, getCredentials().access_token);
          }
            
          await tokenValidate();
      
          if (result?.status ===201 && result?.data?.userID != null && result?.data?.username !== "" && result?.data?.email !== "") {
            if (props.user == null) {
              limparForm();
              console.log("Usuário Salvo!")
              setMsgResult("Usuário Salvo!")
            } else {
              console.log("Usuário Alterado!")
              setMsgResult("Usuário Alterado!")
            }
            setShowLoading(false);            
          } else {
            if (result?.data?.username === "") {
              console.log("Email: ("+ result?.data?.email + ") já existe.")
              setMsgResult("Email: ("+ result?.data?.email + ") já existe.")
            } else if (result?.data?.email === "") {
              console.log("Usuário: ("+ result?.data?.username + ") já existe.")
              setMsgResult("Usuário: ("+ result?.data?.username + ") já existe.")
            } else if (result?.response?.status === 403) {
              setMsgModal('Usuário sem permissão!')
              setShowResult(true);
              setTimeout(() => {
                setShowResult(false);
                setMsgModal('')
              },1000)
            };
            setShowLoading(false);
          };
        };
    };
    
    const limparForm = () => {
      if (props.user != null) {
        setNewUser({firstname:"",lastname:"", username: props.user.username, email:"", password:""})
      } else {
        setNewUser({firstname:"",lastname:"", username: "", email:"", password:""})
      }
      setMsgResult("");
    };

    useEffect (() => {
      if (props.user != null) {
        setNewUser({userID: props.user.userID, firstname: props.user.firstname, lastname:props.user.lastname, username: props.user.username, email: props.user.email, password: ""});
      } else if (props.user == null) {
        setNewUser({firstname:"",lastname:"", username: "", email:"", password:""});
      };
    },[props.user]);

  return (
    <>
      {showResult && <Modal> <p>{msgModal}</p> </Modal>}
      <div className='addUser' data-theme={theme}>
        <h1>{(props.user != null)?"Alterar Cadastro de "+newUser.username:"Cadastro de Novo Usuário"}</h1>
        <div className='addUser_form'>
        {showLoading && <Loading style={{position:'absolute'}} /> }
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
            <input type='text' name='username' disabled={(props.user != null)?true:false} value={newUser.username} onChange={handleForm} placeholder='Digite seu nome de usuário.' />
            <span>Senha: </span>
            {(props.user != null) ?
              <button style={{backgroundColor:'var(--background-button)', border:'none', borderRadius:5, height:24, fontSize:14, color:'var(--text-primary)'}}
                  type='button' onClick={alterarSenha}>Alterar senha</button> : <input type='password' name='password' value={newUser.password} onChange={handleForm} placeholder='Digite sua senha para acessar o sistema.' />
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
