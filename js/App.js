import React, { Component } from 'react'
import { View, Text, StatusBar, TouchableOpacity,DeviceEventEmitter,Dimensions,StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import AppNavigators from './navigators/AppNavigators'
import store from './store'
import StatusBarPage from './components/StatusBarPage'
import Music from './components/Music'
import PlayPage from './page/PlayPage'
import Video from 'react-native-video'
import actions from './action'
import NavigationUtil from './navigators/NavigationUtil'
var { width, height } = Dimensions.get('window');
import Fontisto from 'react-native-vector-icons/Fontisto'
import SplashScreen from 'react-native-splash-screen';
import util from './utils/util'

class App extends Component {
    constructor(props) {
        super(props)
        let list=store.getState().nav.routes[1].routes
        let nowRotue=list[list.length-1].routeName
        this.state = {
            type:false,
            btnShow:true,
            btnNewShow:false
        }
    }

    componentDidMount() {
        SplashScreen.hide();
        this.playMusic=DeviceEventEmitter.addListener('playMusic',(index)=>{
            this.refs.playPage.onShowPage(index)
        })

        this.closePage=DeviceEventEmitter.addListener('closePage',()=>{
            this.setState({
                type:false,
                btnShow:true
            })
        })

        let res=util.getSongsList()
        .then(res=>{
            if(res){
                let list=JSON.parse(res)
                if(list.length>0){
                    console.log(list)
                    store.dispatch(actions.onMusic(list))
                }
            }
        })

        let res1=util.getUser()
        .then(res1=>{
            if(res1){
                let list=JSON.parse(res1)
                store.dispatch(actions.onUser(list))
            }
        })

        setInterval(()=>{
            let list=store.getState().nav.routes[1].routes
            let nowRotue=list[list.length-1].routeName
            if(nowRotue=='LoginPage'||nowRotue=='PhonePage'||nowRotue=='RegistPage'||nowRotue=='ShezhiPage'){
                this.setState({
                    btnNewShow:false
                })
            }else{
                this.setState({
                    btnNewShow:true
                })
            }
        },1000)
        
    }

    onCloseBtn(){
        this.setState({
            btnShow:false
        })
    }
    
    componentWillUnmount() {
        if(this.playMusic){
            this.playMusic.remove()
        }
        if(this.closePage){
            this.closePage.remove()
        }
    }

    onMusic(){ 
       let arr=store.getState().music.music
       console.log(arr)
       if(arr&&arr.length>0){
        this.setState({
            type:true,
            btnShow:false
        })
        
        
       } 
    }

    setPage(){
        if(this.state.type){
            return <View style={{position:'absolute',width:width,height:height+50,backgroundColor:'red',bottom:0,top:0}}>
                <PlayPage  ref={'playPage'}></PlayPage>
            </View>
        }else{
            return <View style={{position:'absolute',width:width,height:height+50,backgroundColor:'red',bottom:0,top:0,left:width}}>
            <PlayPage  ref={'playPage'}></PlayPage>
        </View>
        }
    }

    setBtn(){
        if(this.state.btnShow){
            if(this.state.btnNewShow){
                return <TouchableOpacity style={styles.cont} activeOpacity={0.6} onPress={() => { this.onMusic() }}>
                <Fontisto name={'youtube-play'} size={22} color={'#fff'} style={{textAlign:'center',alignSelf:'center'}} />
            </TouchableOpacity>
            }else{
                return null
            }
            
        }else{
            return null
        }
    }

    render() {
        return <Provider store={store}>
            <StatusBarPage type={'dark-content'}></StatusBarPage>
            <AppNavigators />
            {/* <Music ref={'music'}></Music> */}
            {this.setPage()}
            
            {this.setBtn()}
            
            

        </Provider>
    }
}



export default App

const styles=StyleSheet.create({
    cont:{
        position: 'absolute', width: 60, height: 60, backgroundColor: 'red', bottom: 60, right: 10, borderRadius: 30,justifyContent:'center',
        elevation: 3,  //  设置阴影角度，通过这个设置有无阴影（这个是最重要的，决定有没有阴影）


    }
})



