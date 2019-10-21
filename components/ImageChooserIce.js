
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




class ImageChooserComponentIce extends Component {

  constructor(props) {

    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      source : require("../assets/images/ice/0.png"),
    };
  }

  componentDidMount = () => {
    this.setState({source :Constantes.imagesIce[Math.round(Math.random()*Constantes.imagesIce.length-1)]})
    if(this.props.isDisplayed){
      Animated.timing(this.state.opacity,{toValue: 1,duration: 200,}).start();
    }else{
      Animated.timing(this.state.opacity,{toValue: 0,duration: 1000,}).start();
    }

  }

  componentWillUnmount = () => {

  }

  componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
    if (this.props.i !== prevProps.i) {
      //this.setState({source :Constantes.imagesIce[Math.round(Math.random()*Constantes.imagesIce.length-1)]})
    }
  }



  render(){
    if(this.props.isDisplayed){
      return(
        <View  style={{flexDirection:"row", justifyContent:"center",  flex:1, position:"absolute",
        top:0,
        left:this.props.j*Constantes.screenWidth/Constantes.numberPinguin }}>
          <Image style={{ height:this.props.dimension, width:this.props.dimension,  opacity:this.props.isOut?0:1 }} source={this.props.backgroundImage}/>
        </View >
      )
    }else{
      return null
    }

  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
  }
}

const ImageChooserIce = connect(mapStateToProps, mapDispatchToProps)(ImageChooserComponentIce);
export default ImageChooserIce;
