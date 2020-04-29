import React,{Component} from 'react'
import {StatusBar, View} from 'react-native'

export default class StatusBarPage extends Component{
    constructor(props){
        
        super(props)
    }
    //dark-content  light-content

    render(){
        return <View>
            <StatusBar barStyle={this.props.type} backgroundColor={'rgba(255,255,255,0)'} translucent={true}/>
        </View>
    }
}