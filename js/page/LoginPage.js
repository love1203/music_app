import React,{Component} from 'react'
import {View,Text,Image,TouchableOpacity,StyleSheet,DeviceEventEmitter} from 'react-native'
import actions from '../action'
import BackPressComponent from '../utils/BackPressComponent'
import NavigationUtil from '../navigators/NavigationUtil'
import {connect} from 'react-redux'
class LoginPage extends Component{
    constructor(props){
        super(props)
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
    }

    componentDidMount() {
        this.backPress.componentDidMount()
        this.props.onBtn(false)
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }
    onBackPress() {
        this.onBack()
        return true
    }
    onBack() {
        NavigationUtil.goBack(this.props.navigation)
    }

    linkHome(){
        this.props.navigation.navigate('HomePage')
    }

    linkLogin(){
        NavigationUtil.toPage('PhonePage')
    }

    render(){
        return <View style={{flex:1,backgroundColor:'#dd2d20',position:'relative'}}>
            <Image source={require('../img/logo.png')} style={{width:90,height:90,alignSelf:'center',marginTop:100}} />
            <View style={{alignSelf:'center',width:200,position:"absolute",bottom:80}}> 
            <TouchableOpacity activeOpacity={0.6} onPress={()=>{this.linkLogin()}} style={styles.btnType}>
                <Text style={styles.textstyle}>手机号登录</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6} onPress={()=>{this.linkHome()}} style={styles.btnType}>
                <Text style={styles.textstyle}>立即体验</Text>
            </TouchableOpacity>
            </View>
        </View>
    }
}

const mapStateToProps = (state, ownProps) => {
    return{}
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onInit: (init) => {
            dispatch(actions.onInit(init))
        },
        onBtn: (btn) => {
            dispatch(actions.onBtn(btn))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginPage)

const styles=StyleSheet.create({
    btnType:{width:'100%',height:40,borderRadius:20,backgroundColor:'#fff',marginBottom:20},
    textstyle:{fontSize:13,color:'#dd2d20',textAlign:'center',lineHeight:40}
})