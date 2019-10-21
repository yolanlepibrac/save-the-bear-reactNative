
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image, Animated, Easing} from 'react-native';
import { connect } from "react-redux";
import Constantes from "../utils/Constantes";

import { changeAccountState } from "../redux/actions/index";

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (userData) => dispatch(changeAccountState(userData)),
  };
};




class ImageChooserComponentPinguin extends Component {

  constructor(props) {

    super(props);
    this.state = {
      opacity: new Animated.Value(1),
      source : Constantes.imagesIce[Math.round(Math.random()*Constantes.imagesIce.length-1)],
      rotate: new Animated.Value(0),
      width: new Animated.Value(Constantes.screenWidth/Constantes.numberPinguin/2),
      top : new Animated.Value(this.props.top),
      left : new Animated.Value(this.props.left),
      alive:this.props.alive
    };
  }

  componentDidMount = () => {

  }

  componentWillUnmount = () => {


  }

  componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if(this.props.top !== prevProps.top || this.props.left !== prevProps.left || this.props.alive !== prevProps.alive){
    let delayStart = Math.random()*Constantes.durationMove/4;
    let delayEnd = Math.random()*Constantes.durationMove/4;
    let durationHalf = Constantes.durationMove-delayStart-delayEnd;
    let rotation = Math.random()<0.5?Math.random()*1/4/4:-Math.random()*1/4/4;

    /*
    Animated.timing(this.state.width , {
      toValue:Constantes.screenWidth/Constantes.numberPinguin/1.5,
      duration: durationHalf,
      delay: delayStart,
      easing:(t) => t
    }).start(() => {
      Animated.timing(this.state.width , {
        toValue:Constantes.screenWidth/Constantes.numberPinguin/2,
        duration: durationHalf,
        easing:(t) => t
      }).start();
    });
    */
    /*
    Animated.timing(this.state.rotate , {
      toValue:rotation,
      duration: durationHalf,
      delay: delayStart,
      easing:(t) => t
    }).start(() => {
      Animated.timing(this.state.rotate , {
        toValue:0,
        duration: durationHalf,
        easing:(t) => t
      }).start();
    });
    */

    if (this.props.alive !== prevProps.alive) {
      if(!this.props.alive){
        Animated.timing(this.state.opacity , {
          toValue:0,
          duration: 500,
          delay: delayStart,
          easing:(t) => t
        }).start();
      }else{
        Animated.timing(this.state.opacity , {
          toValue:1,
          duration: 0,
          delay: delayStart,
          easing:(t) => t
        }).start();
      }

    }


    if (this.props.top !== prevProps.top) {
      Animated.timing(this.state.top , {
        toValue:prevProps.top+(this.props.top-prevProps.top)/2,
        duration: durationHalf,
        delay: delayStart,
        easing:(t) => t
      }).start(() => {
        Animated.timing(this.state.top , {
          toValue:this.props.top,
          duration: durationHalf,
          easing:(t) => t
        }).start();
      });
    }

    if(this.props.left !== prevProps.left){
      Animated.timing(this.state.left , {
        toValue:prevProps.left+(this.props.left-prevProps.left)/2,
        duration: durationHalf,
        delay: delayStart,
        easing:(t) => t
      }).start(() => {
        Animated.timing(this.state.left , {
          toValue:this.props.left,
          duration: durationHalf,
          easing:(t) => t
        }).start();
      });
    }


  }



  }



  render(){

      const spin = this.state.rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      })

      return(
        <Animated.View  style={{flexDirection:"row", justifyContent:"center",  flex:1, position:"absolute",
        top:this.state.top,
        left:this.state.left}}>
            <Animated.Image style={{  height:Constantes.screenWidth/Constantes.numberPinguin/2, width:Constantes.screenWidth/Constantes.numberPinguin/2,  opacity: this.state.opacity }} source={require("../assets/images/pinguin/pinguin.png")}/>
        </Animated.View >
      )

  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
  }
}

const ImageChooserPinguin = connect(mapStateToProps, mapDispatchToProps)(ImageChooserComponentPinguin);
export default ImageChooserPinguin;
