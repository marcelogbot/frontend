import React from 'react';
import Lottie from 'react-lottie';
import * as animationData from './loading-animation-blue.json'

export default class Loading extends React.Component {
 
    constructor(props) {
      super(props);
      this.state = {isStopped: false, isPaused: false};
    }
   
    render() {
   
      const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
      };
   
      return (
        <>
          <div style={{display:'flex',
                      position:"absolute",
                      height:"80vh",
                      width:"97.7vw",
                      backgroundColor:"#444444",
                      opacity:0.7,
                      zIndex:0 }}/>

          <div style={{display:'flex', position:"absolute", width:"97.7vw", justifyContent:'center', alignItems:'center'}}>
            <Lottie options={defaultOptions}
                height={200}
                width={200}
                isStopped={this.props.isStopped}
                isPaused={this.props.isPaused}/>
          </div>
        </>
      )}
  }