import AsyncStorage from '@react-native-community/async-storage';

export default{
    async getLoginState(){
        let res=await AsyncStorage.getItem('loginToken')
        if(res){
            return true
        }else{
            return false
        }
    },

    async setUser(list){
        let res=await AsyncStorage.setItem('newUser',JSON.stringify(list))
        
    },

    async getUser(){
        let res=await AsyncStorage.getItem('newUser')
        return res
    },

    async loginOut(){
        let res=await AsyncStorage.removeItem('loginToken')
        let res1=await AsyncStorage.removeItem('userInfo')
    },

    async setSongsList(list){
        let res=await AsyncStorage.setItem('songsList',JSON.stringify(list))
    },

    async getSongsList(){
        let res=await AsyncStorage.getItem('songsList')
        return res
    }

}

