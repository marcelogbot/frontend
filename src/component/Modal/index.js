import React from 'react';
import './modal.css';
import useAuth from '../../service/userAuth';

function Modal(props) {
    const { theme } = useAuth();
  return (
    <>
        <div className='modal' data-theme={theme} />
        <div style={{display:'flex', position:'absolute', height:'93vh', width:'100%', justifyContent:'center', alignItems:'center'}}>
            <div className='modal_box' data-theme={theme} >
                <p>{props.message}</p>
            </div>
        </div>
    </>
  )
}

export default Modal;

