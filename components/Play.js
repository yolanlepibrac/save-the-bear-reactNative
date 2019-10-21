
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image, ScrollView } from 'react-native';
import { connect } from "react-redux";

import ImageChooser from "./ImageChooser"
import { changeAccountState } from "../redux/actions/index";
import { setBestScoreToRedux } from "../redux/actions/index";
import { setBestScore } from "../redux/actions/index";
import Constantes from "../utils/Constantes";
import API from "../utils/API";

const squareDimensions = 6;
const numberOfShapeBeggining = 10;
const numberOfShapeIncrease = 1;
const timeToPlayBeggining = 25;
const timeToPlayIncrease = 0.5;


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
      beginning : new Date().getTime(),
      secondPassed : 0,
      numberTap:0,
      wrong : {column:[], line:[]},
      randomImages : undefined,
      numberOfShape : numberOfShapeBeggining,
      score:0,
      lost:false,
      displayBestScore : false,
      timeToPlay : timeToPlayBeggining,
    };
  }

  componentDidMount = () => {
    myVar = setInterval(() => this.getTimerValue(), 1000)
    this.newSet(false)
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
    if(this.state.secondPassed === 0){
      this.loose()
      return;
    }
    this.setState({
      secondPassed : this.state.secondPassed-1
    })

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


        /*
        if(i%2===0&&j%2===0){
          image = Constantes.images4[this.state.randomImages[i][j].image4]
        }else if(i%2===0&&j%2===1){
          image = Constantes.images3[this.state.randomImages[i][j].image3]
        }else if(i%2===1&&j%2===0){
          image = Constantes.images2[this.state.randomImages[i][j].image2]
        }else{
          image = Constantes.images1[this.state.randomImages[i][j].image1]
        }
        return image
        */
      }

  }

  displayImageChooser = () => {
    const column = []
    for (i=0; i<squareDimensions;i++) {
      const line = []
      for (j=0; j<squareDimensions;j++) {
        let random = Math.random()
        line.push(
          <ImageChooser line={j} column={i} key={[i,j]} pick={this.pick}
          status={this.state.wrong.column.includes(i)||this.state.wrong.line.includes(j) ? false : true}
          backgroundImage={this.backgroundImage(i,j)}
          opacity={this.state.secondPassed<this.state.timeToPlay/2?(this.state.secondPassed)/(timeToPlayBeggining/2)+0.2:1}
          dimension={Constantes.screenWidth/squareDimensions}>
          </ImageChooser>)
      }
      column.push(<View style={{flexDirection:"row", height:Constantes.screenWidth/squareDimensions}} key={i}>{line}</View>)
    }
    return <View style={{flexDirection:"column", width:Constantes.screenWidth, height:Constantes.screenWidth}}>{column}</View>
  }

  pick = (column, line) => {
    console.log("pick")
    let wrong = this.state.wrong
    if(column === this.state.columnWin && line === this.state.lineWin){
      this.newSet(true)
      return;
    }
    if(this.backgroundImage(this.state.columnWin, this.state.lineWin) !== this.backgroundImage(column, line)){
      this.loose()
    }
    if(column !== this.state.columnWin){
      if(!wrong.column.includes(column)){
        wrong.column.push(column)
      }
    }
    if(line !== this.state.lineWin){
      if(!wrong.line.includes(line)){
        wrong.line.push(line)
      }
    }
    this.setState({wrong:wrong, numberTap:this.state.numberTap+1})
    //console.log(wrong)
  }

  loose = () => {
    if(this.state.loose){
      return;
    }
    console.log("loose")
    this.stopTimer()
    let wrong = this.state.wrong
    for (var i = 0; i < squareDimensions; i++) {
      if(i!==this.state.columnWin){
        if(!wrong.column.includes(i)){
          wrong.column.push(i)
        }
      }
    }
    for (var j = 0; j < squareDimensions; j++) {
      if(j!==this.state.columnWin){
        if(!wrong.line.includes(j)){
          wrong.line.push(j)
        }
      }
    }
    this.setState({lost:true})
    if(this.state.score > this.props.accountState.account.bestScore || this.props.accountState.account.bestScore===undefined){
      this.bestScore()
    }
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


  newSet = (isNotFirstSet) => {
    this.setRandomImages()
    if(isNotFirstSet){
      this.setState({score : this.state.score + this.state.secondPassed,})
    }
    this.setState({
      lineWin : Math.floor(Math.random()*squareDimensions),
      columnWin : Math.floor(Math.random()*squareDimensions),
      wrong : {column:[], line:[]},
      secondPassed : Math.floor(this.state.timeToPlay),
      numberOfShape : this.state.numberOfShape<Constantes.imagesIce.length?this.state.numberOfShape+numberOfShapeIncrease:this.state.numberOfShape,
      timeToPlay : this.state.timeToPlay-timeToPlayIncrease

    })
  }

  setRandomImages = () => {
    let randomImages = [];
    for (var i = 0; i <squareDimensions; i++) {
      randomImages[i] = []
      for (var j = 0; j <squareDimensions; j++) {
        randomImages[i][j] = Math.floor(Math.random()*this.state.numberOfShape)
      }
    }
    this.setState({
      randomImages : randomImages,
    })
  }

  stopTimer = () => {
    clearInterval(myVar);
  }

  newGame = () => {
    myVar = setInterval(() => this.getTimerValue(), 1000)
    this.setState({score:0, numberOfShape : numberOfShapeBeggining, timeToPlay:timeToPlayBeggining, lost:false,  displayBestScore : false});
    this.newSet(false);
  }




  render(){
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

        <View style={{marginTop:20}}>{this.displayImageChooser()}</View>

        {this.state.lost ?
          <View style={{flex:1, flexDirection: 'column', width:"100%", marginTop:20, alignItems:"center", justifyContent:"center"}}>
            <Text style={{color:"white"}}></Text>
            <View style={{height:100, width:100}}>
            </View>
          </View>
          :
          <View style={{flex:1, flexDirection: 'column', width:"100%", marginTop:20, alignItems:"center", justifyContent:"center"}}>
            <Text style={{color:"white"}}>Seal is here</Text>
            <View style={{height:100, width:100}}>
              <Image style={{height:100, width:100}} source={this.backgroundImage(this.state.columnWin, this.state.lineWin)}/>
              <Image style={{height:20, width:50, position:"absolute", top:20, left:30}} source={require("../assets/images/seal/seal.png")}/>
            </View>
          </View>
        }

        {this.state.lost ?
          <View style={{width:"100%", height:200, position:"absolute", right:0, bottom:0}}>
            <Image style={{height:"100%", width:"100%"}} source={Constantes.imagesSeal[Math.floor(Math.random()*Constantes.imagesSeal.length)]}/>
          </View>
          :
          null
        }
        {this.state.lost ?
          <View style={{ position:"absolute", right:20, bottom:150, borderRadius:5, borderWidth:1, backgroundColor:"rgba(255,255,255,0.7)", flexDirection:"row", textAlign:"center", alignItems:"center", padding:5, maxWidth:250}}>
            <Text style={{fontSize:15}}>{Constantes.textSeal[Math.floor(Math.random()*Constantes.textSeal.length)]}</Text>
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
