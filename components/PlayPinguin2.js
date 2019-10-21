
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

const sizeIce = Constantes.screenWidth/Constantes.numberPinguin

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
      iceOffset : new Animated.Value(0),
      iceOffsetEntiere:0,
      score:0,
      imagesPinguin : Constantes.imagesPinguin[Math.floor(Math.random()*Constantes.imagesPinguin.length)],
      textPinguin : Constantes.textPinguin[Math.floor(Math.random()*Constantes.textPinguin.length)],
      probaIce: 0.9,
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
        {ices:[false,true,true,true,true,true,true,true,true,false], position:0, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:1, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:2, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:3, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:4, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:5, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:6, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:7, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:8, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:9, opacity:new Animated.Value(1)},
      ],
      needUpdate:false,

    };
  }

  componentWillUnmount = () => {
    this.endGame()
   }

  endGame = () => {
    clearInterval(animatePinguin);
    clearInterval(moveIceUp);
    clearInterval(killPinguins);
    Animated.timing(
      this.state.pinguinsOffset
    ).stop()
    Animated.timing(
      this.state.iceOffset
    ).stop()
  }

  componentDidMount = () => {
    this.beginGame()
  }

  beginGame = () => {
    this.animatePinguin()
    animatePinguin = setInterval(() => this.animatePinguin(), this.state.durationRound);
    this.animateIce()
    animateIce = setInterval(() => this.animateIce(), this.state.durationRound);
    moveIceUp = setInterval(() => this.moveIceUp(), this.state.durationRound/Constantes.numberPinguin);
    killPinguins = setInterval(() => this.killPinguinsWhenNewIce(), this.state.durationRound/Constantes.numberPinguin);

  }


   moveIceUp = () => {
     let icebergsPosition = this.state.icebergsPosition;
     for (var i = 0; i < icebergsPosition.length; i++) {
       let index=i;
       if((icebergsPosition[i].position*Constantes.screenWidth/Constantes.numberPinguin-2)+this.state.iceOffset.__getValue()>=Constantes.screenWidth){
         icebergsPosition[i].ices[0] = false
         icebergsPosition[i].ices[icebergsPosition[i].ices.length-1] = false
         for (var j = 1; j < icebergsPosition[i].ices.length-1; j++) {
           icebergsPosition[i].ices[j] = Math.random()<this.state.probaIce?true:false
         }
         //console.log(icebergsPosition[i].position-this.state.icebergsPosition.length)
         icebergsPosition[i].position = icebergsPosition[i].position-this.state.icebergsPosition.length

       }else if((icebergsPosition[i].position*Constantes.screenWidth/Constantes.numberPinguin-1)+this.state.iceOffset.__getValue()>=Constantes.screenWidth-Constantes.screenWidth/Constantes.numberPinguin){
         this.iceDisapear(this.state.icebergsPosition[i].opacity)
       }
     }
     this.setState({icebergsPosition : icebergsPosition, needUpdate:!this.state.needUpdate})
   }

   iceDisapear = (ice) => {
     Animated.timing(ice , {
       toValue:0,
       duration: this.state.durationRound/Constantes.numberPinguin,
       easing:(t) => t
     }).start(()=> {
         Animated.timing(ice , {
           toValue:1,
           duration: 0,
           delay: this.state.durationRound/Constantes.numberPinguin,
           easing:(t) => t
         }).start();
      });
   }

   animatePinguin = () => {
       Animated.timing(this.state.pinguinsOffset , {
         toValue:this.state.pinguinsOffset.__getValue()+Constantes.screenWidth,
         duration: this.state.durationRound,
         easing:(t) => t
       }).start();

   }

   animateIce = () => {
       Animated.timing(this.state.iceOffset , {
         toValue:this.state.iceOffset.__getValue()+Constantes.screenWidth,
         duration: this.state.durationRound,
         easing:(t) => t
       }).start();
       this.setState({iceOffsetEntiere:this.state.iceOffsetEntiere+Constantes.screenWidth})
   }





  killPinguinsWhenNewIce = () => {
    let pinguinsPosition = this.state.pinguinsPosition;
    let score = this.state.score
    for (var i = pinguinsPosition.length-1; i >= 0 ; i--) {
      if(pinguinsPosition[i][1]*sizeIce + this.state.pinguinsOffset.__getValue()  > Constantes.screenWidth){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }else if(pinguinsPosition[i][1]*Constantes.screenWidth/Constantes.numberPinguin + this.state.pinguinsOffset.__getValue() < sizeIce){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }else if(pinguinsPosition[i][0]*Constantes.screenWidth/Constantes.numberPinguin >= Constantes.screenWidth-sizeIce){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }else if(pinguinsPosition[i][0]*Constantes.screenWidth/Constantes.numberPinguin < sizeIce){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }
    }
    this.setState({pinguinsPosition:pinguinsPosition, score:score})
    if(pinguinsPosition.length===0){
      this.loose()
    }
  }

  killPinguinsWhenMovePinguin = (direction) => {
    let offsetUp = 0;
    let offsetSide = 0;
    if(direction==="up"){offsetUp = 1}
    if(direction==="down"){offsetUp = -1}
    if(direction==="right"){offsetSide = -1}
    if(direction==="left"){offsetSide = 1}
    let pinguinsPosition = this.state.pinguinsPosition;
    let icebergsPosition = this.state.icebergsPosition;
    let score = this.state.score
    let topIcePosition = 0;
    let topLineIndex = 0;
    let iceLineIndex = [];
    for (var i = 0; i < icebergsPosition.length; i++) {
      if(icebergsPosition[i].position<topIcePosition){
        topIcePosition = icebergsPosition[i].position;
        topLineIndex = i
      }
    }
    for (var i = topLineIndex; i < icebergsPosition.length; i++) {
      iceLineIndex.push(i)
    }
    for (var i = 0; i < topLineIndex; i++) {
      iceLineIndex.push(i)
    }
  //  console.log(iceLineIndex)

    for (var i = pinguinsPosition.length-1; i >= 0 ; i--) {
      let columnPinguin = pinguinsPosition[i][1]
      let linePinguin = pinguinsPosition[i][0]
      if(columnPinguin <= -1){
        //console.log(columnPinguin)
        //pinguinsPosition.splice(i, 1);
        score = score - 1
      }else{
        //console.log(columnPinguin)
        //console.log(iceLineIndex[columnPinguin])
        if(icebergsPosition[iceLineIndex[columnPinguin]].ices[linePinguin] === false){
          //console.log(icebergsPosition[iceLineIndex[columnPinguin]].ices)
          //console.log(linePinguin)
          //console.log(i)
          //pinguinsPosition.splice(i, 1);
          score = score - 1
        }
      }


      console.log(Math.round(this.state.pinguinsOffset.__getValue()+this.state.pinguinsPosition[i][1]*sizeIce))
    }
    /*
    for (var i = pinguinsPosition.length-1; i >= 0 ; i--) {
      const positionPinguinInTable = pinguinsPosition[i][1];
      const positionPinguinInIcebergTable = this.state.icebergsPosition.length-positionPinguinInTable;
      if(positionPinguinInIcebergTable + offsetUp >= this.state.icebergsPosition.length){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }else if(this.state.icebergsPosition[positionPinguinInIcebergTable + offsetUp].ices[pinguinsPosition[i][0] + offsetSide] !== true ){
        pinguinsPosition.splice(i, 1);
        score = score - 1
      }
    }
    */
    this.setState({pinguinsPosition:pinguinsPosition, score:score})
    if(pinguinsPosition.length===0){
      this.loose()
    }

  }



  displayPinguins = () => {
    return (
      <View style={{flexDirection:"column", width:Constantes.screenWidth, height:Constantes.screenWidth}}>
        <Animated.View style={{flexDirection:"column", width:Constantes.screenWidth, height:Constantes.screenWidth, position:"absolute", top:this.state.pinguinsOffset, left:0}}>{this.state.pinguinsPosition.map((pinguin, i)=> {
          return <ImageChooserpinguin
          key={i}
          top={this.state.pinguinsPosition[i][1]*Constantes.screenWidth/Constantes.numberPinguin}
          left={this.state.pinguinsPosition[i][0]*Constantes.screenWidth/Constantes.numberPinguin}
          position={this.state.pinguinsPosition}>
          </ImageChooserpinguin>
        })}
        </Animated.View>
      </View>)
  }


  loose = () => {
    if(this.state.loose){return;}
    this.endGame()

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
    this.beginGame()
    this.setState({
      pinguinsOffset : new Animated.Value(0),
      iceOffset : new Animated.Value(0),
      iceOffsetEntiere:0,
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
        {ices:[false,true,true,true,true,true,true,true,true,false], position:0, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:1, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:2, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:3, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:4, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:5, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:6, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:7, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:8, opacity:new Animated.Value(1)},
        {ices:[false,true,true,true,true,true,true,true,true,false], position:9, opacity:new Animated.Value(1)},
      ],
      needUpdate:false,

      lost:false,
      score:0,
    });

  }

  movepinguin = (direction) => {
    if(this.state.lost){return}
    let pinguinsPosition = this.state.pinguinsPosition;
    let score = this.state.score
    if(direction === "up"){
      this.killPinguinsWhenMovePinguin("up")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i][1] = pinguinsPosition[i][1] - 1;
        score = score + 1
      }
    }
    if(direction === "down"){
      this.killPinguinsWhenMovePinguin("down")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i][1] = pinguinsPosition[i][1] + 1;
        score = score + 1
      }
    }
    if(direction === "right"){
      this.killPinguinsWhenMovePinguin("right")
      for (var i = 0; i < this.state.pinguinsPosition.length; i++) {
        pinguinsPosition[i][0] = pinguinsPosition[i][0] - 1;
        score = score + 1
      }
    }
    if(direction === "left"){
      this.killPinguinsWhenMovePinguin("left")
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
          <Animated.View style={{flexDirection:"column", position:"absolute", top:this.state.iceOffset, left:0}}>
            {this.state.icebergsPosition.map((obj, index)=> {
                return (
                  <Animated.View key={index} style={{flexDirection:"column", position:"absolute", opacity:this.state.icebergsPosition[index].opacity, top:(this.state.icebergsPosition[index].position-1)*Constantes.screenWidth/Constantes.numberPinguin, left:0}}>
                    <IceCubeLine  index={index} ices={this.state.icebergsPosition[index].ices} needUpdate={this.state.icebergsPosition[index].position}></IceCubeLine>
                  </Animated.View>
                )
            })}
          </Animated.View>
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
