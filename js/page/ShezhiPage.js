import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, findNodeHandle, DeviceEventEmitter, RefreshControl, TextInput } from 'react-native'
import BackPressComponent from '../utils/BackPressComponent'
import NavigationUtil from '../navigators/NavigationUtil'
import API from '../api/music'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Toast from 'react-native-easy-toast'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import actions from '../action'
import util from '../utils/util'

class ShezhiPage extends Component {
    constructor(props) {
        super(props)
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
        this.state = {
            dialog: false,
            nickname: '',
            gxdialog:false,
            signature:''
        }
    }

    componentDidMount() {
        this.backPress.componentDidMount()
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }
    onBackPress() {
        this.onBack()
        return true
    }
    onBack() {
        DeviceEventEmitter.emit('addClick')
        NavigationUtil.goBack(this.props.navigation)
    }

    closeDialog() {
        this.setState({ dialog: false })
    }

    closegxDialog() {
        this.setState({ gxdialog: false })
    }

    createPlayList() {
        let data = this.props.user.data
        console.log(data)
        let config = {
            gender: data.gender,
            birthday: data.birthday,
            nickname: this.state.nickname,
            province: data.province,
            city: data.city,
            signature: data.signature,
        }
        if (!this.state.nickname) {
            this.refs.toast.show('请输入昵称')
            return
        }
        let res = API.updateuser(config)
            .then(res => {
                if (res.code == 200) {
                    API.userdetail({ uid: data.userId })
                        .then(res1 => {
                            if (res1.code == 200) {
                                let obj = {
                                    loginType: this.props.user.loginType,
                                    data: res1.profile
                                }
                                this.props.onUser(obj)
                                util.setUser(obj)
                                this.refs.toast.show('修改成功')
                                this.setState({
                                    dialog: false,
                                    nickname:''
                                })
                            }
                        })
                } else {
                    this.refs.toast.show(res.message)
                }
            })
    }

    creategx() {
        let data = this.props.user.data
        console.log(data)
        let config = {
            gender: data.gender,
            birthday: data.birthday,
            nickname: data.nickname,
            province: data.province,
            city: data.city,
            signature: this.state.signature,
        }
        console.log(config)
        if (!this.state.signature) {
            this.refs.toast.show('请输入个性签名')
            return
        }
        let res = API.updateuser(config)
            .then(res => {
                if (res.code == 200) {
                    API.userdetail({ uid: data.userId })
                        .then(res1 => {
                            if (res1.code == 200) {
                                console.log(res1.profile)
                                let obj = {
                                    loginType: this.props.user.loginType,
                                    data: res1.profile
                                }
                                this.props.onUser(obj)
                                util.setUser(obj)
                                this.refs.toast.show('修改成功')
                                this.setState({
                                    gxdialog: false,
                                    signature:''
                                })
                            }
                        })
                } else {
                    this.refs.toast.show(res.message)
                }
            })
    }

    setDialog() {
        if (this.state.dialog) {
            return <View style={{ padding: 20, justifyContent: 'center', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, }}>
                <TouchableOpacity style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', }} onPress={() => { this.closeDialog() }} activeOpacity={1}></TouchableOpacity>
                <View style={{ width: '100%', height: 200, backgroundColor: '#fff', borderRadius: 5, alignSelf: 'center', padding: 14 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 10 }}>修改昵称</Text>
                    <TextInput
                        style={styles.keyWord}
                        ref='input'
                        placeholder={'请输入昵称'}
                        placeholderTextColor={'#ccc'}
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
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { this.createPlayList() }} style={{ width: 80, height: 40, borderRadius: 5, backgroundColor: '#dd2d20', marginTop: 20, alignSelf: 'flex-end' }}>
                        <Text style={{ textAlign: 'center', lineHeight: 40, color: '#fff' }}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        } else {
            return null
        }
    }

    setgxDialog() {
        if (this.state.gxdialog) {
            return <View style={{ padding: 20, justifyContent: 'center', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, }}>
                <TouchableOpacity style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', }} onPress={() => { this.closegxDialog() }} activeOpacity={1}></TouchableOpacity>
                <View style={{ width: '100%', height: 200, backgroundColor: '#fff', borderRadius: 5, alignSelf: 'center', padding: 14 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 10 }}>个性签名</Text>
                    <TextInput
                        style={styles.keyWord}
                        ref='input'
                        placeholder={'请输入个性签名'}
                        placeholderTextColor={'#ccc'}
                        keyboardType={'default'}
                        keyboardAppearance={'default'}
                        multiline={true}
                        clearButtonMode={'unless-editing'}
                        blurOnSubmit={false}
                        autoCorrect={false}
                        autoFocus={false}
                        onChangeText={(signature) => this.setState({ signature })}
                        value={this.state.signature}
                    />
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { this.creategx() }} style={{ width: 80, height: 40, borderRadius: 5, backgroundColor: '#dd2d20', marginTop: 20, alignSelf: 'flex-end' }}>
                        <Text style={{ textAlign: 'center', lineHeight: 40, color: '#fff' }}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        } else {
            return null
        }
    }

    loginout() {
        this.props.onUser({})
        NavigationUtil.toPage('LoginPage')
        util.setUser({})
    }

    setBtn() {
        if (this.props.user.loginType) {
            return <TouchableOpacity activeOpacity={0.6} onPress={() => { this.loginout() }} style={{ width: '100%', height: 50, backgroundColor: '#fff',marginTop:10 }}>
                <Text style={{ textAlign: 'center', lineHeight: 50, color: '#dd2d20' }}>退出</Text>
            </TouchableOpacity>
        } else {
            return null
        }
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', height: 78, paddingLeft: 14, backgroundColor: '#fff', paddingTop: 28 }}>
                <TouchableOpacity style={{ marginRight: 5 }} activeOpacity={0.6} onPress={() => { this.onBack() }}>
                    <Ionicons name={'ios-arrow-round-back'} size={35} style={{ lineHeight: 50 }}></Ionicons>
                </TouchableOpacity>
                <Text style={{ fontSize: 17, fontWeight: '700', lineHeight: 50 }}>设置</Text>
            </View>
            <ScrollView style={{ marginTop: 10, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={{ width: '100%', height: 50, borderBottomColor: '#f3f3f3', borderBottomWidth: 1, paddingLeft: 14, paddingRight: 14, flexWrap: 'wrap', flexDirection: 'row' }} activeOpacity={0.6} onPress={() => { this.setState({ dialog: true }) }}>
                    <AntDesign name={'user'} size={16} style={{ lineHeight: 50, marginRight: 5 }} />
                    <Text style={{ lineHeight: 50, fontSize: 14 }}>修改昵称</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '100%', height: 50, borderBottomColor: '#f3f3f3', borderBottomWidth: 1, paddingLeft: 14, paddingRight: 14, flexWrap: 'wrap', flexDirection: 'row' }} activeOpacity={0.6} onPress={() => { this.setState({ gxdialog: true }) }}>
                    <AntDesign name={'user'} size={16} style={{ lineHeight: 50, marginRight: 5 }} />
                    <Text style={{ lineHeight: 50, fontSize: 14 }}>个性签名</Text>
                </TouchableOpacity>
                
            </ScrollView>
            {this.setBtn()}
            {this.setDialog()}
            {this.setgxDialog()}
            <Toast ref="toast" position='top' />
        </View>
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
})

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onUser: (user) => {
            dispatch(actions.onUser(user))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ShezhiPage)

const styles = StyleSheet.create({
    keyWord: {
        marginTop: 10,
        fontSize: 14,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 10
    },
})