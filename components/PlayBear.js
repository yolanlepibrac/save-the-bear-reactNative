
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image, ScrollView, Animated, Easing } from 'react-native';
import { connect } from "react-redux";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import ImageChooserBear from "./ImageChooserBear"
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
      icebergsPosition:[
        [0,0],
        [0,0],
        [0,0],
        [0,0]
      ],
      numberOfIce : 4,
      timeIceDisapear : 1000,
      bearPositionDynamicI: new Animated.Value(Constantes.screenWidth/numberSquares*(1/2+0)-25),
      bearPositionDynamicJ: new Animated.Value(Constantes.screenWidth/numberSquares*(1/2+0)-25),
      bearPosition:[0,0],
      score:0,
      opacityPlus10: new Animated.Value(0),
      sizePlus10: new Animated.Value(100),
      positionPlus10 : new Animated.Value(Constantes.screenWidth/numberSquares*(numberSquares/2)),
      fontSizePlus10 : new Animated.Value(50),
      plus10 : false,
      placementPlus10 : [0,0],
      backgroundImageBear : require("../assets/images/bear/bearRight.png"),
      widthBear : new Animated.Value(50),
    };
  }

  componentDidMount = () => {
    myVar = setInterval(() => this.getTimerValue(), this.state.timeIceDisapear)
  }

  componentWillUnmount = () => {
    clearInterval(myVar);
  }




  getTimerValue2 = () => {
    var timePassed = new Date().getTime() - this.state.beginning;
    var secondPassed = Math.floor((timePassed % (1000 * 60)) / 1000)
    var milliSecondPassed = Math.floor((timePassed % (1000))/10)
    secondPassed = secondPassed+this.state.numberTap
    if(secondPassed>59){
      this.loose()
    }else{
      this.setState({
        secondPassed : secondPassed.toString() + "." + milliSecondPassed.toString()
      })
    }
  }

  getTimerValue = () => {
    let icebergsPosition = this.state.icebergsPosition

    let newIcePosition = this.newIcePosition(icebergsPosition)
    this.plus10()
    icebergsPosition.shift()
    icebergsPosition.push(newIcePosition)

    let isOnIce = false
    for(k=0; k<icebergsPosition.length;k++){
      if(icebergsPosition[k][0] === this.state.bearPosition[0] && icebergsPosition[k][1] === this.state.bearPosition[1]){
        isOnIce = true
      }
    }
    if(!isOnIce){
      this.loose()
    }else{
      this.setState({
        icebergsPosition : icebergsPosition,
        timeIceDisapear : this.state.timeIceDisapear>500?this.state.timeIceDisapear-5:this.state.timeIceDisapear>300?this.state.timeIceDisapear-1:this.state.timeIceDisapear,
        score:this.state.score+1,
      })
    }
  }

  plus10 = () => {
    if(this.state.plus10mustDisapear){
      this.setState({plus10:false, plus10mustDisapear:false})
    }
    if(this.state.plus10 && this.state.icebergsPosition[0][0] === this.state.placementPlus10[0] && this.state.icebergsPosition[0][1] === this.state.placementPlus10[1]){
      this.setState({plus10onExtremity:false, plus10mustDisapear:true})
    }
    if(this.state.plus10onExtremity){
      this.setState({plus10:true})
    }
    if(this.state.icebergsPosition[1][0] === this.state.icebergsPosition[3][0] && this.state.icebergsPosition[1][1] === this.state.icebergsPosition[3][1] && (this.state.icebergsPosition[3][0]!==0 && this.state.icebergsPosition[3][1]!==0)){
      this.setState({plus10onExtremity:true, placementPlus10:[this.state.icebergsPosition[3][0], this.state.icebergsPosition[3][1]]})
      console.log([this.state.icebergsPosition[3][0], this.state.icebergsPosition[3][1]])
    }else if(Math.random()*100<5){
      this.setState({plus10:true, placementPlus10:[this.state.icebergsPosition[3][0], this.state.icebergsPosition[3][1]]})
    }
    this.winPlus10()
  }

  winPlus10 = () => {
    if(this.state.bearPosition[0] === this.state.placementPlus10[0] && this.state.bearPosition[1] === this.state.placementPlus10[1] && this.state.plus10){
      this.setState({score:this.state.score+10, plus10:false, plus10mustDisapear:false, plus10onExtremity:false})
      Animated.timing(this.state.opacityPlus10,{toValue: 1,duration: 0,}).start(()=> {
        Animated.timing(this.state.opacityPlus10,{toValue: 0,duration: 800,}).start()
      });
      Animated.timing(this.state.sizePlus10,{toValue: 400, duration: 0,}).start(()=> {
        Animated.timing(this.state.sizePlus10,{toValue: 100, duration: 800,}).start()
      });
      Animated.timing(this.state.positionPlus10,{toValue: Constantes.screenWidth/numberSquares*(numberSquares/2)-400/2, duration: 0,}).start(()=> {
        Animated.timing(this.state.positionPlus10,{toValue: Constantes.screenWidth/numberSquares*(numberSquares/2), duration: 800,}).start()
      });
      Animated.timing(this.state.fontSizePlus10,{toValue:200, duration: 0,}).start(()=> {
        Animated.timing(this.state.fontSizePlus10,{toValue: 50, duration: 800,}).start()
      });
      this.setState({plus10:false})
    }
  }


  newIcePosition = (icebergsPosition) => {
    let oldI = icebergsPosition[this.state.numberOfIce-1][0]
    let oldJ = icebergsPosition[this.state.numberOfIce-1][1]
    let oldIMoinsUn = icebergsPosition[this.state.numberOfIce-2][0]
    let oldJMoinsUn = icebergsPosition[this.state.numberOfIce-2][1]
    let oldIMoinsDeux = icebergsPosition[this.state.numberOfIce-3][0]
    let oldJMoinsDeux = icebergsPosition[this.state.numberOfIce-3][1]
    let newI;
    let newJ;
    let directionColumn = Math.random()>0.5?true:false;
    if(directionColumn){
      let directionSecondaryDown = Math.random()>0.5?true:false;
      if(oldI > oldIMoinsUn || (oldI === oldIMoinsUn && oldIMoinsUn > oldIMoinsDeux)){
        directionSecondaryDown = true
      }else if(oldI < oldIMoinsUn || (oldI === oldIMoinsUn && oldIMoinsUn < oldIMoinsDeux)){
        directionSecondaryDown = false
      }
      if(oldI === 0){directionSecondaryDown = true}
      if(oldI === numberSquares-1){directionSecondaryDown = false}
      if(directionSecondaryDown){
        newI = oldI + 1;
        newJ = oldJ;
      }else{
        newI = oldI - 1;
        newJ = oldJ;
      }

    }else{
      let directionSecondaryRight = Math.random()>0.5?true:false;
      if(oldJ > oldJMoinsUn || (oldJ === oldJMoinsUn && oldJMoinsUn > oldJMoinsDeux)){
        directionSecondaryRight = true
      }else if(oldJ < oldJMoinsUn || (oldJ === oldJMoinsUn && oldJMoinsUn < oldJMoinsDeux)){
        directionSecondaryRight = false
      }
      if(oldJ === 0){directionSecondaryRight = true}
      if(oldJ === numberSquares-1){directionSecondaryRight = false}
      if(directionSecondaryRight){
        newI = oldI;
        newJ = oldJ + 1;
      }else{
        newI = oldI;
        newJ = oldJ - 1;
      }
    }

    return [newI, newJ]
  }

  isInIcebergsPosition = (i,j) => {
    for(k=0; k<this.state.icebergsPosition.length;k++){
      if(this.state.icebergsPosition[k][0] === i && this.state.icebergsPosition[k][1] === j){
        return true
      }
    }
    return false


  }




  backgroundImage = (i,j) => {

      if(this.state.randomImages === undefined){
        return require("../assets/images/ice/0.png")
      }else{
        let randomImage = this.state.randomImages[i][j]
        if(randomImage<Constantes.imagesIce.length && randomImage<this.state.numberOfShape-1){
          return Constantes.imagesIce[randomImage]
        }else{
          return require("../assets/images/ice/0.png")
        }
      }
  }

  displayImageChooser = () => {
    const column = []
    for (i=0; i<numberSquares;i++) {
      const line = []
      for (j=0; j<numberSquares;j++) {
        let random = Math.random()
        line.push(
          <ImageChooserBear line={j} column={i} key={[i,j]} pick={this.pick}
          backgroundImage={this.backgroundImage(i,j)}
          isDisplayed={this.isInIcebergsPosition(i,j)?true:false}
          dimension={Constantes.screenWidth/numberSquares}>
          </ImageChooserBear>)
      }
      column.push(<View style={{flexDirection:"row", height:Constantes.screenWidth/numberSquares}} key={i}>{line}</View>)
    }
    return <View style={{flexDirection:"column", width:Constantes.screenWidth, height:Constantes.screenWidth}}>{column}</View>
  }



  loose = () => {

    if(this.state.loose){
      return;
    }
    console.log("loose")
    this.stopTimer()
    this.setState({
      backgroundImageBear : require("../assets/images/bear/bearDied.png"),
      lost:true,
      icebergsPosition:[
        [-1,-1],
        [-1,-1],
        [-1,-1],
        [-1,-1],
      ],
    })
    if(this.state.score > this.props.accountState.account.bestScore || this.props.accountState.account.bestScore===undefined){
      this.bestScore()
    }
    this.setState({

    })

  }

  bestScore = () => {

    this.props.setBestScore(this.state.score)
    if(this.props.accountState.account.connected === true){
      API.setBestScore(this.state.score, this.props.accountState.account.id).then((data) => {
        console.log(data.data.score)
        API.getBestScore(this.props.accountState.account.id).then((data)=> {
          this.props.setBestScoreToRedux(data.data.bestScores, data.data.index)
        })
      })
    }
    this.setState({displayBestScore : true})
  }


  stopTimer = () => {
    clearInterval(myVar);
  }

  newGame = () => {
    myVar = setInterval(() => this.getTimerValue(), this.state.timeIceDisapear)
    Animated.timing(this.state.bearPositionDynamicI,{toValue: Constantes.screenWidth/numberSquares*(1/2+0)-25,duration: 50}).start();
    Animated.timing(this.state.bearPositionDynamicJ,{toValue: Constantes.screenWidth/numberSquares*(1/2+0)-25,duration: 50}).start();
    this.setState({
      backgroundImageBear : require("../assets/images/bear/bearRight.png"),
      icebergsPosition:[
        [0,0],
        [0,0],
        [0,0],
        [0,0]
      ],
      bearPosition:[0,0],
      numberOfIce : 4,
      timeIceDisapear : 1000,
      lost:false,
      score:0,
    });
  }

  moveBear = (direction) => {
    if(this.state.lost){
      return
    }
    let bearPosition = this.state.bearPosition
    if(direction === "up"){
      this.setState({backgroundImageBear : require("../assets/images/bear/bearUp.png"),})
      bearPosition[0] = bearPosition[0]-1;
      Animated.timing(this.state.bearPositionDynamicI,{toValue: Constantes.screenWidth/numberSquares*(1/2+bearPosition[0])-25,duration: 200}).start();
    }
    if(direction === "down"){
      this.setState({backgroundImageBear : require("../assets/images/bear/bearDown.png"),})
      bearPosition[0] = bearPosition[0]+1;
      Animated.timing(this.state.bearPositionDynamicI,{toValue: Constantes.screenWidth/numberSquares*(1/2+bearPosition[0])-25,duration: 200}).start();
    }
    if(direction === "right"){
      this.setState({backgroundImageBear : require("../assets/images/bear/bearLeft.png"),})
      bearPosition[1] = bearPosition[1]-1;
      Animated.timing(this.state.bearPositionDynamicJ,{toValue: Constantes.screenWidth/numberSquares*(1/2+bearPosition[1])-25,duration: 200}).start();
    }
    if(direction === "left"){
      this.setState({backgroundImageBear : require("../assets/images/bear/bearRight.png"),})
      bearPosition[1] = bearPosition[1]+1;
      Animated.timing(this.state.bearPositionDynamicJ,{toValue: Constantes.screenWidth/numberSquares*(1/2+bearPosition[1])-25,duration: 200}).start();
    }
    /*
    this.state.widthBear.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [50, 300, 400],
        extrapolate: 'clamp'
    })
    */
    Animated.timing(this.state.widthBear,{toValue: 90,duration: 100}).start(() => {
      Animated.timing(this.state.widthBear,{toValue: 50,duration: 100}).start()
    });

    let isOnIce = false
    for(k=0; k<this.state.icebergsPosition.length;k++){
      if(this.state.icebergsPosition[k][0] === bearPosition[0] && this.state.icebergsPosition[k][1] === bearPosition[1]){
        isOnIce = true
      }
    }
    if(!isOnIce){
      this.loose()
    }else {
      if(this.state.plus10){
        this.winPlus10()
      }
      this.setState({bearPosition : bearPosition})
    }
  }

  onSwipeUp = () => {
    this.moveBear("up")
  }
  onSwipeDown = () => {
    this.moveBear("down")
  }
  onSwipeLeft = () => {
    this.moveBear("left")
  }
  onSwipeRight = () => {
    this.moveBear("right")
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
              onSwipeUp={()=>this.moveBear("up")}
              onSwipeDown={()=>this.moveBear("down")}
              onSwipeLeft={()=>this.moveBear("right")}
              onSwipeRight={()=>this.moveBear("left")}
              config={config}
              style={{flex: 1,position:"absolute",top:0, left:0, zIndex:10,  height:"100%", width:"100%"}}
              >
              </GestureRecognizer>
          }
          {this.displayImageChooser()}
          <Animated.View style={{height:400, width:400, position:"absolute", opacity:this.state.opacityPlus10,
          flexDirection:"row", justifyContent:"center", alignItems:"center", textAlign:"center",
          bottom:this.state.positionPlus10,
          right:this.state.positionPlus10}}>
            <Animated.Text style={{fontSize:this.state.fontSizePlus10, color:"white", fontWeight:"bold"}}>+10
            </Animated.Text>
          </Animated.View>

          <Animated.Image style={{height:this.state.widthBear, width:this.state.widthBear, position:"absolute",
          top:this.state.bearPositionDynamicI,
          left:this.state.bearPositionDynamicJ}} source={this.state.backgroundImageBear}/>

          {this.state.plus10 &&
            <Image style={{height:50, width:50, position:"absolute",
            top:Constantes.screenWidth/numberSquares*(1/2+this.state.placementPlus10[0])-25,
            left:Constantes.screenWidth/numberSquares*(1/2+this.state.placementPlus10[1])-25}} source={require("../assets/images/plus.png")}/>
          }
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
                <TouchableOpacity onPress={() => this.moveBear("right")} style={{flexDirection: 'row', alignItems:"center", justifyContent:"center", borderWidth:0, backgroundColor:"rgba(255,255,255,0.5)", height:"100%", margin:1, borderColor:"rgba(200,200,200,1)"}}>
                  <View>
                    <Image style={{height:70, width:70, marginRight:20, borderRadius:35}} source={require("../assets/images/left.png")}/>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, flexDirection: 'column', alignItems:"center", justifyContent:"center", height:"100%"}}>
                <TouchableOpacity onPress={() => this.moveBear("up")} style={{flex:1, width:"100%", flexDirection: 'row', alignItems:"center", justifyContent:"center", borderWidth:0, backgroundColor:"rgba(255,255,255,0.5)", margin:1, borderColor:"rgba(200,200,200,1)"}}>
                  <View>
                    <Image style={{height:70, width:70, borderRadius:35}} source={require("../assets/images/up.png")}/>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.moveBear("down")} style={{flex:1, width:"100%",  flexDirection: 'row', alignItems:"center", justifyContent:"center", borderWidth:0, backgroundColor:"rgba(255,255,255,0.5)", margin:1, borderColor:"rgba(200,200,200,1)"}}>
                  <View>
                    <Image style={{height:70, width:70, borderRadius:35}} source={require("../assets/images/down.png")}/>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, flexDirection: 'column', height:"50%"}}>
                <TouchableOpacity onPress={() => this.moveBear("left")} style={{flexDirection: 'row', alignItems:"center", justifyContent:"center", borderWidth:0, backgroundColor:"rgba(255,255,255,0.5)", height:"100%", margin:1, borderColor:"rgba(200,200,200,1)"}}>
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
            <Image style={{height:"100%", width:"100%"}} source={Constantes.imagesBear[Math.floor(Math.random()*Constantes.imagesBear.length)]}/>
          </View>
          :
          null
        }
        {this.state.lost ?
          <View style={{ position:"absolute", right:20, bottom:150, borderRadius:5, borderWidth:1, backgroundColor:"rgba(255,255,255,0.7)", flexDirection:"row", textAlign:"center", alignItems:"center", padding:5, maxWidth:250}}>
            <Text style={{fontSize:15}}>{Constantes.textBear[Math.floor(Math.random()*Constantes.textBear.length)]}</Text>
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
