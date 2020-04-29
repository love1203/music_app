import React, { Component } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Dimensions, DeviceEventEmitter, Image,TextInput } from 'react-native'
import { connect } from 'react-redux'
import actions from '../action'
import AntDesign from 'react-native-vector-icons/AntDesign'
import util from "../utils/util";
import Toast from 'react-native-easy-toast'
import API from '../api/music'
var { width, height } = Dimensions.get('window');
class DrawDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            list: [],
            dialog: false,
            playList: [],
            createDialog: false,
            name:''
        }
    }

    onShow() {
        this.setState({
            visible: true,
            list: this.props.music,
            dialog: false,
            createDialog: false
        })
    }
    onClose() {
        this.setState({
            visible: false
        })
    }

    addMusic(op) {
        let newlist = this.state.list
        newlist.forEach((item, index) => {
            if (op.id == item.id) {
                item.checkout = true
                DeviceEventEmitter.emit('playMusic', index)
            } else {
                item.checkout = false
            }
        })
        this.setState({
            list: newlist
        })
    }

    closeDialog() {
        this.setState({
            dialog: false
        })
    }

    closeCreateDialog() {
        this.setState({
            createDialog: false
        })
    }

    deleteList() {
        this.setState({
            list: []
        })
        this.props.onMusic([])
        util.setSongsList([])
    }

    getUserInfo() {
        let data = this.props.user.data
        let res = API.playlistuser({ uid: data.userId })
            .then(res => {
                if (res.code == 200) {
                    console.log(res,'res1')
                    this.setState({
                        playList: res.playlist
                    })
                }
            })
    }
    addPlayList(item){
        let str=''
        let arr=[]
        this.state.list.forEach(item=>{
            arr.push(item.id)
        })
        str=arr.join(',')
        let config={
            op:'add',
            pid:item.id,
            tracks:str
        }
        let res=API.tracksplaylist(config)
        .then(res=>{
            if(res.code==200){
                console.log(res)
                this.refs.toast.show('添加成功')
                setTimeout(()=>{
                    this.getUserInfo()
                },200)
            }else{
                this.refs.toast.show(res.message)
            }
        })
    }
    setList() {
        let arr = []
        this.state.playList.forEach(item => {
            arr.push(<TouchableOpacity activeOpacity={0.6} onPress={()=>{this.addPlayList(item)}}>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginBottom: 14, display: 'flex' }}>
                    <Image source={{ uri: item.coverImgUrl }} style={{ width: 50, height: 50, borderRadius: 5 }} />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={{ fontSize: 15, }}>{item.name}</Text>
                        <Text style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{item.trackCount}首</Text>
                    </View>
                </View>
            </TouchableOpacity>)
        })
        return arr

    }
    onDialog() {
        if (this.props.user.loginType) {
            this.setState({
                dialog: true
            })
            this.getUserInfo()
        } else {
            this.refs.toast.show('请先登录')
        }

    }

    setDialog() {
        if (this.state.dialog) {
            return <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', padding: 20 }}>
                <View style={{ width: '100%', height: '100%', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 5 }}>
                    <View style={{ height: 50, borderBottomColor: '#e6e6e6', borderBottomWidth: 1, paddingRight: 20, paddingLeft: 20, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ lineHeight: 50 }}>收藏到歌单</Text>
                        <TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row' }} activeOpacity={0.6} onPress={() => { this.closeDialog() }}>
                            <AntDesign name={'closesquareo'} size={16} style={{ lineHeight: 50 }} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ padding: 14 }}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { this.setState({ createDialog: true }) }}>
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginBottom: 14, display: 'flex' }}>
                                    <Image source={require('../img/add.png')} style={{ width: 50, height: 50, borderRadius: 5 }} />
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={{ fontSize: 15, lineHeight: 50 }}>新建歌单</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {this.setList()}
                        </View>
                    </ScrollView>
                </View>
            </View>
        }
    }

    createPlayList(){
        if(!this.state.name){
            this.refs.toast.show('请输入歌单名')
            return
        }
        let res=API.createplaylist({name:this.state.name})
        .then(res=>{
            if(res.code==200){
                this.refs.toast.show('创建成功')
                this.setState({
                    createDialog:false,
                })
                setTimeout(()=>{
                    this.getUserInfo()
                },200)
            }else{
                this.refs.toast.show(res.message)
            }
        })
    }

    setCreateDialog() {
        if (this.state.createDialog) {
            return <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', padding: 20 }}>
                <View style={{ width: '100%', height: '100%', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 5 }}>
                    <View style={{ height: 50, borderBottomColor: '#e6e6e6', borderBottomWidth: 1, paddingRight: 20, paddingLeft: 20, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ lineHeight: 50 }}>新建歌单</Text>
                        <TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row' }} activeOpacity={0.6} onPress={() => { this.closeCreateDialog() }}>
                            <AntDesign name={'closesquareo'} size={16} style={{ lineHeight: 50 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{padding:14}}>
                        <TextInput
                            style={styles.keyWord}
                            ref='input'
                            placeholder={'请输入歌单名'}
                            placeholderTextColor={'#ccc'}
                            keyboardType={'default'}
                            keyboardAppearance={'default'}
                            multiline={true}
                            clearButtonMode={'unless-editing'}
                            blurOnSubmit={false}
                            autoCorrect={false}
                            autoFocus={false}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                        />
                        <TouchableOpacity activeOpacity={0.6} onPress={()=>{this.createPlayList()}} style={{width:'100%',height:40,borderRadius:20,backgroundColor:'#dd2d20',marginTop:20}}>
                    <Text style={{textAlign:'center',lineHeight:40,color:'#fff'}}>确定</Text>
                </TouchableOpacity>
                    </View>
                </View>
            </View>
        }
    }

    removeMusic(item) {
        let newlist = this.state.list
        newlist.forEach((it, index) => {
            if (it.id == item.id) {
                newlist.splice(index, 1)
            }
        })
        this.setState({
            list: newlist
        })
        this.props.onMusic(newlist)
        util.setSongsList(newlist)
    }

    getSearchList() {
        if (this.state.list && this.state.list.length > 0) {
            let arr = []
            this.state.list.forEach((item, index) => {
                arr.push(<View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '100%', marginBottom: 10, width: '100%', position: 'relative' }}>
                    <TouchableOpacity style={{ width: '90%',flexWrap:'wrap',flexDirection:'row'}} activeOpacity={0.6} onPress={() => { this.addMusic(item) }}>
            <Text style={{alignSelf:'center',marginRight:10,fontSize:12,color: item.checkout ? 'red' : '#333'}}>{index+1<10?'0'+(index+1):index+1}</Text>
                        <View>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 16, color: item.checkout ? 'red' : '#333' }}>{item.title}</Text>
                        <Text style={{ color: item.checkout ? 'red' : '#999', fontSize: 12 }}>{item.author}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ position: 'absolute', right: 0 }} activeOpacity={0.6} onPress={() => { this.removeMusic(item) }}>
                        <AntDesign name={'delete'} size={18} color={'#999'} style={{ lineHeight: 30, }} />
                    </TouchableOpacity>


                </View>)
            })
            return arr
        } else {
            return null
        }

    }

    render() {
        return <Modal
            transparent={true}
            animationType={'slide'}
            onRequestClose={() => { this.onRequestClose() }}
            visible={this.state.visible}>
            <TouchableOpacity activeOpacity={1} style={{ height: height / 2, }} onPress={() => { this.onClose() }}>
                <View></View>
            </TouchableOpacity>

            <View style={styles.scrollStyle}>
                <View style={{ height: 50, borderBottomColor: '#e6e6e6', borderBottomWidth: 1, paddingRight: 20, paddingLeft: 20, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row' }} activeOpacity={0.6} onPress={() => { this.onDialog() }}>
                        <AntDesign name={'addfolder'} size={16} style={{ lineHeight: 50 }} />
                        <Text style={{ lineHeight: 50, marginLeft: 5 }}>添加歌单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row' }} activeOpacity={0.6} onPress={() => { this.deleteList() }}>
                        <AntDesign name={'delete'} size={16} style={{ lineHeight: 50 }} />
                        <Text style={{ lineHeight: 50, marginLeft: 5 }}>清空列表</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 14 }}>
                        {this.getSearchList()}
                    </View>
                </ScrollView>
                {this.setDialog()}
                {this.setCreateDialog()}
                <Toast ref="toast" position='top' />
            </View>

        </Modal>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        music: state.music.music,
        user: state.user.user
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMusic: (music) => {
            dispatch(actions.onMusic(music))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(DrawDialog)

const styles = StyleSheet.create({
    kongbai: {
        height: 300,
        backgroundColor: 'red'
    },
    keyWord: {
        marginTop: 10,
        fontSize: 13,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom:10
    },
    scrollStyle: {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: "#fff",
        overflow: "hidden",
        elevation: 10,
        position: 'absolute',
        bottom: 0,
        height: height / 1.5,
        width: '100%',

    },
})