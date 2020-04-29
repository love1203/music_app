import React, { Component } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, DeviceEventEmitter, RefreshControl } from 'react-native'
import EventBus from "react-native-event-bus";
import utils from '../utils/util'
import NavigationUtil from '../navigators/NavigationUtil'
import { connect } from 'react-redux'
import actions from '../action'
import API from '../api/music'
import util from '../utils/util';
import AntDesign from 'react-native-vector-icons/AntDesign'
import StatusBarPage from '../components/StatusBarPage'
import Toast from 'react-native-easy-toast'

class MyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playList: [],
            isLoading: false,
            userData: {},
            gxdialog:false,
            detail:{}
        }
    }

    componentDidMount() {
        EventBus.getInstance().addListener('enentClick', (e) => {
            if (e.to == 3) {
                this.getUserInfo()
            }
        })
        this.addClick = DeviceEventEmitter.addListener('addClick', () => {
            this.getUserInfo()
        })
        this.getUserInfo()
    }



    componentWillUnmount() {
        EventBus.getInstance().removeListener('enentClick');
        if (this.addClick) {
            this.addClick.remove()
        }
    }

    linkDetail(id) {
        NavigationUtil.toPage('PlayListsDetailPage', { id: id })
    }

    longMusic() {
        console.log(222)
    }

    creategx(){
        let detail= this.state.detail
        console.log(detail)
        let res=API.deleteplaylist({id:detail.id})
        .then(res=>{
            if(res.code==200){
                console.log(res)
                this.refs.toast.show('删除成功')
                this.getUserInfo()
                this.setState({
                    gxdialog:false
                })
            }else{
                this.refs.toast.show(res.message)
            }
        })
    }

    closegxDialog(){
        this.setState({
            gxdialog:false
        })
    }

    setgxDialog() {
        if (this.state.gxdialog) {
            return <View style={{ padding: 20, justifyContent: 'center', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, }}>
                <TouchableOpacity style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', }} onPress={() => { this.closegxDialog() }} activeOpacity={1}></TouchableOpacity>
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, alignSelf: 'center', padding: 14 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 10 }}>提示</Text>
                    <Text style={{fontSize:14,color:'#666',marginTop:20}}>是否删除此歌单</Text>
                    <View style={{ marginTop: 20, alignSelf: 'flex-end',flexWrap:'wrap',flexDirection:'row'}}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { this.closegxDialog() }} style={{ width: 80, height: 40, borderRadius: 5, backgroundColor: '#fff',marginRight:10,borderColor:'#dd2d20',borderWidth:1 }}>
                        <Text style={{ textAlign: 'center', lineHeight: 40, color: '#dd2d20' }}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { this.creategx() }} style={{ width: 80, height: 40, borderRadius: 5, backgroundColor: '#dd2d20', }}>
                        <Text style={{ textAlign: 'center', lineHeight: 40, color: '#fff' }}>确定</Text>
                    </TouchableOpacity>
                    </View>
                    
                </View>
            </View>
        } else {
            return null
        }
    }

    openDialog(item){
        this.setState({
            gxdialog:true,
            detail:item
        })
    }

    setList() {
        if (this.props.user.loginType) {
            let arr = []
            this.state.playList.forEach(item => {
                arr.push(<View style={{ flexWrap: 'wrap', flexDirection: 'row', marginBottom: 14, position: 'relative', width: '100%' }}>
                    <TouchableOpacity activeOpacity={0.6} style={{ flexWrap: 'wrap', flexDirection: 'row', width: '90%',display:'flex' }} onPress={() => { this.linkDetail(item.id) }}>
                        <Image source={{ uri: item.coverImgUrl }} style={{ width: 50, height: 50, borderRadius: 5 }} />
                        <View style={{ marginLeft: 10,flex:1 }}>
                            <Text style={{ fontSize: 15, }}>{item.name}</Text>
                            <Text style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{item.trackCount}首</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ position: 'absolute', right: 0,}} activeOpacity={0.6} onPress={()=>{this.openDialog(item)}}>
                        <AntDesign name={'ellipsis1'} size={20} style={{ lineHeight: 50,color:'#888' }} />
                    </TouchableOpacity>
                </View>)
            })
            return arr
        } else {
            return <Text style={{ textAlign: 'center', color: '#999' }}>登录后获取歌单</Text>
        }

    }

    getUserInfo() {
        if (this.props.user.loginType) {
            let data = this.props.user.data
            this.setState({
                userData: data
            })
            console.log(data)
            let res = API.playlistuser({ uid: data.userId })
                .then(res => {
                    if (res.code == 200) {
                        this.setState({
                            playList: res.playlist,
                            isLoading: false
                        })
                    }
                })
        } else {
            this.setState({
                isLoading: false
            })
        }

    }



    setGx() {
        if (this.state.userData.signature) {
            return <Text style={{ fontSize: 13, color: '#fff', opacity: 0.8 }}>{this.state.userData.signature}</Text>
        } else {
            return <Text style={{ fontSize: 13, color: '#fff', opacity: 0.8 }}>编辑个性签名</Text>
        }
    }

    setName() {
        if (this.props.user.loginType) {
            return <View>
                <TouchableOpacity activeOpacity={0.6} onPress={() => { NavigationUtil.toPage('ShezhiPage') }}>
                    <AntDesign name={'setting'} size={22} color={'#fff'} style={{ alignSelf: 'flex-end', padding: 20, marginTop: 20, paddingBottom: 0 }} />
                </TouchableOpacity>
                <View style={{ marginTop: 0, marginLeft: 20, flexWrap: 'wrap', flexDirection: 'row', display: 'flex' }}>
                    <Image source={{ uri: this.state.userData.avatarUrl }} style={{ width: 70, height: 70, borderRadius: 35 }} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 5, marginTop: 5 }}>{this.state.userData.nickname}</Text>
                        {this.setGx()}
                    </View>

                </View>
            </View>
        } else {
            return <TouchableOpacity style={{ marginTop: 50, marginLeft: 20, flexWrap: 'wrap', flexDirection: 'row' }} activeOpacity={0.6} onPress={() => { NavigationUtil.toPage('LoginPage') }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 70, marginLeft: 10 }}>请登录</Text>
            </TouchableOpacity>
        }

    }



    loadData() {
        this.setState({
            isLoading: true
        })
        this.getUserInfo()
    }

    render() {
        return <View style={{ flex: 1, position: 'relative' }}>
            <View style={{ width: '100%', height: 310, backgroundColor: '#dd2d20' }}>
                {this.setName()}
            </View>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={{ width: '100%', padding: 14, backgroundColor: '#fff', borderRadius: 5, marginTop: -150, }}
                refreshControl={
                    <RefreshControl
                        title={'Loading'}
                        titleColor={'#ff3740'}
                        colors={['#ff3740']}
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.loadData()}
                        tintColor={'#ff3740'}
                    />
                }>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 20 }}>创建的歌单</Text>
                    <View style={{ marginTop: 20, width: '100%' }}>
                        {this.setList()}
                    </View>
                </View>
            </ScrollView>
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


export default connect(mapStateToProps, mapDispatchToProps)(MyPage)