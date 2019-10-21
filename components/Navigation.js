
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Home from './Home'
import Play from './Play'
import PlayBear from './PlayBear'
import PlayPinguin from './PlayPinguin'
import BestScores from './BestScores'
import ContainerAccount from './ContainerAccount'
import NoAccount from './NoAccount';



const PlayNavigation = createStackNavigator({
  Home: {
    screen: Home,
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
  },
  Play: {
    screen: Play,
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
  },
},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);




const BottomNavigation = createMaterialBottomTabNavigator(
  {
    PlayNavigation: {
      screen: PlayNavigation,
      navigationOptions: {
        title: 'Play',
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused){
            return <Image source={require('../assets/images/playB.png')} style={{width: 30,height: 30}}/>
          }else{
            return <Image source={require('../assets/images/playW.png')} style={{width: 30,height: 30}}/>
          }
        }
      },
    },
    BestScores: {
      screen: BestScores,
      navigationOptions: {
        title: 'Best',
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused){
            return <Image source={require('../assets/images/trophyB.png')} style={{width: 30,height: 30}}/>
          }else{
            return <Image source={require('../assets/images/trophyW.png')} style={{width: 30,height: 30}}/>
          }
        }
      },
    },
    ContainerAccount: {
      screen: ContainerAccount,
      navigationOptions: {
        title: 'Account',
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused){
            return <Image source={require('../assets/images/profilB.png')} style={{width: 30,height: 30}}/>
          }else{
            return <Image source={require('../assets/images/profilW.png')} style={{width: 30,height: 30}}/>
          }
        }
      },
    },

  },
  {
    initialRouteName: 'PlayNavigation',
    labeled:false,
    activeColor: 'rgba(100,150,255,1)',
    inactiveColor: 'grey',
    barStyle: { backgroundColor: 'rgba(0,0,0,0)'},
  }
);


const Navigation = createStackNavigator({
  NoAccount: {
    screen: NoAccount,
    navigationOptions: ({navigation})=> ({
      props:navigation,
      headerStyle: {
        height:0,
        backgroundColor: '#003689',
      },
      headerTintColor: '#FFFFFF',
    }),
  },
  BottomNavigation: {
    screen: BottomNavigation,
    navigationOptions: ({navigation})=> ({
      props:navigation,
      headerMode : "none",
      headerStyle: {
        height:0,
        backgroundColor: '#000000',
      },
      headerTintColor: '#FFFFFF',
    }),
  },
},

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);



export default createAppContainer(Navigation)
