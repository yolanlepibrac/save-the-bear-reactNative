
import { ADD_CATEGORY, ADD_KEYWORD, RESET_CATEGORY, RESET_KEYWORD, SET_USEREMAIL, SET_ACCOUNTSTATE, CONNECT, DISPLAY_LOADING, SELECT_SHEETMENU, SET_NEW_BET, SET_BET_SELECTED, SET_BET_INACTIVE, SET_WINNER, SET_FRIENDSSTATE, GET_USERBETS, GET_USERFRIENDS, RESET_ACCOUNTSTATE, GET_USERWITNESSOF, UPDATE_WITNESSOF, ACCEPT_BET, REPLACE_FRIEND, SET_BEST_SCORE, SET_BEST_SCORES  } from "../constants/action-types";


export function setBestScore(bestScore) {
  return { type: SET_BEST_SCORE, bestScore }
};

export function setBestScoreToRedux(bestScores, indexRank) {
  return { type: SET_BEST_SCORES, bestScores, indexRank }
};

export function addCategory(category) {
  return { type: ADD_CATEGORY, category }
};

export function addKeyword(keyWord) {
  return { type: ADD_KEYWORD, keyWord }
};

export function resetCategory() {
  return { type: RESET_CATEGORY }
};

export function resetKeyword() {
  return { type: RESET_KEYWORD }
};

export function setUserEmail(email) {
  return { type: SET_USEREMAIL, email }
};

export function changeAccountState(account) {
  return { type: SET_ACCOUNTSTATE, account }
};

export function resetAccountState() {
  return { type: RESET_ACCOUNTSTATE }
};

export function getUserFriends(tabOfFriends) {
  return { type: GET_USERFRIENDS, tabOfFriends }
};

export function setFriendsState(friends ) {
  return { type: SET_FRIENDSSTATE, friends }
};

export function connectAccount(connected) {
  return { type: CONNECT, connected }
};

export function displayLoading(displayLoading) {
  return { type: DISPLAY_LOADING, displayLoading }
};

export function setSheetSelected(sheetSelected) {
  return { type: SELECT_SHEETMENU, sheetSelected }
};

export function setNewBet(newBet) {
  return { type: SET_NEW_BET, newBet }
}

export function setBetSelected(bet) {
  return { type: SET_BET_SELECTED, bet }
}

export function getUserBets(tabOfBets) {
  return { type: GET_USERBETS, tabOfBets }
}

export function getUserWitnessOf(tabOfWitnessOf) {
  return { type: GET_USERWITNESSOF, tabOfWitnessOf }
}

export function setBetInactive(betID) {
  return { type: SET_BET_INACTIVE, betID }
}

export function setWinner(bet, players1, players2) {
  return { type: SET_WINNER, bet : bet, players1 : players1, players2 : players2 }
}

export function updtateWitnessOf(bet) {
  return { type: UPDATE_WITNESSOF, bet }
}

export function acceptBet(newAccount, newBet) {
  return { type: ACCEPT_BET, newAccount : newAccount, newBet:newBet }
}

export function replaceFriend(friend) {
  return { type: REPLACE_FRIEND, friend }
}
