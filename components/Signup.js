import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';




export default class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            securePassword : true,
            secureCPassword : true,
        }
    }


    signup = (event, context) => {
        this.props.signup(this.props.email, this.props.userName, this.props.imageProfil, this.props.password, this.props.cpassword)
    }

    onChangeUserName = (text) => {
        this.props.changeState("userName", text);
    }
    onChangeEmail = (text) => {
        this.props.changeState("email", text);
    }
    onChangePassword = (text) => {
        this.props.changeState("password", text);
    }
    onChangeCPassword = (text) => {
        this.props.changeState("cpassword", text);
    }


    toggleSecurePassword = () => {
      console.log(this.state.securePassword)
      this.setState({securePassword:!this.state.securePassword})
    }

    toggleSecureCPassword = () => {
      this.setState({secureCPassword:!this.state.secureCPassword})
    }

    quitlogin = () => {
      this.props.quit()
    }

    changeImageProfil = () => {
      this.props.changeImageProfil()
    }



    render() {
        return(
          <View style={{ padding:10, flex:1, width:"100%", flexDirection:"column",   height:"100%", justifyContent:"flex-start"}}>
            <View style={{flexDirection:"column", marginBottom:10, justifyContent:"flex-start"}}>
              <View style={{ height:50, paddingLeft:10,  width:"100%"}}>
                <View style={{flexDirection:"row", width:"100%", justifyContent:"flex-start", paddingBottom:5}}>
                  <TouchableOpacity onPress={this.changeImageProfil} style={{borderRadius:2, height:50, flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", backgroundColor:this.props.imageProfil?"rgba(200,200,200,0)":"rgba(101,150,255,1)"}}>
                  {this.props.imageProfil ?
                    <Image source={{uri:this.props.imageProfil}} style={{borderRadius:2, width:50, height:50}}/>
                    :
                    <Text style={{borderRadius:2, fontSize:10, fontWeight:"bold", width:50,  color:"white", alignItems:"center", justifyContent:"center", textAlign:"center"}}>PROFIL PICTURE</Text>
                  }
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.quitlogin} style={{position:"absolute", width:50, height:50, top:0, right:0, }}>
                  <Image style={{ width:50, height:50,}} source={require('../assets/images/quit.png')}/>
                </TouchableOpacity>
              </View>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10, color:"white"}}>Full name
              </Text>
              <TextInput onChangeText={text => this.onChangeUserName(text)} value={this.props.userName} autoCompleteType={"username"} autoFocus={true} clearButtonMode={'while-editing'} style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, borderColor:"white"}}
              onSubmitEditing={() => { this.secondTextInput.focus(); }}>
              </TextInput>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10, color:"white"}}>Email
              </Text>
              <TextInput onChangeText={text => this.onChangeEmail(text)} value={this.props.email} autoCompleteType={"email"} clearButtonMode={'while-editing'} style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, borderColor:"white"}}
              onSubmitEditing={() => { this.thirdTextInput.focus(); }}
              ref={(input) => { this.secondTextInput = input }}>
              </TextInput>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10, color:"white"}}>Password
              </Text>
              <View style={{flexDirection:"row", width:"100%"}}>
                <TextInput onChangeText={text => this.onChangePassword(text)} value={this.props.password} autoCompleteType={"password"}  style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, flex:1, width:"100%", borderColor:"white"}} secureTextEntry={this.state.securePassword}
                onSubmitEditing={() => { this.fourthTextInput.focus(); }}
                ref={(input) => { this.thirdTextInput = input }}>
                </TextInput >
                <TouchableOpacity onPress={this.toggleSecurePassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                  <Image style={{ width:35, height:35}} source={this.state.securePassword?require('../assets/images/oeil.png'):require('../assets/images/oeilSelect.png')}/>
                </TouchableOpacity>
              </View>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10, color:"white"}}>Password
              </Text>
              <View style={{flexDirection:"row", width:"100%"}} >
                <TextInput onChangeText={text => this.onChangeCPassword(text)} value={this.props.cpassword} autoCompleteType={"password"}  style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, flex:1, width:"100%", borderColor:"white"}} secureTextEntry={this.state.secureCPassword}
                ref={(input) => { this.fourthTextInput = input }}>
                </TextInput >
                <TouchableOpacity onPress={this.toggleSecureCPassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                  <Image style={{ width:35, height:35,}} source={this.state.secureCPassword?require('../assets/images/oeil.png'):require('../assets/images/oeilSelect.png')}/>
                </TouchableOpacity>
              </View>
            </View>


            <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
              <TouchableOpacity onPress={() => this.signup()}  style={{backgroundColor:(this.props.email!==""&&this.props.userName!==""&&this.props.password!==""&&this.props.cpassword!=="")?"rgba(101,150,255,1)":"rgba(200,200,200,1)", marginTop:5, marginBottom:5, borderRadius:2}}>
                <Text style={{color:"white", height:30, fontSize:15, fontWeight:"bold", borderRadius:2, marginTop:5, marginBottom:5, marginLeft:10, marginRight:10}}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>

        )
    }
}
