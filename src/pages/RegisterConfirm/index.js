import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useApi } from './../../service/api'
import './registerConfirm.css'

const RegisterConfirm = () => {

    const [confirmtoken, setConfirmToken] = useState("");
    const [resultMsg, setResultMsg] = useState(".");
    const navigate = useNavigate();
    const api = useApi();

    const confirmTokenRegister = async () => {

        if (confirmtoken !== "") {  
           const result = await api.registrationConfirm(confirmtoken) 
           
           if (result?.status === 200) {
            navigate('/');
           } else {
            setResultMsg(result?.code);
            console.log(result);
           }
        } else {
            setResultMsg("Informe o token.")
        }
    }

  return (
    <div className='registerConfirm'>
        <div className='registerConfirm-right'>
            <h1>Confirmação de Registro</h1>
            <div className='registerConfirm-logo'>
                <img
                    src='https://pngimg.com/uploads/deadpool/deadpool_PNG3.png'
                    alt='Login App' 
                />
            </div>
            <div className='registerConfirm-form'>
                <p style={{textAlign:"center", color: "rgb(173, 90, 90)", opacity:resultMsg==="."?0:1}}>{resultMsg}</p>
                Informe o código recebido por e-mail < br /><br />
                <div className='registerConfirm-input-confirmToken' >
                    <input
                        id='confirmToken'
                        type='text'
                        placeholder='' 
                        value={confirmtoken}
                        onChange={(e) => setConfirmToken(e.target.value)}
                    />
                </div>
            </div>
            <button id='btn_voltar' type='submit' onClick={() => confirmTokenRegister()} >
                Confirmar
            </button>

            <button id='btn_voltar' type='submit' onClick={() => navigate('/register')} >
                Voltar para registro
            </button>
        </div>
    </div>

  )
}

export default RegisterConfirm;
