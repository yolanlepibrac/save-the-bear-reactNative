import axios from 'axios';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',

}

//const burl = "http://108.162.229.112:8000"
const burl = "https://find-the-seal.herokuapp.com"


export default {
    login : function(email,password) {
        return axios.post(burl + '/user/login',{'email' : email,'password' : password},{headers: headers})
    },

    signup : function(send){
        return axios.post(burl + '/user/signup',send,{headers: headers})
    },
    updatePassword: function(id, oldPassword, newPassword) {
        return axios.post(burl + '/user/updatePassword',{'id' : id, 'oldPassword' : oldPassword, 'newPassword' : newPassword, },{headers: headers})
    },
    updateEmail: function(oldEmail, newEmail) {
        return axios.post(burl + '/user/updateEmail',{'oldEmail' : oldEmail, 'newEmail' : newEmail },{headers: headers})
    },
    setBestScore : function(score, id) {
        return axios.post(burl + '/user/setBestScore',{'score' : score, "id":id},{headers: headers})
    },
    getBestScore : function(id) {
        return axios.post(burl + '/user/getBestScore',{"id":id},{headers: headers})
    },
    searchFriends: function(searchedText){
        return axios.post(burl + '/user/searchFriends',{'userName':searchedText},{headers: headers})
    },
    toggleFriend: function(idOfMyAccount, tabOfIdOfFriends){
        return axios.post(burl + '/user/toggleFriend',{'idOfMyAccount':idOfMyAccount,'updatedFields':{"friends":tabOfIdOfFriends}},{headers: headers})
    },
    createBet: function(newBet){
        return axios.post(burl + '/user/createBet',newBet,{headers: headers})
    },
    updateUserBets : function(id, props){
        return axios.post(burl + '/user/createBet',{'updatedFields' : props,'id':id,},{headers: headers})
    },
    getBetDataByID: function(id){
        return axios.post(burl + '/user/getBetDataByID',{'id':id},{headers: headers})
    },
    getBetsDataByID: function(tabOfId){
        return axios.post(burl + '/user/getBetsDataByID',{'tabOfId':tabOfId},{headers: headers})
    },
    isAuth : function() {
        return (localStorage.getItem('token') !== null);
    },
    logout : function() {
        localStorage.clear();
    },
    getUserDataByEmail :function(email){
      return axios.post(burl + '/user/getUserDataByEmail',{'email' : email,},{headers: headers})
    },
    getUserDataByID :function(id){
      return axios.post(burl + '/user/getUserDataByID',{'id' : id,},{headers: headers})
    },
    getUsersDataByID :function(tabOfId){
      //console.log(tabOfId)
      return axios.post(burl + '/user/getUsersDataByID',{'tabOfId' : tabOfId,},{headers: headers})
    },
    setUserInfo:function(props, id){
      return axios.post(burl + '/user/setUserInfo',{'updatedFields' : props,'id' : id,},{headers: headers})
    },
    newEmail:function(props, email){
      return axios.post(burl + '/user/newEmail',{'updatedFields' : props,'email' : email,},{headers: headers})
    },
    setWinner:function(bet, win, increment){
      return axios.post(burl + '/user/setWinner',{'bet' : bet,'win' : win, 'increment':increment },{headers: headers})
    },
    acceptBet:function(userData, bet, accepted){
      return axios.post(burl + '/user/acceptBet',{"userID":userData.id, "betID":bet.id, "accepted":accepted },{headers: headers})
    },
    noteFriend:function(friendNoteGiver, friendNoted, note){
      return axios.post(burl + '/user/noteFriend',{"note":note, "friendNoted":friendNoted, "friendNoteGiver":friendNoteGiver },{headers: headers})
    },
}
