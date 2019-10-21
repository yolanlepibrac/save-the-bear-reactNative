import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { connect } from "react-redux";


function mapDispatchToProps(dispatch) {
  return {
  };
};


class ItemEditProfileComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value:this.props.value,
    };
  }

  onChange = (text) => {
    this.props.onChange(this.props.keyForState, text)
    this.setState({
      value : text
    })
  }

  toggleModifie = () => {
    this.props.toggleModifie()
  }

  validate = () => {
    this.props.validate()
  }


  render(){
    return(
      <View style={{flexDirection:"column", width:"100%", flex:1}}>
        <Text style={{width: "100%", textAlign:"left", fontSize:13, color:"white"}}>{this.props.placeHolder}</Text>
        <View style={{flexDirection:"row", width:"100%", flex:1, justifyContent:"space-between", alignItems:"center"}}>
          <View style={{flex:1, flexDirection: 'column',  marginBottom:10, marginTop:5, fontSize:15, justifyContent:"flex-start"}}>
            {this.props.changePossible ?
              <TextInput autoCompleteType={this.props.autoCompleteType} type="text" style={{ height:30*this.props.heightSize, textAlign:"left", display: 'flex', flexDirection: 'column', justifyContent:"center", borderRadius:3,  color:"rgba(50,50,50,1)", borderWidth:1, borderStyle:"solid", borderColor:"rgba(100,100,100,1)",width:"100%", backgroundColor:"rgba(245,245,245,1)", padding:0, margin:0, paddingLeft:10}} value={this.state.value} onChangeText={(text) => this.onChange(text)} autoCapitalize={this.props.autoCapitalize}/>
              :
              <View  style={{width:"100%", height:30*this.props.heightSize, textAlign:"left", display: 'flex', flexDirection: 'column', justifyContent:"center", borderRadius:3,  color:"black", borderWidth:0, borderStyle:"solid", borderColor:"rgba(150,150,150,1)",width:"100%", backgroundColor:"rgba(235,235,235,1)", paddingLeft:10}}>
                <Text style={{color:"rgba(150,150,150,1)"}}>{this.props.value}
                </Text>
              </View>
            }
          </View>
          <View style={{flex:1, flexDirection: 'column',  marginBottom:10, marginTop:5, fontSize:15, justifyContent:"flex-start"}}>
            {!this.props.changePossible ?
              <TouchableOpacity onPress={this.toggleModifie} style={{width:75, height:30, borderRadius:2, fontSize:15, backgroundColor:"rgba(100,150,255,1)",justifyContent:"center", alignItems:"center", marginRight:10}}>
                <Text style={{color:"white", fontWeight:"bold"}}>MODIFIE
                </Text>
              </TouchableOpacity>
              :
              <View style={{flexDirection:"row", width:"100%"}}>
                <TouchableOpacity onPress={this.validate} style={{width:75, height:30, borderRadius:2, fontSize:15, backgroundColor:"rgba(100,150,255,1)",justifyContent:"center", alignItems:"center", marginRight:10}}>
                  <Text style={{color:"white", fontWeight:"bold"}}>VALIDATE
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.toggleModifie} style={{width:75, height:30, borderRadius:2, fontSize:15, backgroundColor:"rgba(100,150,255,1)",justifyContent:"center", alignItems:"center", marginRight:10}}>
                  <Text style={{color:"white", fontWeight:"bold"}}>CANCEL
                  </Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        </View>
      </View>
    )

    }
  }

  const mapStateToProps = (state) => {
    return {
      accountState:state.account.accountStateRedux,
    }
  }

  const ItemEditProfile = connect(mapStateToProps, mapDispatchToProps)(ItemEditProfileComponent);
  export default ItemEditProfile;
