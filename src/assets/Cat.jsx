import React from 'react';
import Lottie from 'react-lottie';
import * as animationData from './cat-playing.json'

export default class Cat extends React.Component {
 
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
   
      return <div>
        <Lottie options={defaultOptions}
                height={100}
                width={250}
                isStopped={this.props.isStopped}
                isPaused={this.props.isPaused}/>
      </div>
    }
  }