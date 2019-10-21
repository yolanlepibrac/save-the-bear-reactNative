import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Image, Keyboard } from 'react-native';

import API from '../utils/API';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password: "",
            displayLoading:false,
            securePassword : true,
        }
    }

  send = () => {
      if(this.props.email.length === 0){
          return;
      }
      if(this.props.password.length === 0){
          return;
      }
      Keyboard.dismiss()
      this.props.login(this.props.email, this.props.password)

  }

  onChangeEmail = (text) => {
    this.props.changeState("email", text);
  }

  onChangePassword = (text) => {
    this.props.changeState("password", text);
  }


  toggleSecurePassword = () => {
    console.log(this.state.securePassword)
    this.setState({securePassword:!this.state.securePassword})
  }

  quitlogin = () => {
    this.props.quit()
  }


    render() {
        return(
            <View style={{ padding:10, flex:1, width:"100%", flexDirection:"column",   height:"100%", justifyContent:"flex-start"}}>
              <View style={{flexDirection:"column", marginBottom:10, justifyContent:"flex-start"}}>
                <View style={{height:50, paddingLeft:10,  width:"100%"}}>
                  <TouchableOpacity onPress={this.quitlogin} style={{position:"absolute", width:50, height:50, top:0, right:0, }}>
                    <Image style={{ width:50, height:50,}} source={require('../assets/images/quit.png')}/>
                  </TouchableOpacity>
                </View>
                <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10, color:"white"}}>Email
                </Text>
                <TextInput onChangeText={text => this.onChangeEmail(text)} value={this.props.email} autoCompleteType={"email"} autoFocus={true} clearButtonMode={'while-editing'} style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, borderColor:"white"}}
                onSubmitEditing={() => { this.secondTextInput.focus(); }}>
                </TextInput>
                <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10, color:"white"}}>Password
                </Text>
                <View style={{flexDirection:"row", width:"100%"}}>
                  <TextInput onChangeText={text => this.onChangePassword(text)} value={this.props.password} autoCompleteType={"password"}
                  clearButtonMode={'while-editing'} style={{flex:1, borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, borderColor:"white"}} secureTextEntry={this.state.securePassword}
                  ref={(input) => { this.secondTextInput = input }}>
                  </TextInput >
                  <TouchableOpacity onPress={this.toggleSecurePassword} style={{position:"absolute", width:35, height:35, top:0, right:20, }}>
                    <Image style={{ width:35, height:35}} source={this.state.securePassword?require('../assets/images/oeil.png'):require('../assets/images/oeilSelect.png')}/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                <TouchableOpacity onPress={() => this.send()}  style={{backgroundColor:(this.props.email!==""&&this.props.password!=="")?"rgba(101,150,255,1)":"rgba(200,200,200,1)", marginTop:5, marginBottom:5, borderRadius:2}}>
                  <Text style={{color:"white", height:30, fontSize:15, fontWeight:"bold", borderRadius:2, marginTop:5, marginBottom:5, marginLeft:10, marginRight:10}}>CONNEXION</Text>
                </TouchableOpacity>
              </View>
            </View>
        )
    }
}
