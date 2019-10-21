
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image, ScrollView } from 'react-native';
import { connect } from "react-redux";
import Constantes from "../utils/Constantes";
import { changeAccountState } from "../redux/actions/index";
import API from "../utils/API";
import { setBestScoreToRedux } from "../redux/actions/index";
import { withNavigationFocus } from 'react-navigation';

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (userData) => dispatch(changeAccountState(userData)),
    setBestScoreToRedux: (bestScores) => dispatch(setBestScoreToRedux(bestScores)),
  };
};

const s = [1,2,3,4]

class BestScoresComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayLoading:false,
      account : this.props.accountState.account,
      bestScores : this.props.accountState.bestScores,
      indexRank : this.props.accountState.indexRank,
    };
  }

  componentDidMount = () => {

  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.isFocused !== this.props.isFocused || prevProps.accountState.bestScores !== this.props.accountState.bestScores) {
      this.setState({
        account : this.props.accountState.account,
        bestScores : this.props.accountState.bestScores,
        indexRank : this.props.accountState.indexRank,
      })
    }
  }

  bestScore = () => {
    this.setState({displayLoading:true})
    API.getBestScore(this.state.account.connected?this.state.account.id:undefined).then((data)=> {
      console.log(data.data.bestScores)
      this.props.setBestScoreToRedux(data.data.bestScores, this.state.account.connected?data.data.index:undefined)
      this.setState({
        displayLoading:false,
        account : this.props.accountState.account,
        bestScores : this.props.accountState.bestScores,
        indexRank : this.props.accountState.indexRank,
      })
    }).catch((error)=>{
      console.log(error);
      this.setState({displayLoading:false})
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
            <View  style={{marginTop:0,flex:1,height:Constantes.screenHeight-100,width:"100%",flexDirection: 'column',alignItems:'center',justifyContent:'center',  backgroundColor:"rgba(154,207,255,1)"}}>
              <View style={{flex:1, width:"80%", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", marginTop:20}}>
                <TouchableOpacity onPress={this.bestScore} style={{backgroundColor:"rgba(100,150,255,1)", borderRadius:2, width:"100%", height:50, flexDirection:"row", alignItems:"center", justifyContent:"center", textAlign:"center"}}>
                  <Text style={{color:"white",  fontSize:18}}>{this.state.bestScores.length>0?"UPDATE BEST SCORES":"LOAD BEST SCORES"}</Text>
                </TouchableOpacity>
                {!this.state.account.connected === true &&
                  <Text style={{color:"white", margin:5, fontWeight:"bold", marginBottom:10}}>! You need to login to be in the list</Text>
                }
                <ScrollView style={{flex:1, width:"100%", marginTop:20, marginBottom:20, paddingBottom:20}}>
                {this.state.bestScores && this.state.bestScores.length > 0 &&
                  this.state.bestScores.map((user, key)=> {
                    return(
                      <View key={key} style={{flex:1, width:"100%", height:50, flexDirection:"row", justifyContent:"flex-start", alignItems:"center", marginBottom:2,
                    backgroundColor:this.state.account.id===user.id?"rgba(255,255,255,0.4)":"rgba(200,200,200,0)"}}>
                        <Text style={{fontSize:18, fontWeight:"bold", color:"white", marginRight:20, width:30}}>{key+1}
                        </Text>
                        <View style={{flex:1, height:50, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                          <View style={{flex:1, height:50, flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
                            {user.imageProfil?
                              <Image style={{height:50, width:50, borderRadius:5, marginRight:20}} source={{uri:user.imageProfil}}/>
                              :
                              <Image style={{height:50, width:50, borderRadius:5, marginRight:20}} source={require("../assets/images/connect.png")}/>
                            }
                            <Text numberOfLines={2} style={{color:"white", maxWidth:130}}>{user.userName?user.userName:"unknow"}
                            </Text>
                          </View>
                          <Text style={{fontSize:18, fontWeight:"bold",color:"white",width:100,textAlign:"right"}}>{user.bestScore?user.bestScore+" pts":0+" pts"}
                          </Text>
                        </View>
                      </View>
                    )
                  })
                }
                </ScrollView>

                {this.state.indexRank>100 ?
                  <View style={{flex:1, width:"100%", flexDirection:"column", justifyContent:"flex-start", alignItems:"center", marginBottom:2}}>

                    {this.state.indexRank>101 ?
                      <View style={{ width:"100%", height:50, flexDirection:"column", justifyContent:"center", alignItems:"flex-start", marginBottom:2, marginTop:20, marginBottom:20}}>
                        <Image style={{height:50, width:10, borderRadius:5, marginRight:20}} source={require("../assets/images/points.png")}/>
                      </View>
                      :
                      null
                    }


                    <View style={{width:"100%", height:50, flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:2,
                  backgroundColor:"rgba(255,255,255,0.4)"}}>
                      <View style={{flex:1, height:50, flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
                        <Text style={{fontSize:18, fontWeight:"bold", color:"white", marginRight:20}}>{this.state.indexRank}
                        </Text>
                        {this.state.account.imageProfil?
                          <Image style={{height:50, width:50, borderRadius:5, marginRight:20}} source={{uri:this.state.account.imageProfil}}/>
                          :
                          <Image style={{height:50, width:50, borderRadius:5, marginRight:20}} source={require("../assets/images/connect.png")}/>
                        }
                        <Text style={{color:"white"}}>{this.state.account.userName?this.state.account.userName:"unknow"}
                        </Text>
                      </View>

                      <Text style={{fontSize:18, fontWeight:"bold", color:"white"}}>{this.state.account.bestScore?this.state.account.bestScore+" pts":0+" pts"}
                      </Text>
                    </View>

                    <View style={{ width:"100%", height:50, flexDirection:"column", justifyContent:"center", alignItems:"flex-start", marginBottom:2, marginTop:20, marginBottom:20 }}>
                      <Image style={{height:50, width:10, borderRadius:5, marginRight:20}} source={require("../assets/images/points.png")}/>
                    </View>

                  </View>
                  :
                  null
                }

              </View>


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

const BestScores = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(BestScoresComponent));
export default BestScores;
