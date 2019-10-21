
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image, ScrollView } from 'react-native';
import { connect } from "react-redux";
import Constantes from "../utils/Constantes";
import { changeAccountState } from "../redux/actions/index";
import { withNavigationFocus } from 'react-navigation';


function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (userData) => dispatch(changeAccountState(userData)),
  };
};

class HomeComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bestScore:this.props.accountState.account.bestScore
    };
  }
  play = () => {
    this.props.navigation.navigate("Play")
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({bestScore:this.props.accountState.account.bestScore})
    }
  }


  render(){
    return(
      <ScrollView>
        <View  style={{marginTop:0, flex:1, height:Constantes.screenHeight-80, width:"100%", flexDirection: 'column',  alignItems: 'center',  justifyContent: 'center',  fontSize: 'calc(10px + 2vmin)', backgroundColor:"rgba(154,207,255,1)"}}>

          <View style={{flex:1, width:"80%", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
            <View style={{height:130, width:"100%", flexDirection:"column", justifyContent:"flex-end"}}>
              <Image style={{height:130, width:"100%"}} source={require("../assets/images/seal/seal.png")}/>
              <View style={{ position:"absolute", right:20, top:10, borderRadius:5, borderWidth:1, backgroundColor:"rgba(255,255,255,0.7)", flexDirection:"row", textAlign:"center", alignItems:"center", padding:5}}>
                <Text style={{fontSize:15}}>{"Hello, my name is Seal"}</Text>
              </View>
            </View>
            <Text style={{textAlign:"justify", color:"white", marginTop:20, fontSize:16}}>I am hiding behind icebergs. Find me before the ice has molten. Click on the similar ice shape you will see below, for each round. Be quick to earn more points !
            </Text>
          </View>
          <View style={{flex:1, width:"100%", flexDirection:"column", alignItems:"center", justifyContent:"center", backgroundColor:"white"}}>
            <View style={{width:200, height:50, flexDirection:"row", alignItems:"center", justifyContent:"center", backgroundColor:"rgba(154,207,255,0.5)"}}>
              <Text style={{color: 'white',  fontSize:18}}>{"BEST SCORE : "}</Text>
              <Text style={{color: 'white', fontSize:18}}>{this.state.bestScore}</Text>
            </View>
            <TouchableOpacity onPress={this.play} style={{backgroundColor:"rgba(100,150,255,1)", borderRadius:2, width:200, height:50, flexDirection:"row", alignItems:"center", justifyContent:"center", textAlign:"center"}}>
              <Text style={{color:"white",  fontSize:18}}>PLAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
  }
}

const Home = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(HomeComponent));
export default Home;
