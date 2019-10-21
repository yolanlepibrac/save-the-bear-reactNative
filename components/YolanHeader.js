
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class YolanHeader extends Component {

  render(){
    return(
      <View style={{flexDirection:"row", height:this.props.height, justifyContent:"center"}}>
        <View  style={{marginTop:0, flex:1, height:this.props.height, zIndex: 1000, boxShadow: '0px 3px 2px 0 rgba(0, 0, 0, 0.5)', flexDirection: 'row',  alignItems: 'center',  justifyContent: 'center',  fontSize: 'calc(10px + 2vmin)', backgroundColor:this.props.backgroundColor}}>
          <Text style={{color: 'white',}}>{this.props.children}</Text>
        </View>
      </View>
    )
  }
}
