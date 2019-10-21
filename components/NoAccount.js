

import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image, Keyboard } from 'react-native';
import { connect } from "react-redux";

import API from '../utils/API';
import Utils from '../utils/Utils';
import Signup from './Signup';
import Login from './Login';
import Constantes from "../utils/Constantes";

import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';

//Redux
import { changeAccountState } from "../redux/actions/index";
import { setBestScoreToRedux } from "../redux/actions/index";
import { withNavigationFocus } from 'react-navigation';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (userData) => dispatch(changeAccountState(userData)),
    setBestScoreToRedux: (bestScores, indexRank) => dispatch(setBestScoreToRedux(bestScores, indexRank)),
  };
};



class NoAccountComponent extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      popupConnexion : false,
      popupSignUp : false,
      displayLoading :false,
      email : "",
      userName: "",
      password: "",
      cpassword: "",
      imageProfil:"",
    };
  }


  toggleLoginPopup = () => {
    this.setState({
      popupConnexion:!this.state.popupConnexion,
      popupSignUp : false,
    })
  }

  toggleRegisterPopup = () => {
    this.setState({
      popupSignUp:!this.state.popupSignUp,
      popupConnexion : false,
    })
  }

  quitLoginAndSignUp = () => {
    this.setState({
      popupConnexion : false,
      popupSignUp : false,
    })
  }

  displayLoading = (boolean) => {
    this.setState({displayLoading:boolean})
  }




  componentDidMount = () => {
    this.setState({displayLoading:false});
    AsyncStorage.getItem('email').then((emailStored) => {
      console.log(emailStored)
      if(emailStored && emailStored !== undefined && emailStored!== ""){
        this.loginAlreadyConnected(emailStored)
      }
    })
  }

  stayLog = async email => {
    try {
      await AsyncStorage.setItem('email', email);
    } catch (error) {
      console.log(error.message);
    }
  }

  setNewBestScoreWhenLogin = (userData) => {
    API.setBestScore(this.props.accountState.account.bestScore, userData.id).then((data) => {
      console.log(data.data.score)
      this.getBestScore(userData.id, ()=> {
        this.props.connect()
        this.setState({displayLoading:false});
      })
    })
  }

  getBestScore = (id, callback) => {
    API.getBestScore(id).then((data)=> {
      this.props.setBestScoreToRedux(data.data.bestScores, data.data.index);
      callback();
    }).catch(error => {
        console.log(error)
        this.setState({displayLoading:false})
    });
  }

  loginAlreadyConnected = (email) => {
    this.setState({displayLoading:true})
    API.getUserDataByEmail(email).then((dataUser)=> {
      this.getInfoWhenLogin(dataUser)
    })
  }

  login = (email, password) => {
    //Keyboard.dismiss()
    this.setState({displayLoading:true})
    API.login(email, password).then((dataUser)=>{
      this.getInfoWhenLogin(dataUser)
    }).catch(error => {
        this._showAlert('Error', "Error, please check your connexion")
        console.log(error)
        this.setState({displayLoading:false})
    });

  }

  getInfoWhenLogin = (dataUser) => {
    console.log(dataUser.data.userData.id)
    console.log("log")
    let newAccountState = dataUser.data.userData;
    let connected = {connected:true}
    if(this.props.connectedWitouthAccount===true){
      if(newAccountState.bestScore<this.props.accountState.account.bestScore){
        newAccountState.bestScore=this.props.accountState.account.bestScore
        this.setNewBestScoreWhenLogin(dataUser.data.userData)
      }else{
        this.getBestScore(dataUser.data.userData.id, ()=> {
          this.props.connect()
        })
      }
    }else{
      this.getBestScore(dataUser.data.userData.id, ()=> {
        this.props.navigation.navigate("Home")
      })
    }
    this.props.changeAccountState({...newAccountState, ...connected});
    this.stayLog(dataUser.data.userData.email)
  }

  continueWithoutAccount = () => {
    this.setState({displayLoading:true})
    this.props.changeAccountState({userName:"unknow", email:"unknow", imagaProfil:undefined, connected:false, id:'_' + Math.random().toString(36).substr(2, 9),});
    this.props.navigation.navigate("Home")
    this.setState({displayLoading:false})
    /*
    API.getBestScore().then((data)=> {
      console.log(data.data.bestScores)
      this.props.setBestScoreToRedux(data.data.bestScores, undefined)
      this.props.navigation.navigate("Home")
      this.setState({displayLoading:false})
    }).catch((error)=>{
      console.log(error);
      this.setState({displayLoading:false})
    })
    */
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.isFocused !== this.props.isFocused) {
      if(this.props.navigation.getParam('displayLoading', undefined) !== undefined){
        this.setState({displayLoading:this.props.navigation.getParam('displayLoading', undefined),})
        this.props.navigation.setParams({'displayLoading': undefined})
      }
    }
  }






  signup = (email, userName, imageProfil, password, cpassword) => {
    this.setState({displayLoading:true})
    if(userName.length === 0 || email.length === 0 || password.length === 0 || (password !== cpassword)){
      this.setState({displayLoading:false})
    }
    if(userName.length === 0){
      this._showAlert('Error', "Please choose a user name")
      return;
    }
    if(email.length === 0){
      this._showAlert('Error', "Please fill your email")
      return;
    }
    if(password.length === 0 || password !== cpassword){
      this._showAlert('Error', "Carefull, password and confirm password does not match or are invalid")
      return;
    }
    var _send = {
        id:'_' + Math.random().toString(36).substr(2, 9),
        email: email,
        userName: userName,
        password: password,
        imageProfil: imageProfil,
        bestScore : this.props.accountState.account.bestScore,
    }

    API.signup(_send).then((data) => {
      if(data.status === 200){
        console.log(data.data.userData)
        let newAccountState = data.data.userData;
        let connected = {connected:true}
        this.props.changeAccountState({...newAccountState, ...connected});
        this.stayLog(data.data.userData.email)
        this.getBestScore(newAccountState.id, () => {
          if(this.props.connectedWitouthAccount===true){
            this.props.connect()
          }else{
            this.props.navigation.navigate("Home")
          }
        })

      }else if(data.status === 204){
        this._showAlert('Error', "This email is already used")
        this.setState({displayLoading:false})
      }
    },(error) => {
        this._showAlert('Error', "error with server")
        console.log(error)
        this.setState({displayLoading:false});
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

  changeState = (key, value) => {
    this.setState({
      [key] : value
    });
  }

  changeImageProfil = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.cancelled) {
      const response = await ImageManipulator.manipulateAsync(result.uri, [], { base64: true })
      let image64 = "data:image/jpeg;base64,"+ response.base64;
      this.setState({ imageProfil: image64 });
    }
  };





  render(){
    return(
    <View style={{flex:1, flexDirection:"row", alignItems:"flex-start", justifyContent:"center", width:screenWidth, backgroundColor:"rgba(154,207,255,1)"}}>
      {this.state.displayLoading ?
        <View style={{flex:1, width:"100%", height:Constantes.screenHeight, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
          <ActivityIndicator color={"rgba(101,150,255,1)"} size={"large"}></ActivityIndicator>
        </View>
        :
        <View style={{flex:1, flexDirection:"column", alignItems:"center", justifyContent:"flex-start", width:screenWidth}}>
          {this.state.popupConnexion ?
            <View style={{width:screenWidth*0.9, marginTop:5, height:"100%"}}>
              <Login login={this.login} displayLoading={this.displayLoading} quit={this.quitLoginAndSignUp} changeState={this.changeState}
              password={this.state.password} email={this.state.email}/>
            </View>
            : null
          }
          {this.state.popupSignUp ?
            <View style={{width:screenWidth*0.9, marginTop:5, height:"100%"}}>
              <Signup signup={this.signup} displayLoading={this.displayLoading} quit={this.quitLoginAndSignUp} changeState={this.changeState} changeImageProfil={this.changeImageProfil}
            email={this.state.email} userName={this.state.userName} password={this.state.password} cpassword={this.state.cpassword} imageProfil={this.state.imageProfil}/>
            </View>
            : null
           }

           {!this.state.popupSignUp && !this.state.popupConnexion &&
            <View style={{flexDirection:"column", justifyContent:"flex-start"}}>
              <View style={{marginTop:20, flexDirection:"row", alignItems:"flex-start", marginLeft:10}}>
                <TouchableOpacity  onPress={this.toggleLoginPopup} style={{width:150, height:50, backgroundColor:"rgba(101,150,255,1)", borderRadius:2, flexDirection:"row", justifyContent:"center", marginRight:10, alignItems:"center"}}>
                  <Text style={{color:"white"}}>LOGIN
                  </Text>
                </TouchableOpacity >
                <TouchableOpacity  onPress={this.toggleRegisterPopup} style={{width:150, height:50, backgroundColor:"rgba(101,150,255,1)", borderRadius:2, flexDirection:"row", justifyContent:"center", marginLeft:10, alignItems:"center"}}>
                  <Text style={{color:"white"}}>REGISTER
                  </Text>
                </TouchableOpacity >
              </View>
              {!this.props.connectedWitouthAccount ?
                <TouchableOpacity  onPress={this.continueWithoutAccount} style={{width:320, height:50, backgroundColor:"rgba(101,150,255,1)", borderRadius:2, flexDirection:"row", justifyContent:"center", margin:10, alignItems:"center", marginTop:50}}>
                  <Text style={{color:"white"}}>CONTINUE WITHOUT ACCOUNT
                  </Text>
                </TouchableOpacity >
                :
                <Text style={{width:320, margin:5, textAlign:"center", color:"white", fontWeight:"bold"}}>! You need to login to access your settings
                </Text>
              }
            </View>
          }
          <Image style={{ height:400, width:400, opacity:1}} source={require('../assets/images/seal.png')}/>
        </View>

      }
    </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    connected:state.account.connectedRedux,
    accountState:state.account.accountStateRedux,
  }
}

const NoAccount = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(NoAccountComponent));
export default NoAccount;
