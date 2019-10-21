import React, { Component } from 'react';
import {  Image, Alert } from 'react-native';
import API from '../utils/API';

export default {
    

    dateToString : (date) => {
      let dd = String(date.getDate()).padStart(2, '0');
      let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = date.getFullYear();
      date = dd + '/' + mm + '/' + yyyy;
      return date
    },

    loginAlreadyConnected : (email, context, callback) => {
      context.setState({displayLoading:true})
      API.getUserDataByEmail(email).then((dataCurrentUser)=>{
        if(dataCurrentUser.status != 200 ){
          showAlert("sorry we did not find you account, check your connexion")
          context.setState({displayLoading:false})
        }
        console.log("userdata ok")
        context.props.changeAccountState(dataCurrentUser.data.userData);

        console.log(dataCurrentUser.data.userData.friends)
        API.getUsersDataByID(dataCurrentUser.data.userData.friends).then((dataFriends)=>{
          context.props.getUserFriends(dataFriends.data.usersData);
          API.getBetsDataByID(dataCurrentUser.data.userData.bets.map((bet)=>(bet.id))).then((dataBets)=>{
            context.props.getUserBets(dataBets.data.bets);
            API.getBetsDataByID(dataCurrentUser.data.userData.witnessOf).then((dataWitnessOf)=>{
              context.props.getUserWitnessOf(dataWitnessOf.data.bets);
              context.setState({
                displayLoading:false,
                email:email,
              })
              callback()
              context.setState({displayLoading:false})
            });
          });
        });
      }).catch(error => {
        showAlert("the server can not be reached. Please, check your connexion !")
        context.setState({displayLoading:false})
      });
      //this.props.navigation.navigate("TopNavigation", {email:email})
    }
}

var showAlert = (errorMessage) => {
  Alert.alert(
    'Error',
    errorMessage,
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )
}
