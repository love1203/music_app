import React, { Component } from 'react'
import { View, Text, TouchableOpacity,StyleSheet,TextInput,DeviceEventEmitter } from 'react-native'
import BackPressComponent from '../utils/BackPressComponent'
import NavigationUtil from '../navigators/NavigationUtil'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-easy-toast'
import AsyncStorage from '@react-native-community/async-storage';
import API from '../api/music'
import {connect} from 'react-redux'
import actions from '../action'
import util from '../utils/util'
class PhonePage extends Component {
    constructor(props) {
        super(props)
        this.state={
            phone:'',
            password:''
        }
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
    linkReg(){
        NavigationUtil.toPage('RegistPage')
    }

    login(){
        if (!this.state.phone) {
            this.refs.toast.show('请输入手机号')
            return
        }
        if (!this.state.password) {
            this.refs.toast.show('请输入密码')
            return
        }
        let config = {
            phone: this.state.phone,
            password: this.state.password
        }
        console.log(config)
        let res=API.cellphone(config)
        .then(res=>{
            if(res.code==200){
                let res1=API.initprofile({nickname:'夏夏夜夜夜'})
                .then(res1=>{
                    if(res1.code==200){
                        this.props.onUser({loginType:res.token,data:res1.profile})
                        util.setUser({loginType:res.token,data:res1.profile})
                        
                    }else{
                        this.props.onUser({loginType:res.token,data:res.profile})
                        util.setUser({loginType:res.token,data:res.profile})
                    }
                    DeviceEventEmitter.emit('addClick')
                    NavigationUtil.toPage('HomePage')
                })
                

            }else{
                this.refs.toast.show(res.message)
            }
        })
    }

    render() {
        return <View style={{ flex: 1 }}>
            <View style={{ padding: 14, marginTop: 50 }}>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', height: 50 }}>
                    <TouchableOpacity style={{ marginRight: 5 }} activeOpacity={0.6} onPress={() => { this.onBack() }}>
                        <Ionicons name={'ios-arrow-round-back'} size={35} style={{ lineHeight: 50 }}></Ionicons>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 19, fontWeight: '700', lineHeight: 50 }}>手机号登录</Text>
                </View>
                <Text style={{color:'#999'}}>暂无账号，请点击<Text style={{color:'#dd2d20',marginLeft:2}} onPress={()=>{this.linkReg()}}>注册</Text></Text>
                <View style={{marginTop:50}}>
                <TextInput
                    style={styles.keyWord}
                    ref='input'
                    placeholder={'请输入手机号'}
                    placeholderTextColor={'#ccc'}
                    // password={true}
                    secureTextEntry={true}
                    keyboardType={'default'}
                    keyboardAppearance={'default'}
                    multiline={true}
                    clearButtonMode={'unless-editing'}
                    blurOnSubmit={false}
                    autoCorrect={false}
                    autoFocus={false}
                    onChangeText={(phone) => this.setState({ phone })}
                    value={this.state.phone}
                />
                <TextInput
                    style={styles.keyWord}
                    ref='input'
                    placeholder={'请输入密码'}
                    placeholderTextColor={'#ccc'}
                    password={true}
                    secureTextEntry={true}
                    keyboardType={'default'}
                    keyboardAppearance={'default'}
                    clearButtonMode={'unless-editing'}
                    blurOnSubmit={false}
                    autoCorrect={false}
                    autoFocus={false}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                />
                <TouchableOpacity activeOpacity={0.6} onPress={()=>{this.login()}} style={{width:'100%',height:40,borderRadius:20,backgroundColor:'#dd2d20',marginTop:20}}>
                    <Text style={{textAlign:'center',lineHeight:40,color:'#fff'}}>登录</Text>
                </TouchableOpacity>
                </View>
            </View>
            <Toast ref="toast" position='top' />
        </View>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onUser: (user) => {
            dispatch(actions.onUser(user))
        },
        onBtn: (btn) => {
            dispatch(actions.onBtn(btn))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PhonePage)



const styles = StyleSheet.create({
    keyWord: {
        marginTop: 10,
        fontSize: 17,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom:10
    }
})