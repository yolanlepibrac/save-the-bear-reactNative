
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




class ImageChooserComponentBear extends Component {

  constructor(props) {

    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      source : Constantes.imagesIce[Math.round(Math.random()*Constantes.imagesIce.length-1)],
    };
  }

  componentDidMount = () => {

    if(this.props.isDisplayed){
      Animated.timing(this.state.opacity,{toValue: 1,duration: 200,}).start();
    }else{
      Animated.timing(this.state.opacity,{toValue: 0,duration: 1000,}).start();
    }

  }

  componentWillUnmount = () => {

    Animated.timing(this.state.opacity,{toValue: 0,duration: 1000,}).start();

  }

  componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
    if (this.props.isDisplayed !== prevProps.isDisplayed) {

          if(this.props.isDisplayed){
            this.setState({
              source : Constantes.imagesIce[Math.round(Math.random()*Constantes.imagesIce.length-1)],
            })
            Animated.timing(
              this.state.opacity,
              {
                toValue: 1,
                duration: 200,
              }
            ).start();
          }else{
            Animated.timing(
              this.state.opacity,
              {
                toValue: 0,
                duration: 1000,
              }
            ).start();
          }
    }
  }



  render(){

    return(
      <View  style={{flexDirection:"row", justifyContent:"center",  flex:1 }}>
        <Animated.Image style={{ height:this.props.dimension, width:this.props.dimension,  opacity: this.state.opacity }} source={this.state.source?this.state.source:require("../assets/images/ice/0.png")}/>
      </View >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
  }
}

const ImageChooserBear = connect(mapStateToProps, mapDispatchToProps)(ImageChooserComponentBear);
export default ImageChooserBear;
