import React from 'react';
import './modal.css';
import useAuth from '../../service/userAuth';

function Modal(props) {
    const { theme } = useAuth();
  return (
    <>
        <div className='modal' data-theme={theme} />
        <div style={{display:'flex', position:'absolute', height:'80vh', width:'97.7vw', justifyContent:'center', alignItems:'center'}}>
            <div className='modal_box' data-theme={theme} >
                {props.children}
            </div>
        </div>
    </>
  )
}

export default Modal;

