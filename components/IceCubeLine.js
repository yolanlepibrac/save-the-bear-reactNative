
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




class IceCubeLineComponent extends Component {

  constructor(props) {

    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      source : require("../assets/images/ice/0.png"),
      sources : [],
    };
  }

  componentDidMount = () => {
    this.setBackgroundImages()
  }

  setBackgroundImages = () => {
    let sources = []
    for(i=0;i<this.props.ices.length;i++){
      sources[i] = Constantes.imagesIce[Math.trunc(Math.random()*Constantes.imagesIce.length)]
    }
    this.setState({ sources : sources })
  }

  componentWillUnmount = () => {

  }

  componentDidUpdate(prevProps) {
    if (this.props.needUpdate !== prevProps.needUpdate) {
      this.setBackgroundImages()
    }
  }



  render(){

      return(
        <View key={this.props.key} style={{flexDirection:"row", position:"absolute",
        top:0, left:0, backgroundColor:"red"}}>
          {this.props.ices.map((isIce, index)=> {
            if(isIce){
              return (
                <View style={{flexDirection:"row", justifyContent:"center",  flex:1, position:"absolute",top:0,
                left:index*Constantes.screenWidth/Constantes.numberPinguin }} key={index}>
                  <Image style={{ height:Constantes.screenWidth/Constantes.numberPinguin, width:Constantes.screenWidth/Constantes.numberPinguin,
                    opacity:1 }} source={this.state.sources[index]}/>
                </View >
              )
            }
          })}
      </View>)

  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
  }
}

const IceCubeLine = connect(mapStateToProps, mapDispatchToProps)(IceCubeLineComponent);
export default IceCubeLine;
