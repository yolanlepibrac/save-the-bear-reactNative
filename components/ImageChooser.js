
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image } from 'react-native';
import { connect } from "react-redux";

import { changeAccountState } from "../redux/actions/index";

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (userData) => dispatch(changeAccountState(userData)),
  };
};


class ImageChooserComponent extends Component {

  constructor(props) {

    super(props);
    this.state = {
    };
  }

  pick = () => {
    this.props.pick(this.props.column, this.props.line)
  }
  componentDidMount = () => {
  }

  render(){
    return(
      <TouchableOpacity style={{flexDirection:"row", justifyContent:"center",  flex:1 }} onPress={this.pick}>
        <Image style={{ height:this.props.dimension, width:this.props.dimension, opacity:this.props.status?this.props.opacity :0.2}} source={this.props.backgroundImage}/>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
  }
}

const ImageChooser = connect(mapStateToProps, mapDispatchToProps)(ImageChooserComponent);
export default ImageChooser;
