import { SET_ACCOUNTSTATE, CONNECT, SET_NEW_BET, SET_BET_SELECTED, SET_BET_INACTIVE, SET_WINNER, SET_FRIENDSSTATE, GET_USERBETS, GET_USERFRIENDS, RESET_ACCOUNTSTATE, GET_USERWITNESSOF, UPDATE_WITNESSOF, ACCEPT_BET, REPLACE_FRIEND, SET_BEST_SCORE, SET_BEST_SCORES  } from "../constants/action-types";

const initialState = {
  connectedRedux:false,

  accountStateRedux:{
    bestScores : [],
    indexRank:0,
    account:{
      bestScore:0,
      id:2000,
      userName:"yolan",
      email:"",
      imageProfile:"",

    },
  }
}


function accountReducer(state = initialState, action) {
  let nextState
  let newBets
  let newAccountState

  switch (action.type) {

    case SET_BEST_SCORE:
        newAccountState =  state.accountStateRedux;
        newAccountState.account.bestScore = action.bestScore;
        nextState = {
          ...state,
          accountStateRedux: newAccountState,
        }
      return nextState || state
    break;

    case SET_BEST_SCORES:
        newAccountState =  state.accountStateRedux;
        newAccountState.bestScores = action.bestScores;
        newAccountState.indexRank = action.indexRank+1;
        nextState = {
          ...state,
          accountStateRedux: newAccountState,
        }
      return nextState || state
    break;

    case CONNECT:
          nextState = {
            ...state,
            connectedRedux: action.connected
          }
        return nextState || state
    break;

    case SET_ACCOUNTSTATE:
          newAccountState =  state.accountStateRedux;
          newAccountState.account = action.account;
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
        return nextState || state
    break;

    case RESET_ACCOUNTSTATE:
          newAccountState =  state.accountStateRedux;
          newAccountState.bets = [];
          newAccountState.friends = [];
          newAccountState.account = {};
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
          //console.log(action.account)
        return nextState || state
    break;

    case GET_USERFRIENDS:
          newAccountState =  state.accountStateRedux;
          newAccountState.friends = action.tabOfFriends;
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
        return nextState || state
    break;

    case SET_FRIENDSSTATE:
          newAccountState =  state.accountStateRedux;
          newAccountState.friends = action.friends;
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
        return nextState || state
    break;

    case SET_NEW_BET:
          newAccountState = state.accountStateRedux
          newAccountState.bets.push(action.newBet)
          nextState = {
            ...state,
            accountState: newAccountState
          }
          console.log(nextState)
        return nextState || state
    break;

    case GET_USERBETS:
          newAccountState = state.accountStateRedux
          newAccountState.bets = action.tabOfBets
          nextState = {
            ...state,
            accountState: newAccountState
          }
          //console.log(action.tabOfBets)
        return nextState || state
    break;

    case GET_USERWITNESSOF:
        newAccountState = state.accountStateRedux
        newAccountState.witnessOf = action.tabOfWitnessOf
        nextState = {
          ...state,
          accountState: newAccountState
        }
        //console.log(action.tabOfWitnessOf)
      return nextState || state
    break;

/*
    case SET_BET_SELECTED:
          newAccountState = state.accountStateRedux
          newAccountState.currentBet = action.bet
          nextState = {
            ...state,
            currentBet: newAccountState
          }
        return nextState || state
    break;

    case SET_BET_INACTIVE:
          newAccountState = state.accountStateRedux
          newAccountState.bets[action.betID].statusCurrent = false;
          nextState = {
            ...state,
            myBets: newBets
          }
        return nextState || state
    break;
*/
    case REPLACE_FRIEND:
        newAccountState = state.accountStateRedux
        for (var i = 0; i < newAccountState.friends.length; i++) {
          if(newAccountState.friends[i].id === action.friend.id){
            newAccountState.friends[i] = action.friend
          }
        }
        if(newAccountState.account.id === action.friend.id){
          newAccountState.account = action.friend
        }
        nextState = {
          ...state,
          accountStateRedux: newAccountState
        }
      return nextState || state
    break;


    case SET_WINNER:
          newAccountState = state.accountStateRedux
          for (var i = 0; i < newAccountState.witnessOf.length; i++) {
            if(newAccountState.witnessOf[i].id === action.bet.id){
              newAccountState.witnessOf[i] = action.bet
            }
          }
          for (var i = 0; i < action.players1.length; i++) {
            for (var j = 0; j < newAccountState.friends.length; j++) {
              if(newAccountState.friends[j].id === action.players1[i].id){
                newAccountState.friends[j] = action.players1[i]
              }
            }
            if(newAccountState.account.id === action.players1[i].id){
              newAccountState.account = action.players1[i]
            }
          }
          for (var i = 0; i < action.players2.length; i++) {
            for (var j = 0; j < newAccountState.friends.length; j++) {
              if(newAccountState.friends[j].id === action.players2[i].id){
                newAccountState.friends[j] = action.players2[i]
              }
            }
            if(newAccountState.account.id === action.players2[i].id){
              newAccountState.account = action.players2[i]
            }
          }
          nextState = {
            ...state,
            accountStateRedux: newAccountState
          }
        return nextState || state
    break;

    case ACCEPT_BET:
          newAccountState = state.accountStateRedux
          newAccountState.account = action.newAccount
          for (var i = 0; i < newAccountState.bets.length; i++) {
            if(newAccountState.bets[i].id === action.newBet.id){
              newAccountState.bets[i] = action.newBet
            }
          }
          nextState = {
            ...state,
            accountStateRedux: newAccountState
          }
          console.log(newAccountState)
        return nextState || state
    break;

    case UPDATE_WITNESSOF:
    newAccountState = state.accountStateRedux
    for (var i = 0; i < newAccountState.witnessOf.length; i++) {
      if(newAccountState.witnessOf[i].id === action.bet.id){
        newAccountState.witnessOf[i] = action.bet
      }
    }
    nextState = {
      ...state,
      accountStateRedux: newAccountState
    }
    //console.log(newAccountState)
  return nextState || state
break;

    default:;

  }
  return state;
}
export default accountReducer;
