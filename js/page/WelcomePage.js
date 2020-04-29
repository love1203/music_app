import React,{Component} from 'react'
import {View,Text} from 'react-native'
import SplashScreen from 'react-native-splash-screen';
import NavigationUtil from '../navigators/NavigationUtil'
class WelcomePage extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        NavigationUtil.resetToHomePage(this.props)
        // SplashScreen.hide();
    }
    componentWillUnmount(){
        if(this.timer){
            clearTimeout(this.timer)
        }
    }
    render(){
        return(
            <View>
                <Text>WelcomePage</Text>
            </View>
        )
    }
}

export default WelcomePage