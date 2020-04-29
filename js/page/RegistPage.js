import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import BackPressComponent from '../utils/BackPressComponent'
import NavigationUtil from '../navigators/NavigationUtil'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-easy-toast'
import API from '../api/music'
import {connect} from 'react-redux'
import actions from '../action'

class PhonePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nickname: '',
            phone: '',
            password: '',
            captcha: '',
            yzType: true,
            numTimer: 60
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
    linkPhone() {
        NavigationUtil.toPage('PhonePage')
    }

    setBtn() {
        if (this.state.yzType) {
            return <Text style={{ paddingRight: 15, paddingLeft: 15, backgroundColor: '#dd2d20', height: 40, lineHeight: 40, color: '#fff', marginTop: 20, borderRadius: 20 }}>发送验证码</Text>
        } else {
            return <Text style={{ paddingRight: 15, paddingLeft: 15, backgroundColor: '#f3f3f3', height: 40, lineHeight: 40, color: '#999', marginTop: 20, borderRadius: 20 }}>{this.state.numTimer}秒后重新发送</Text>
        }
    }

    onYz() {
        if (!this.state.yzType) {
            return
        }
        if (!this.state.phone) {
            this.refs.toast.show('请输入手机号')
            return
        }
        let res = API.sentcaptcha({ phone: this.state.phone })
            .then(res => {
                if (res.code == 200) {
                    console.log(res)
                    this.setState({
                        yzType: false
                    })
                    let num1 = 60
                    let timer = setInterval(() => {

                        let num = num1--
                        console.log(num)
                        this.setState({
                            numTimer: num
                        })
                        if (num == 0) {
                            clearInterval(timer)
                            this.setState({
                                numTimer: 60,
                                yzType: true
                            })
                        }
                    }, 1000)
                } else {
                    this.refs.toast.show(res.message)
                }
            })
    }

    handleRegister() {
        if (!this.state.nickname) {
            this.refs.toast.show('请输入昵称')
            return
        }
        if (!this.state.phone) {
            this.refs.toast.show('请输入手机号')
            return
        }
        if (!this.state.captcha) {
            this.refs.toast.show('请输入验证码')
            return
        }
        if (!this.state.password) {
            this.refs.toast.show('请输入密码')
            return
        }
        let config = {
            nickname: this.state.nickname,
            phone: this.state.phone,
            captcha: this.state.captcha,
            password: this.state.password
        }
        console.log(config)
        let res = API.register(config)
            .then(res => {
                if (res.code == 200) {
                    this.refs.toast.show('注册成功，请登录')
                    NavigationUtil.toPage('PhonePage')
                } else {
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
                    <Text style={{ fontSize: 19, fontWeight: '700', lineHeight: 50 }}>手机号注册</Text>
                </View>
                <Text style={{ color: '#999' }}>已有账号，请点击<Text style={{ color: '#dd2d20', marginLeft: 2 }} onPress={() => { this.linkPhone() }}>登录</Text></Text>
                <View style={{ marginTop: 50 }}>
                    <TextInput
                        style={styles.keyWord}
                        ref='input'
                        placeholder={'请输入昵称'}
                        placeholderTextColor={'#ccc'}
                        // password={true}
                        keyboardType={'default'}
                        keyboardAppearance={'default'}
                        multiline={true}
                        clearButtonMode={'unless-editing'}
                        blurOnSubmit={false}
                        autoCorrect={false}
                        autoFocus={false}
                        onChangeText={(nickname) => this.setState({ nickname })}
                        value={this.state.nickname}
                    />
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
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', display: 'flex' }}>
                        <TextInput
                            style={styles.yzm}
                            ref='input'
                            placeholder={'请输入验证码'}
                            placeholderTextColor={'#ccc'}
                            //password={true}
                            secureTextEntry={true}
                            keyboardType={'default'}
                            keyboardAppearance={'default'}
                            multiline={true}
                            clearButtonMode={'unless-editing'}
                            blurOnSubmit={false}
                            autoCorrect={false}
                            autoFocus={false}
                            onChangeText={(captcha) => this.setState({ captcha })}
                            value={this.state.captcha}
                        />
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { this.onYz() }}>
                            {this.setBtn()}
                        </TouchableOpacity>
                    </View>
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
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { this.handleRegister() }} style={{ width: '100%', height: 40, borderRadius: 20, backgroundColor: '#dd2d20', marginTop: 20 }}>
                        <Text style={{ textAlign: 'center', lineHeight: 40, color: '#fff' }}>注册</Text>
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
        marginBottom: 10
    },
    yzm: {
        marginTop: 10,
        fontSize: 17,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 10,
        flex: 1
    }
})