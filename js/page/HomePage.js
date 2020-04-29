import React,{Component} from 'react'
import {View,Text} from 'react-native'
import BottomNavigators from '../navigators/BottomNavigators'
import NavigationUtil from '../navigators/NavigationUtil'
import {connect} from 'react-redux'
import actions from '../action'


class HomePage extends Component{
    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.props.onBtn(true)
    }

    render(){
        NavigationUtil.navigation=this.props.navigation
        return <View style={{flex:1}}>
            
            <BottomNavigators/>
        </View>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        btn: state.btn.btn
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onBtn: (btn) => {
            dispatch(actions.onBtn(btn))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomePage)