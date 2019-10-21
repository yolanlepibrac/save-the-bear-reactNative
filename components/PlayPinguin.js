
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image, ScrollView, Animated, Easing } from 'react-native';
import { connect } from "react-redux";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import ImageChooserpinguin from "./ImageChooserPinguin";
import ImageChooserIce from "./ImageChooserIce";
import IceCubeLine from "./IceCubeLine";

import { changeAccountState } from "../redux/actions/index";
import { setBestScoreToRedux } from "../redux/actions/index";
import { setBestScore } from "../redux/actions/index";
import Constantes from "../utils/Constantes";
import API from "../utils/API";

const sizeIce = Constantes.screenWidth/Constantes.numberPinguin;
const PRESS_DELAY = 300;


function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (userData) => dispatch(changeAccountState(userData)),
    setBestScore: (bestScore) => dispatch(setBestScore(bestScore)),
    setBestScoreToRedux: (bestScores) => dispatch(setBestScoreToRedux(bestScores)),
  };
};



class PlayComponent extends Component {

  constructor(props) {
    super(props);
    lastTap = null;
    tap = false;
    doubleTap = false;
    tapMove = false;
    this.state = {
      pinguinsOffset : new Animated.Value(0),
      score:0,
      positionOfNewIce : -1,
      imagesPinguin : Constantes.imagesPinguin[Math.floor(Math.random()*Constantes.imagesPinguin.length)],
      textPinguin : Constantes.textPinguin[Math.floor(Math.random()*Constantes.textPinguin.length)],
      probaIce: 1,
      durationRound : 15000,
      numberPinguin:36,
      pinguinsPosition:[
        {position:[2,2], alive:true},{position:[2,3], alive:true},{position:[2,4], alive:true},{position:[2,5], alive:true},{position:[2,6], alive:true},{position:[2,7], alive:true},
        {position:[3,2], alive:true},{position:[3,3], alive:true},{position:[3,4], alive:true},{position:[3,5], alive:true},{position:[3,6], alive:true},{position:[3,7], alive:true},
        {position:[4,2], alive:true},{position:[4,3], alive:true},{position:[4,4], alive:true},{position:[4,5], alive:true},{position:[4,6], alive:true},{position:[4,7], alive:true},
        {position:[5,2], alive:true},{position:[5,3], alive:true},{position:[5,4], alive:true},{position:[5,5], alive:true},{position:[5,6], alive:true},{position:[5,7], alive:true},
        {position:[6,2], alive:true},{position:[6,3], alive:true},{position:[6,4], alive:true},{position:[6,5], alive:true},{position:[6,6], alive:true},{position:[6,7], alive:true},
        {position:[7,2], alive:true},{position:[7,3], alive:true},{position:[7,4], alive:true},{position:[7,5], alive:true},{position:[7,6], alive:true},{position:[7,7], alive:true},
      ],
      icebergsPosition:[
        {ices:[false,true,true,true,true,true,true,true,true,false], position:8, opacity:new Animated.Value(0)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:8, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:7, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:6, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:5, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:4, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:3, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:2, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:1, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:0, opacity:new Animated.Value(1)},
      ],

    };
  }

  componentDidMount = () => {
    this.beginOfGame()

  }

  beginOfGame = () => {
    this.animateIce()
    animateIce = setInterval(() => this.animateIce(), this.state.durationRound);
    newIce = setInterval(() => this.newIce(), this.state.durationRound/Constantes.numberPinguin);
    killPinguins = setInterval(() => this.killPinguinsByNewIce(), this.state.durationRound/Constantes.numberPinguin);
  }

  componentWillUnmount = () => {
    this.endOfGame()
   }

   endOfGame = () => {
     clearInterval(animateIce);
     clearInterval(newIce);
     clearInterval(killPinguins);
   }

  animateIce = () => {
      Animated.timing(this.state.pinguinsOffset , {
        toValue:this.state.pinguinsOffset.__getValue()+Constantes.screenWidth,
        duration: this.state.durationRound,
        easing:(t) => t
      }).start();
  }



  killPinguinsByNewIce = () => {
    let pinguinsPosition = this.state.pinguinsPosition;
    let numberPinguin = this.state.numberPinguin;
    let score = this.state.score
    for (var i = pinguinsPosition.length-1; i >= 0 ; i--) {
      if(pinguinsPosition[i].alive){
        if(pinguinsPosition[i].position[1]*sizeIce + this.state.pinguinsOffset.__getValue()  > Constantes.screenWidth-sizeIce){
          pinguinsPosition[i].alive = false;
          numberPinguin = numberPinguin-1
          score = score - 1
        }else if(pinguinsPosition[i].position[0]*sizeIce >= Constantes.screenWidth){
          pinguinsPosition[i].alive = false;
          numberPinguin = numberPinguin-1
          score = score - 1
        }else if(pinguinsPosition[i].position[0]*sizeIce < 0){
          pinguinsPosition[i].alive = false;
          numberPinguin = numberPinguin-1
          score = score - 1
        }
      }
    }
    this.setState({pinguinsPosition:pinguinsPosition, score:score, numberPinguin:numberPinguin})
    if(this.state.numberPinguin===0){
      this.loose()
    }
  }

  killPinguinsByMovePinguin = (direction) => {
    let offsetUp = 0;
    let offsetSide = 0;
    if(direction==="up"){offsetUp = 1}
    if(direction==="upup"){offsetUp = 2}
    if(direction==="down"){offsetUp = -1}
    if(direction==="right"){offsetSide = -1}
    if(direction==="left"){offsetSide = 1}
    let pinguinsPosition = this.state.pinguinsPosition;
    let numberPinguin = this.state.numberPinguin;
    let score = this.state.score
    for (let i = pinguinsPosition.length-1; i >= 0 ; i--) {
      if(pinguinsPosition[i].alive){
        const positionPinguinInTable = pinguinsPosition[i].position[1]-this.state.positionOfNewIce;
        const positionPinguinInIcebergTable = this.state.icebergsPosition.length-positionPinguinInTable;
        if(positionPinguinInIcebergTable + offsetUp - 1 < 0 || positionPinguinInIcebergTable + offsetUp - 1 >= this.state.icebergsPosition.length){
          pinguinsPosition[i].alive = false;
          numberPinguin = numberPinguin-1
          score = score - 1
        }else if(this.state.icebergsPosition[positionPinguinInIcebergTable + offsetUp - 1].ices[pinguinsPosition[i].position[0] + offsetSide] !== true ){
          pinguinsPosition[i].alive = false;
          numberPinguin = numberPinguin-1
          score = score - 1
        }
      }
    }
    this.setState({pinguinsPosition:pinguinsPosition, score:score, numberPinguin:numberPinguin})
    if(this.state.numberPinguin===0){
      this.loose()
    }
  }

  newIce = () => {
    let icebergsPosition = this.state.icebergsPosition;
    let tabOfBolean = []
    tabOfBolean[0] = false
    tabOfBolean[Constantes.numberPinguin-1] = 0
    for (var i = 1; i < Constantes.numberPinguin-1 ; i++) {
      tabOfBolean[i] = Math.random()<this.state.probaIce?true:false;
    }
    icebergsPosition.push({ices:tabOfBolean, position:this.state.positionOfNewIce, opacity:new Animated.Value(0)})
    this.setState({icebergsPosition:icebergsPosition, positionOfNewIce: this.state.positionOfNewIce-1, probaIce:this.state.probaIce>0.5?this.state.probaIce-0.01:this.state.probaIce})
    this.iceDisapear(this.state.icebergsPosition[-this.state.positionOfNewIce-1].opacity)
    this.iceAppear(this.state.icebergsPosition[icebergsPosition.length-1].opacity)

  }

  iceDisapear = (iceOpacity) => {
    Animated.timing(iceOpacity , {
      toValue:0,
      duration: this.state.durationRound/Constantes.numberPinguin,
      easing:(t) => t
    }).start();
  }

  iceAppear = (iceOpacity) => {
    Animated.timing(iceOpacity , {
      toValue:1,
      duration: this.state.durationRound/Constantes.numberPinguin,
      easing:(t) => t
    }).start();
  }



  loose = () => {
    if(this.state.loose){return;}
    Animated.timing(this.state.pinguinsOffset , {
      toValue:0,
      duration: 0,
      easing:(t) => t
    }).start();
    this.endOfGame()
    this.setState({
      score:0,
      lost:true,
    })
    if(this.state.score > this.props.accountState.account.bestScore || this.props.accountState.account.bestScore===undefined){
      this.bestScore()
    }
  }

  bestScore = () => {

    this.props.setBestScore(this.state.score)
    if(this.props.accountState.account.connected === true){
      API.setBestScore(this.state.score, this.props.accountState.account.id).then((data) => {
        //console.log(data.data.score)
        API.getBestScore(this.props.accountState.account.id).then((data)=> {
          this.props.setBestScoreToRedux(data.data.bestScores, data.data.index)
        })
      })
    }
    this.setState({displayBestScore : true})
  }



  newGame = () => {

    this.setState({
      score:0,
      positionOfNewIce : -1,
      imagesPinguin : Constantes.imagesPinguin[Math.floor(Math.random()*Constantes.imagesPinguin.length)],
      textPinguin : Constantes.textPinguin[Math.floor(Math.random()*Constantes.textPinguin.length)],
      probaIce: 0.9,
      durationRound : 15000,
      numberPinguin:36,
      pinguinsPosition:[
        {position:[2,2], alive:true},{position:[2,3], alive:true},{position:[2,4], alive:true},{position:[2,5], alive:true},{position:[2,6], alive:true},{position:[2,7], alive:true},
        {position:[3,2], alive:true},{position:[3,3], alive:true},{position:[3,4], alive:true},{position:[3,5], alive:true},{position:[3,6], alive:true},{position:[3,7], alive:true},
        {position:[4,2], alive:true},{position:[4,3], alive:true},{position:[4,4], alive:true},{position:[4,5], alive:true},{position:[4,6], alive:true},{position:[4,7], alive:true},
        {position:[5,2], alive:true},{position:[5,3], alive:true},{position:[5,4], alive:true},{position:[5,5], alive:true},{position:[5,6], alive:true},{position:[5,7], alive:true},
        {position:[6,2], alive:true},{position:[6,3], alive:true},{position:[6,4], alive:true},{position:[6,5], alive:true},{position:[6,6], alive:true},{position:[6,7], alive:true},
        {position:[7,2], alive:true},{position:[7,3], alive:true},{position:[7,4], alive:true},{position:[7,5], alive:true},{position:[7,6], alive:true},{position:[7,7], alive:true},
      ],
      icebergsPosition:[
        {ices:[false,true,true,true,true,true,true,true,true,false], position:8, opacity:new Animated.Value(0)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:8, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:7, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:6, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:5, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:4, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:3, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:2, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:1, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:0, opacity:new Animated.Value(1)},
      ],

      lost:false,
      score:0,
    });
    this.beginOfGame()
    this.animateIce()
  }

  movepinguin = (direction) => {
    if(this.state.lost){return}

    let pinguinsPosition = this.state.pinguinsPosition;
    let score = this.state.score

    if(direction === "up"){
      if(this.doubleTap){return}
      if(this.tap){
        console.log("doubletap")
        this.doubleTap = true
        setTimeout(() => {this.doubleTap = false}, PRESS_DELAY)
        this.killPinguinsByMovePinguin("up")
        for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
          pinguinsPosition[i].position[1] = pinguinsPosition[i].position[1] - 1;
          if(pinguinsPosition[i].alive){
            score = score + 1
          }
        }
      }else{
        this.tap = true;
        for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
          pinguinsPosition[i].position[1] = pinguinsPosition[i].position[1] - 1;
          if(pinguinsPosition[i].alive){
            score = score + 1
          }
        }
        console.log(this.tapMove)
        setTimeout(() => {
          this.tap = false;
          if(!this.doubleTap){
            console.log("tap")
            this.killPinguinsByMovePinguin("")
          }
        }, PRESS_DELAY)
      }
    }
    if(direction === "down"){
      this.killPinguinsByMovePinguin("down")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i].position[1] = pinguinsPosition[i].position[1] + 1;
        score = score - 1
      }
    }
    if(direction === "right"){
      this.killPinguinsByMovePinguin("right")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i].position[0] = pinguinsPosition[i].position[0] - 1;
      }
    }
    if(direction === "left"){
      this.killPinguinsByMovePinguin("left")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i].position[0] = pinguinsPosition[i].position[0] + 1;
      }
    }
    this.setState({pinguinsPosition:pinguinsPosition, score:score})
  }

  onSwipeUp = () => {
    this.movepinguin("up")
  }
  onSwipeDown = () => {
    this.movepinguin("down")
  }
  onSwipeLeft = () => {
    this.movepinguin("left")
  }
  onSwipeRight = () => {
    this.movepinguin("right")
  }



  displayPinguins = () => {
    return (
      <View style={{flexDirection:"column", width:Constantes.screenWidth, height:Constantes.screenWidth}}>
        <Animated.View style={{flexDirection:"column", width:Constantes.screenWidth, height:Constantes.screenWidth, position:"absolute", top:this.state.pinguinsOffset, left:0, alignItems:"center", justifyContent:"center" }}>{this.state.pinguinsPosition.map((pinguin, i)=> {
          return <ImageChooserpinguin
          key={i}
          top={this.state.pinguinsPosition[i].position[1]*sizeIce+sizeIce/4}
          left={this.state.pinguinsPosition[i].position[0]*sizeIce+sizeIce/4}
          alive={this.state.pinguinsPosition[i].alive}
          durationMove={this.state.durationRound}>
          </ImageChooserpinguin>
        })}
        </Animated.View>
      </View>
    )
  }

  displayIcebergs = () => {

    return (
      <Animated.View style={{flexDirection:"column", position:"absolute", top:this.state.pinguinsOffset, left:0}}>
        {this.state.icebergsPosition.map((obj, index)=> {
            return (
              <Animated.View key={index} style={{flexDirection:"column", position:"absolute", opacity:this.state.icebergsPosition[index].opacity, top:(this.state.icebergsPosition[index].position-1)*sizeIce, left:0}}>
                <IceCubeLine  index={index} ices={this.state.icebergsPosition[index].ices} needUpdate={this.state.icebergsPosition[index].position}></IceCubeLine>
              </Animated.View>
            )
        })}
      </Animated.View>
    )
  }


  render(){

    const config = {
      velocityThreshold: 0.1,
      directionalOffsetThreshold: 80,
      gestureIsClickThreshold:10
    };

    return(
    <ScrollView>

      <View style={{flexDirection:"column", justifyContent:"center", flex:1, width:"100%", backgroundColor:"rgba(154,207,255,1)", height:Constantes.screenHeight-80}}>
        <View  style={{marginTop:0,  height:70, width:"100%",  flexDirection: 'row',  alignItems: 'center',  justifyContent: 'space-between', paddingLeft:20, paddingRight:20}}>
          <View style={{width:50, flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <Text style={{color: 'white',  fontSize:18}}>{"score"}</Text>
            <Text style={{color: 'white', fontSize:18}}>{this.state.score}</Text>
          </View>
          <View style={{flex:1, flexDirection:"row", justifyContent:"center"}}>
            <Text style={{color: 'white', fontWeight:"bold", fontSize:35}}>{this.state.secondPassed}</Text>
          </View>
          <View style={{width:50, flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <Text style={{color: 'white',  fontSize:18}}>{"best"}</Text>
            <Text style={{color: 'white', fontSize:18}}>{this.props.accountState.account.bestScore}</Text>
          </View>
        </View>

        <View style={{marginTop:20}}>
          {!this.state.lost &&
            <GestureRecognizer
              onSwipe={this.onSwipe}
              onSwipeUp={()=>this.movepinguin("up")}
              onSwipeDown={()=>this.movepinguin("down")}
              onSwipeLeft={()=>this.movepinguin("right")}
              onSwipeRight={()=>this.movepinguin("left")}
              config={config}
              style={{flex: 1,position:"absolute",top:0, left:0, zIndex:10,  height:"100%", width:"100%"}}
              >
              </GestureRecognizer>
          }
          {!this.state.lost ? this.displayIcebergs() : null}
          {this.displayPinguins()}
        </View>

        {this.state.lost ?
          <View style={{flex:1, flexDirection: 'column', width:"100%", marginTop:20, alignItems:"center", justifyContent:"center"}}>
            <Text style={{color:"white"}}></Text>
            <View style={{height:100, width:100}}>
            </View>
          </View>
          :
          <View style={{ flexDirection: 'column', width:"100%", flex:1, alignItems:"center", justifyContent:"center"}}>
            <View style={{ flexDirection: 'row', width:"100%", height:210, alignItems:"center", justifyContent:"space-between"}}>
              <View style={{flex:1, flexDirection: 'column', height:"50%"}}>
                <TouchableOpacity onPress={() => this.movepinguin("right")} style={{flexDirection: 'row', alignItems:"center", justifyContent:"center", borderWidth:0, backgroundColor:"rgba(255,255,255,0.5)", height:"100%", margin:1, borderColor:"rgba(200,200,200,1)"}}>
                  <View>
                    <Image style={{height:70, width:70, marginRight:20, borderRadius:35}} source={require("../assets/images/left.png")}/>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, flexDirection: 'column', alignItems:"center", justifyContent:"center", height:"100%"}}>
                <TouchableOpacity onPress={() => this.movepinguin("up")} style={{flex:1, width:"100%", flexDirection: 'row', alignItems:"center", justifyContent:"center", borderWidth:0, backgroundColor:"rgba(255,255,255,0.5)", margin:1, borderColor:"rgba(200,200,200,1)"}}>
                  <View>
                    <Image style={{height:70, width:70, borderRadius:35}} source={require("../assets/images/up.png")}/>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.movepinguin("down")} style={{flex:1, width:"100%",  flexDirection: 'row', alignItems:"center", justifyContent:"center", borderWidth:0, backgroundColor:"rgba(255,255,255,0.5)", margin:1, borderColor:"rgba(200,200,200,1)"}}>
                  <View>
                    <Image style={{height:70, width:70, borderRadius:35}} source={require("../assets/images/down.png")}/>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, flexDirection: 'column', height:"50%"}}>
                <TouchableOpacity onPress={() => this.movepinguin("left")} style={{flexDirection: 'row', alignItems:"center", justifyContent:"center", borderWidth:0, backgroundColor:"rgba(255,255,255,0.5)", height:"100%", margin:1, borderColor:"rgba(200,200,200,1)"}}>
                  <View>
                    <Image style={{height:70, width:70, marginLeft:20, borderRadius:35}} source={require("../assets/images/right.png")}/>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }


        {this.state.lost ?
          <View style={{width:"100%", height:200, position:"absolute", right:0, bottom:0}}>
            <Image style={{height:"100%", width:"100%"}} source={this.state.imagesPinguin}/>
          </View>
          :
          null
        }
        {this.state.lost ?
          <View style={{ position:"absolute", right:20, bottom:150, borderRadius:5, borderWidth:1, backgroundColor:"rgba(255,255,255,0.7)", flexDirection:"row", textAlign:"center", alignItems:"center", padding:5, maxWidth:250}}>
            <Text style={{fontSize:15}}>{this.state.textPinguin}</Text>
          </View>
          :
          null
        }
        {this.state.lost ?
          <View style={{width:Constantes.screenWidth, height:Constantes.screenHeight, position:"absolute", left:0, top:0, backgroundColor:"rgba(0,0,0,0)"}}>
            <View style={{width:200, height:100, position:"absolute", left:Constantes.screenWidth/2-100, top:Constantes.screenHeight/2-100}}>
              {this.state.displayBestScore ?
                <View style={{width:200, height:30, flexDirection:"row", alignItems:"center", justifyContent:"center", backgroundColor:"rgba(255,255,255,0.35)"}}>
                  <Text style={{color:"rgba(100,150,255,1)",  fontSize:20, fontWeight:"bold"}}>{"BEST SCORE"}</Text>
                </View>
                :
                null
              }
              <View style={{width:200, height:50, flexDirection:"row", alignItems:"center", justifyContent:"center", backgroundColor:"rgba(255,255,255,0.35)"}}>
                <Text style={{color:"white",  fontSize:35}}>{this.state.score}</Text>
                <Text style={{color:"white",  fontSize:35}}>{" pts"}</Text>
              </View>
              <TouchableOpacity onPress={this.newGame} style={{backgroundColor:"rgba(100,150,255,1)", borderRadius:2, width:200, height:50, flexDirection:"row", alignItems:"center", justifyContent:"center", textAlign:"center"}}>
                <Text style={{color:"white",  fontSize:18}}>PLAY AGAIN</Text>
              </TouchableOpacity>
            </View>
          </View>
          :null
        }

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

const Play = connect(mapStateToProps, mapDispatchToProps)(PlayComponent);
export default Play;
