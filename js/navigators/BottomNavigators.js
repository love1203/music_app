import React,{Component} from 'react'
import {View,Text,Image} from 'react-native'
import {createBottomTabNavigator,createAppContainer} from 'react-navigation'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {BottomTabBar} from 'react-navigation-tabs'
import {connect} from 'react-redux'
import EventBus from "react-native-event-bus";

import HotPage from '../page/HotPage'
import QsPage from '../page/QsPage'
import CodePush from '../page/CodePush'
import MyPage from '../page/MyPage'
import MusicPage from '../page/MusicPage'

const TABS={
    HotPage:{
        screen:HotPage,
        navigationOptions:{
            tabBarLabel:'首页',
            tabBarIcon: ({ tintColor, focused }) => {
                let icon1 = <Image
                    source={require('../img/music1-1.png')}
                    style={{ width: 20, height: 20 }}
                />
                let icon2 = <Image
                    source={require('../img/music1.png')}
                    style={{ width: 20, height: 20 }}
                />
                let icon3 = focused ? icon1 : icon2
                return icon3
            }
        }
    },
    QsPage:{
        screen:QsPage,
        navigationOptions:{
            tabBarLabel:'发现',
            tabBarIcon: ({ tintColor, focused }) => {
                let icon1 = <Image
                    source={require('../img/music2-2.png')}
                    style={{ width: 20, height: 20 }}
                />
                let icon2 = <Image
                    source={require('../img/music2.png')}
                    style={{ width: 20, height: 20 }}
                />
                let icon3 = focused ? icon1 : icon2
                return icon3
            }
        }
    },
    MusicPage:{
        screen:MusicPage,
        navigationOptions:{
            tabBarLabel:'乐库',
            tabBarIcon: ({ tintColor, focused }) => {
                let icon1 = <Image
                    source={require('../img/music3-3.png')}
                    style={{ width: 20, height: 20 }}
                />
                let icon2 = <Image
                    source={require('../img/music3.png')}
                    style={{ width: 20, height: 20 }}
                />
                let icon3 = focused ? icon1 : icon2
                return icon3
            }
        }
    },
    MyPage:{
        screen:MyPage,
        navigationOptions:{
            tabBarLabel:'我的',
            tabBarIcon: ({ tintColor, focused }) => {
                let icon1 = <Image
                    source={require('../img/music4-4.png')}
                    style={{ width: 20, height: 20 }}
                />
                let icon2 = <Image
                    source={require('../img/music4.png')}
                    style={{ width: 20, height: 20 }}
                />
                let icon3 = focused ? icon1 : icon2
                return icon3
            }
        }
    }
};

class BottomNavigators extends Component{
    constructor(props){
        super(props)
    }
    _createBottomNav(){
        const {HotPage,QsPage,MusicPage,MyPage}=TABS
        if(this.tabs){
            return this.tabs
        }
        return this.tabs=createAppContainer(createBottomTabNavigator({HotPage,QsPage,MusicPage,MyPage},{
            tabBarComponent:props=>{return <CreateBottom color={'#ff3740'} {...props}/>},
            //initialRouteName:this.props.init,
            //backBehavior:'order',
            tabBarOptions:{
                style:{
                    height:50,
                    backgroundColor:'#fdfdff',
                    borderColor:'#e3e3e1'
                }
            }
        }))
    }

    render(){
        const BottomNav=this._createBottomNav()
        return <BottomNav
            onNavigationStateChange={(prevState,nextState,aciton)=>{
                EventBus.getInstance().fireEvent('enentClick',{
                    from:prevState.index,
                    to:nextState.index
                })
            }}
        />
    }
}

class CreateBottom extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.color}
        />
    }
}

const mapStateToProps=state=>({
    init:state.init.init,
})

export default connect(mapStateToProps)(BottomNavigators)