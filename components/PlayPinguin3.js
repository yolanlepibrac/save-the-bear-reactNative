
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

const numberSquares = 6;


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
    this.state = {
      pinguinsOffset : new Animated.Value(0),
      pinguinsOffsetValue:0,
      score:0,
      newIcePosition : -1,
      imagesPinguin : Constantes.imagesPinguin[Math.floor(Math.random()*Constantes.imagesPinguin.length)],
      textPinguin : Constantes.textPinguin[Math.floor(Math.random()*Constantes.textPinguin.length)],
      probaIce: 0.8,
      durationRound : 15000,
      pinguinsPosition:[
        [2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],
        [3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],
        [4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],
        [5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],
        [6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],
        [7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],
      ],
      icebergsPosition:[
        {ices:[true,true,true,true,true,true,true,true,true,true], position:10},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:9},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:8},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:7},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:6},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:5},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:4},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:3},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:2},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:1},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:0},
      ],

    };
  }

  componentDidMount = () => {
    this.animate()

  }

  componentWillUnmount = () => {
    this.unanimate()
   }

   unanimate = () => {
     clearInterval(animate);
     clearInterval(newIce);
     clearInterval(killPinguins);
   }

  animate = () => {
      animate = setInterval(() => this.animate(), this.state.durationRound);
      newIce = setInterval(() => this.newIce(), this.state.durationRound/Constantes.numberPinguin);
      killPinguins = setInterval(() => this.killPinguinsExteriorMap(), this.state.durationRound/Constantes.numberPinguin);
      Animated.timing(this.state.pinguinsOffset , {
        toValue:this.state.pinguinsOffsetValue+Constantes.screenWidth,
        duration: this.state.durationRound,
        easing:(t) => t
      }).start();
      this.setState({pinguinsOffsetValue:this.state.pinguinsOffsetValue+Constantes.screenWidth});
  }



  killPinguinsExteriorMap = () => {
    let pinguinsPosition = this.state.pinguinsPosition;
    let score = this.state.score
    for (var i = pinguinsPosition.length-1; i >= 0 ; i--) {
      if(pinguinsPosition[i][1]*Constantes.screenWidth/Constantes.numberPinguin + this.state.pinguinsOffset.__getValue()  > Constantes.screenWidth){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }else if(pinguinsPosition[i][1]*Constantes.screenWidth/Constantes.numberPinguin + this.state.pinguinsOffset.__getValue() < 0){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }else if(pinguinsPosition[i][0]*Constantes.screenWidth/Constantes.numberPinguin >= Constantes.screenWidth){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }else if(pinguinsPosition[i][0]*Constantes.screenWidth/Constantes.numberPinguin < 0){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }
    }
    this.setState({pinguinsPosition:pinguinsPosition, score:score})
    if(pinguinsPosition.length===0){
      this.loose()
    }
  }

  killPinguinsInteriorMap = (direction) => {
    let offsetUp = 0;
    let offsetSide = 0;
    if(direction==="up"){offsetUp = 1}
    if(direction==="down"){offsetUp = -1}
    if(direction==="right"){offsetSide = -1}
    if(direction==="left"){offsetSide = 1}
    let pinguinsPosition = this.state.pinguinsPosition;
    let score = this.state.score
    for (var i = pinguinsPosition.length-1; i >= 0 ; i--) {
      const positionPinguinInTable = pinguinsPosition[i][1]-this.state.newIcePosition;
      const positionPinguinInIcebergTable = this.state.icebergsPosition.length-positionPinguinInTable;
      if(positionPinguinInIcebergTable + offsetUp >= this.state.icebergsPosition.length){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }else if(this.state.icebergsPosition[positionPinguinInIcebergTable + offsetUp].ices[pinguinsPosition[i][0] + offsetSide] !== true ){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }
    }
    this.setState({pinguinsPosition:pinguinsPosition, score:score})
    if(pinguinsPosition.length===0){
      this.loose()
    }
  }

  newIce = () => {
    let icebergsPosition = this.state.icebergsPosition;
    //icebergsPosition.shift()
    let tabOfBolean = []
    for (var i = 0; i < Constantes.numberPinguin ; i++) {
      tabOfBolean[i] = Math.random()<this.state.probaIce?true:false;
    }
    //console.log(tabOfBolean)
    icebergsPosition.push({ices:tabOfBolean, position:this.state.newIcePosition})
    this.setState({icebergsPosition:icebergsPosition, newIcePosition: this.state.newIcePosition-1})
  }






  displayPinguins = () => {
    return <View style={{flexDirection:"column", width:Constantes.screenWidth, height:Constantes.screenWidth}}>
              <Animated.View style={{flexDirection:"column", width:Constantes.screenWidth, height:Constantes.screenWidth, position:"absolute", top:this.state.pinguinsOffset, left:0}}>{this.state.pinguinsPosition.map((pinguin, i)=> {
                return <ImageChooserpinguin
                key={i}
                top={this.state.pinguinsPosition[i][1]*Constantes.screenWidth/Constantes.numberPinguin}
                left={this.state.pinguinsPosition[i][0]*Constantes.screenWidth/Constantes.numberPinguin}
                position={this.state.pinguinsPosition}>
                </ImageChooserpinguin>
              })}
              </Animated.View>
            </View>
  }

  displayIcebergs = () => {

    const column = []
    for (i=0; i<this.state.icebergsPosition.length;i++) {
      const line = []
      for (j=0; j<this.state.icebergsPosition[i].ices.length;j++) {
        line.push(
          <ImageChooserIce
          backgroundImage={Constantes.imagesIce[i]}
          key={[i,j]}
          i={this.state.icebergsPosition[i].position}
          j={j}
          isOut={false}
          isDisplayed={this.state.icebergsPosition[i].ices[j]}
          dimension={Constantes.screenWidth/Constantes.numberPinguin}
          offset={this.state.pinguinsOffset}>
          </ImageChooserIce>)
        }
      column.push(
        <View style={{flexDirection:"row", position:"absolute", top:(this.state.icebergsPosition[i].position-this.state.newIcePosition-1)*Constantes.screenWidth/Constantes.numberPinguin, left:0}} key={i}>
        {line}
      </View>)
    }
    return <Animated.View style={{flexDirection:"column", position:"absolute", top:this.state.pinguinsOffset, left:0}}>{column}</Animated.View>
  }



  loose = () => {
    if(this.state.loose){return;}
    this.stopTimer()

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


  stopTimer = () => {
    this.unanimate()
    Animated.timing(
      this.state.pinguinsOffset
    ).stop()
  }


  newGame = () => {
    console.log("new")
    Animated.timing(this.state.pinguinsOffset , {
      toValue:0,
      duration: 10,
    }).start();

    this.setState({
      pinguinsOffsetValue:0,
      score:0,
      newIcePosition : -1,
      imagesPinguin : Constantes.imagesPinguin[Math.floor(Math.random()*Constantes.imagesPinguin.length)],
      textPinguin : Constantes.textPinguin[Math.floor(Math.random()*Constantes.textPinguin.length)],
      probaIce: 0.8,
      durationRound : 15000,
      pinguinsPosition:[
        [2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],
        [3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],
        [4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],
        [5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],
        [6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],
        [7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],
      ],
      icebergsPosition:[
        {ices:[true,true,true,true,true,true,true,true,true,true], position:10},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:9},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:8},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:7},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:6},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:5},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:4},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:3},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:2},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:1},
        {ices:[true,true,true,true,true,true,true,true,true,true], position:0},
      ],

      lost:false,
      score:0,
    });
    console.log(Constantes.pinguinsPosition)
    this.animate()
  }

  movepinguin = (direction) => {
    if(this.state.lost){return}

    let pinguinsPosition = this.state.pinguinsPosition;
    let score = this.state.score
    if(direction === "up"){
      this.killPinguinsInteriorMap("up")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i][1] = pinguinsPosition[i][1] - 1;
        score = score + 1
      }
    }
    if(direction === "down"){
      this.killPinguinsInteriorMap("down")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i][1] = pinguinsPosition[i][1] + 1;
        score = score + 1
      }
    }
    if(direction === "right"){
      this.killPinguinsInteriorMap("right")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i][0] = pinguinsPosition[i][0] - 1;
        score = score + 1
      }
    }
    if(direction === "left"){
      this.killPinguinsInteriorMap("left")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i][0] = pinguinsPosition[i][0] + 1;
        score = score + 1
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
          {this.displayIcebergs()}
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
