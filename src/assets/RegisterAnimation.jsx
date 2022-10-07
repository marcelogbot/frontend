import React from 'react';
import * as animationData from './register-user.json';
import Lottie from 'react-lottie';

export default class RegisterAnimation extends React.Component {
 
    constructor(props) {
      super(props);
      this.state = {isStopped: false, isPaused: false};
    }
   
    render() {
   
      const defaultOptions = {
        loop: false,
        autoplay: false, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
   
      return (<>
        <Lottie options={defaultOptions}
                height={this.props.height}
                width={this.props.width}
                isStopped={this.props.isStopped}
                isPaused={this.props.isPaused}
         />
      </>
    )}
  }