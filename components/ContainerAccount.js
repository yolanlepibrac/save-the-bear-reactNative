import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, Image, Button, TextInput, Platform, DatePickerIOS, DatePickerAndroid, Alert} from 'react-native';
import { connect } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import Constantes from "../utils/Constantes";
import NoAccount from './NoAccount';

import AsyncStorage from '@react-native-community/async-storage';

import ItemEditProfile from "./ItemEditProfile"
import API from "../utils/API"

import { resetAccountState } from "../redux/actions/index";
import { changeAccountState } from "../redux/actions/index";

function mapDispatchToProps(dispatch) {
  return {
    resetAccountState: () => dispatch(resetAccountState()),
    changeAccountState: (account) => dispatch(changeAccountState(account))
  };
};

const Months = [  'janvier',  'fevrier',  'mars',  'avril',  'mai',  'juin',  'juillet',  'aout',  'septembre',  'octobre',  'novembre',  'decembre']
const Days = [  31,  28,  31,  30,  31,  30,  31,  31,  30,  31,  30,  31]
const heightItem = 100;
const borderWidth = 4;
const coloWin = "rgba(87,201,108)"
const coloLoose = "rgba(255,82,82)"
var listeOfDate = []
var currentYear = new Date().getFullYear()
for(var i=currentYear;i>1930;i--){
  listeOfDate.push(i)
}


class AccountContainerComponent extends React.Component {

    constructor(props) {
    super(props);
    this.state = {
      displayLoading:false,
      imageProfil: this.props.accountState.account.imageProfil,
      userName:this.props.accountState.account.userName,
      email:this.props.accountState.account.email,
      fill:10,
      oldPassword : "",
      newCPassword : "",
      newPassword : "",
      changePasswordOpen : false,
      secureOldPassword : true,
      secureNewCPassword : true,
      secureNewPassword : true,
      date: this.props.accountState.account.birth ? this.props.accountState.account.birth :new Date(),
      connected:this.props.accountState.account.connected,
    };
  }


  editImageProfil = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
      });
      if (!result.cancelled) {
        const response = await ImageManipulator.manipulateAsync(result.uri, [], { base64: true })
        let image64 = "data:image/jpeg;base64,"+ response.base64;
        this.setState({ imageProfil:image64 });
        API.setUserInfo({imageProfil:image64}, this.props.accountState.account.id).then((data) => {
          console.log(data.data.user.imageProfil)
          this.props.changeAccountState(data.data.user);
        })
      }
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to change your account ! Don\'t worry, we will never use it againt you');
      }
    }
  }


  onInputChange = (key, value) => {
    if(key === "userName"){
      value = value.toLowerCase()
    }
    this.setState({[key] : value})
  }

  toggleChangeAccountState = () => {
    this.setState({
      toggleChangeAccountState : !this.state.toggleChangeAccountState
    })
  }


  logout = () => {
    this.props.resetAccountState()
    this.props.navigation.navigate("NoAccount", {email:"", displayLoading:false})
    this.quitLog()
  }

  quitLog = async () => {
    console.log("logout")
    try {
      await AsyncStorage.removeItem('email');
    } catch (error) {
      console.log(error.message);
    }
  }

  changePassword = () => {
    this.setState({changePasswordOpen : !this.state.changePasswordOpen})
  }

  ValidateChangePassword = () => {
    this.setState({displayLoading:true})
    if(this.state.oldPassword === "" || this.state.oldPassword === undefined || this.state.newPassword !== this.state.newCPassword || this.state.newPassword === ""){
      this._showAlert("Error", "Password and Confirm password are different or invalid")
      this.setState({displayLoading:false})
      return
    }else{
      API.updatePassword(this.props.accountState.account.id, this.state.oldPassword, this.state.newPassword).then((data) => {
        console.log(data)
        if(data.status !== 200){
          this._showAlert("Error","Impossibe to change your password")
        }else{
          this._showAlert("OK", "Password have been change")
          this.setState({changePasswordOpen : false})
        }
        this.setState({displayLoading:false})
      }).catch(error=>{
        console.log(error)
        this._showAlert("Error", "Error : Impossibe to change your password")
        this.setState({displayLoading:false})
      })
    }
  }

  _showAlert = (title, errorMessage) => {
    Alert.alert(
      title,
      errorMessage,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }

  onChangeOldPassword = (text) => {
      this.setState({
        oldPassword : text
      });
  }
  onChangeNewCPassword = (text) => {
      this.setState({
        newCPassword : text
      });
  }
  onChangeNewPassword = (text) => {
      this.setState({
        newPassword : text
      });
  }

  toggleSecureOldPassword = () => {
    console.log(this.state.securePassword)
    this.setState({secureOldPassword:!this.state.secureOldPassword})
  }

  toggleSecureNewCPassword = () => {
    this.setState({secureNewCPassword:!this.state.secureNewCPassword})
  }

  toggleSecureNewPassword = () => {
    this.setState({secureNewPassword:!this.state.secureNewPassword})
  }

  toggleEditUserName = () => {
    this.setState({editUserName : !this.state.editUserName})
  }

  toggleEditEmail = () => {
    this.setState({editEmail : !this.state.editEmail})
  }

  setNewUserName = () => {
    this.setState({displayLoading:true})
    console.log("new")
    console.log(this.state.userName)
    API.setUserInfo({userName:this.state.userName}, this.props.accountState.account.id).then((data) => {
      console.log(data.data.user.userName)
      this.props.changeAccountState(data.data.user);
      this.setState({displayLoading:false})
      this.toggleEditUserName()
    })
  }

  setNewEmail = () => {
    if(this.props.accountState.account.email === this.state.email){
      this.toggleEditEmail()
      return;
    }
    this.setState({displayLoading:true})
    API.updateEmail(this.props.accountState.account.email, this.state.email).then((data) => {
      if(data.status === 204){
        this._showAlert("Error", "This email is already used")
        this.setState({displayLoading:false, email:this.props.accountState.account.email})
        return;
      }
      console.log(data.data.user.email)
      this.props.changeAccountState(data.data.user);
      this.toggleEditEmail()
      this.setState({displayLoading:false})
    }).catch((error)=> {
      console.log(error)
      this._showAlert("Error", "Impossible to change email")
      this.setState({displayLoading:false, email:this.props.accountState.account.email})
    })
  }

  _showAlert = (title, errorMessage) => {
    Alert.alert(
      title,
      errorMessage,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }

  update = () => {
    console.log(this.props.accountState.account.connected)
    this.forceUpdate()
  }

  connect = () => {
    this.setState({
      connected:true,
      imageProfil: this.props.accountState.account.imageProfil,
      userName:this.props.accountState.account.userName,
      email:this.props.accountState.account.email,
    })
  }


  render(){
    if(this.state.displayLoading){
      return(
        <View style={{flex:1, width:"100%", height:Constantes.screenHeight, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
          <ActivityIndicator color={"rgba(101,150,255,1)"} size={"large"}></ActivityIndicator>
        </View>
      )
    }else{
        return(
          <View style={{flex:1, backgroundColor:"rgba(154,207,255,1)"}} >
            {!this.state.connected === true ?
              <View style={{width:"100%", height:"100%"}}>
                <NoAccount connectedWitouthAccount={true} connect={this.connect}/>
              </View>
              :
              <View style={{flex:1, backgroundColor:"rgba(154,207,255,1)"}}>

              {this.state.changePasswordOpen ?
                <View style={{flexDirection:"column",height:"100%", width:"100%", position:"absolute", top:0, left:0, flex:1, padding:10}}>
                  <View style={{flexDirection:"column",  width:"100%"}}>
                    <View style={{flexDirection:"row", width:"100%", justifyContent:"flex-end"}}>
                      <TouchableOpacity onPress={this.changePassword} style={{width:75, height:35, borderRadius:2, fontSize:15, marginTop:10, marginBottom:10, backgroundColor:"rgba(100,150,255,1)",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{color:"white", fontWeight:"bold"}}>CANCEL</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{height:30, fontSize:15,  marginLeft:10, color:"white"}}>Old Password
                    </Text>
                    <View style={{flexDirection:"row", width:"100%",  height:50}}>
                      <TextInput onChangeText={text => this.onChangeOldPassword(text)} value={this.state.oldPassword} autoCompleteType={"password"}  style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, flex:1, width:"100%", color:"white", borderColor:"white" }} secureTextEntry={this.state.secureOldPassword}>
                      </TextInput >
                      <TouchableOpacity onPress={this.toggleSecureOldPassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                        <Image style={{ width:35, height:35}} source={this.state.secureOldPassword?require('../assets/images/oeil.png'):require('../assets/images/oeilSelect.png')}/>
                      </TouchableOpacity>
                    </View>
                    <Text style={{height:30, fontSize:15,  marginLeft:10, color:"white"}}>Confirm Old Password
                    </Text>
                    <View style={{flexDirection:"row", width:"100%",  height:50}}>
                      <TextInput onChangeText={text => this.onChangeNewCPassword(text)} value={this.state.newCPassword} autoCompleteType={"password"}  style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, flex:1, width:"100%", color:"white", borderColor:"white" }} secureTextEntry={this.state.secureNewCPassword}>
                      </TextInput >
                      <TouchableOpacity onPress={this.toggleSecureNewCPassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                        <Image style={{ width:35, height:35,}} source={this.state.secureNewCPassword?require('../assets/images/oeil.png'):require('../assets/images/oeilSelect.png')}/>
                      </TouchableOpacity>
                    </View>
                    <Text style={{height:30, fontSize:15,  marginLeft:10, color:"white"}}>New Password
                    </Text>
                    <View style={{flexDirection:"row", width:"100%",  height:50}}>
                      <TextInput onChangeText={text => this.onChangeNewPassword(text)} value={this.state.newPassword} autoCompleteType={"password"}  style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, flex:1, width:"100%", color:"white", borderColor:"white" }} secureTextEntry={this.state.secureNewPassword}>
                      </TextInput >
                      <TouchableOpacity onPress={this.toggleSecureNewPassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                        <Image style={{ width:35, height:35,}} source={this.state.secureNewPassword?require('../assets/images/oeil.png'):require('../assets/images/oeilSelect.png')}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection:"row", width:"100%", justifyContent:"center", alignItems:"center", height:50}}>
                      <TouchableOpacity onPress={this.ValidateChangePassword} style={{backgroundColor:"rgba(100,150,255,1)", borderRadius:2, width:200, height:50, flexDirection:"row", alignItems:"center", justifyContent:"center", textAlign:"center"}}>
                        <Text style={{color:"white",  fontSize:18}}>VALIDATE</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                :


                <ScrollView style={{flex:1, flexDirection:"column", height:Constantes.screenHeight-80}}>
                <View style={{flex:1, flexDirection:"column", width:"100%", justifyContent:"flex-start", alignItems:"center"}}>


                    <View style={{width:200, height:50, flexDirection:"row", alignItems:"center", justifyContent:"center", backgroundColor:"rgba(255,255,255,0.35)", marginTop:20}}>
                      <Text style={{color:"white",  fontSize:18}}>{"MY ACCOUNT"}</Text>
                    </View>
                    <TouchableOpacity onPress={this.logout} style={{backgroundColor:"rgba(100,150,255,1)", borderRadius:2, width:200, height:50, flexDirection:"row", alignItems:"center", justifyContent:"center", textAlign:"center"}}>
                      <Text style={{color:"white",  fontSize:18}}>LOGOUT</Text>
                      <Image  source={require('../assets/images/exit.png')} style={{width:50, height:50, borderRadius:50/2}}/>
                    </TouchableOpacity>



                    <View style={{flex:1, paddingBottom:10,  flexDirection: 'column', alignItems:"flex-start", width:"100%", marginTop:20}}>

                      <View style={{flex:1,flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10,  width:"100%", paddingRight:20, paddingLeft:10}}>
                        <View style={{flex:1,  flexDirection: 'column', alignItems:"flex-start", width:"100%"}}>
                          <Text style={{width: "100%", textAlign:"left", fontSize:13, color:"white"}}>Profil picture</Text>
                          <View style={{flexDirection:"row", alignItems:"center"}}>
                            <View style={{flex:1, borderWidth:0,borderRadius:2, borderColor:"rgba(100,100,100,1)", overflow: "hidden"}}>
                              {this.state.imageProfil ?
                                <Image source={{uri : this.state.imageProfil}} style={{height:50, width:50}}/>
                                :
                                <Image source={require('../assets/images/connectBig.png')} style={{height:50, width:50}}/>
                              }
                            </View>
                            <View style={{flex:1, flexDirection: 'column',  marginBottom:10, marginTop:5, fontSize:15, justifyContent:"flex-start"}}>
                              <TouchableOpacity onPress={this.editImageProfil} style={{width:75, height:30, borderRadius:2, fontSize:15, backgroundColor:"rgba(100,150,255,1)",justifyContent:"center", alignItems:"center", marginRight:10}}>
                                <Text style={{color:"white", fontWeight:"bold"}}>MODIFIE
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ItemEditProfile placeHolder={"Name"} value={this.state.userName} heightSize={1} toggleModifie={this.toggleEditUserName} onChange={this.onInputChange}  validate={this.setNewUserName} autoCompleteType="name" autoCapitalize = 'none' changePossible={this.state.editUserName} keyForState={"userName"}/>
                          <ItemEditProfile placeHolder={"Email"} value={this.state.email} heightSize={1} toggleModifie={this.toggleEditEmail}  onChange={this.onInputChange} validate={this.setNewEmail} autoCompleteType="email" autoCapitalize = 'none' changePossible={this.state.editEmail} keyForState={"email"}/>
                          <ItemEditProfile placeHolder={"Password"} value={ "•••••••"} heightSize={1} toggleModifie={this.changePassword} onChange={this.editPassword} autoCompleteType="tel" autoCapitalize = 'none'/>

                          <View style={{flex:1,  flexDirection: 'column', alignItems:"flex-start", width:"100%"}}>
                            <Text style={{width: "100%", textAlign:"left", fontSize:13, color:"white"}}>Best Score</Text>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                              <View style={{flex:1, borderWidth:0,borderRadius:2, borderColor:"rgba(100,100,100,1)", overflow: "hidden"}}>
                                <Text  style={{color:"white",  fontSize:22, fontWeight:"bold"}}>
                                  {this.props.accountState.account.bestScore?this.props.accountState.account.bestScore:0}</Text>
                              </View>
                            </View>
                          </View>

                          <View style={{flex:1,  flexDirection: 'column', alignItems:"flex-start", width:"100%"}}>
                            <Text style={{width: "100%", textAlign:"left", fontSize:13, color:"white"}}>Mondial Rank</Text>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                              <View style={{flex:1, borderWidth:0,borderRadius:2, borderColor:"rgba(100,100,100,1)", overflow: "hidden"}}>
                                <Text  style={{color:"white",  fontSize:22, fontWeight:"bold"}}>
                                  {this.props.accountState.indexRank?this.props.accountState.indexRank:"last"}</Text>
                              </View>
                            </View>
                          </View>

                        </View>
                      </View>

                    </View>

                </View>
                </ScrollView>

              }

              </View>
            }
          </View>
        )

      }

    }
  }

  const mapStateToProps = (state) => {
    return {
      accountState:state.account.accountStateRedux,
    }
  }

  const AccountContainer = connect(mapStateToProps, mapDispatchToProps)(AccountContainerComponent);
  export default AccountContainer;
