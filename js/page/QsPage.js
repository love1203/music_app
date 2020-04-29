import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, RefreshControl, DeviceEventEmitter } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import API from '../api/music'
import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux'
import actions from '../action'
import util from '../utils/util'
import StatusBarPage from '../components/StatusBarPage'

class QsPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyWord: '',
            placeholderkeyWord: '',
            songList: [],
            historyList: [],
            historyType: true,
            searchList: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.searchdefault()
        this.hotdetail()
        this.getHistoryList()
    }

    searchdefault() {
        let res = API.searchdefault()
            .then(res => {
                if (res.code == 200) {
                    this.setState({
                        placeholderkeyWord: res.data.showKeyword,
                        isLoading:false
                    })
                }
            })
    }
    hotdetail() {
        let res = API.hotdetail()
            .then(res => {
                if (res.code == 200) {
                    console.log(res)
                    let list = res.data

                    for (let i = 0; i < list.length; i++) {
                        list[i].index = i + 1
                        if (i < 3) {
                            list[i].color = '#f53e3a'
                        } else {
                            list[i].color = '#959595'
                        }
                    }
                    this.setState({
                        songList: list
                    })
                    console.log(this.state.songList)
                }
            })
    }

    //音乐列表
    setSongList() {
        let songArr = []
        this.state.songList.forEach((item, index) => {
            songArr.push(<TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', height: 50, width: '100%', marginBottom: 10 }} activeOpacity={0.6} onPress={()=>{this.handleHistory(item.searchWord)}}>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', height: 50 }}>
                    <Text style={{ alignSelf: 'center', fontSize: 16, color: item.color }}>{item.index}</Text>

                    <View style={{ marginLeft: 14 }}>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 3 }}>{item.searchWord}</Text>
                            <Image resizeMode='contain' source={{ uri: item.iconUrl }} style={{ width: 30, height: 14, marginTop: 2 }} />
                        </View>
                        <Text style={{ fontSize: 13, color: '#999', marginTop: 3 }}>{item.content}</Text>
                    </View>

                </View>
                <Text style={{ fontSize: 13, color: '#999', marginTop: 3 }}>{item.score}</Text>
            </TouchableOpacity>)
        })
        return songArr
    }

    setHistoryList() {
        // AsyncStorage.removeItem('historyList')
        if (this.state.historyList && this.state.historyList.length > 0) {
            let arr = []
            this.state.historyList.forEach(item => {
                arr.push(<TouchableOpacity activeOpacity={0.6} onPress={() => { this.handleHistory(item) }}><View style={{ paddingLeft: 10, paddingRight: 10, height: 26, borderRadius: 13, backgroundColor: '#f3f3f3', marginRight: 5 }}><Text style={{ fontSize: 12, lineHeight: 26 }}>{item}</Text></View></TouchableOpacity>)
            })
            return arr
        } else {
            return <Text style={{ color: '#999', fontSize: 13 }}>暂无历史记录</Text>
        }
    }
    handleHistory(item) {
        this.setState({
            keyWord: item
        })
        this.onSearch(item)
    }

    getHistoryList() {
        AsyncStorage.getItem('historyList', (err, res) => {
            if (!err) {

                if (res) {
                    let list = JSON.parse(res)
                    if (list.length > 0) {
                        this.setState({
                            historyList: list
                        })
                    } else {
                        this.setState({
                            historyList: []
                        })
                    }
                } else {
                    this.setState({
                        historyList: []
                    })
                }
            } else {
                this.setState({
                    historyList: []
                })
            }
        })
        if (this.state.historyList.length > 0) {

        } else {
            return <Text style={{ color: '#999', fontSize: 13 }}>暂无历史记录</Text>
        }
    }
    deleteHistory() {
        AsyncStorage.removeItem('historyList')
            .then(res => {
                this.setState({
                    historyList: []
                })
            })
    }
    onSearch(keyword) {
        let res = API.searchsuggest({
            keywords: keyword
        })
            .then(res => {
                console.log(res)
                if (res.code == 200) {
                    if (res.result && res.result.songs && res.result.songs.length > 0) {
                        this.setState({
                            searchList: res.result.songs
                        })
                        AsyncStorage.getItem('historyList', (err, res) => {
                            if (!err) {
                                if (res) {
                                    let list = JSON.parse(res)
                                    list.forEach((item, index) => {
                                        if (this.state.keyWord == item) {
                                            list.splice(index, 1)
                                        }
                                    })
                                    list.unshift(this.state.keyWord)
                                    this.setState({
                                        historyList: list
                                    })
                                    AsyncStorage.setItem('historyList', JSON.stringify(list))
                                } else {
                                    let list = []
                                    list.push(this.state.keyWord)
                                    this.setState({
                                        historyList: list
                                    })
                                    AsyncStorage.setItem('historyList', JSON.stringify(list))
                                }
                            } else {
                                console.log(err, 'err')
                            }
                        })
                        this.setState({
                            historyType: false
                        })
                        this.refs['input'].blur();

                    } else {
                        this.refs['input'].blur();

                        this.refs.toast.show('暂无匹配音乐');
                    }
                }
            })
    }

    closeSearch() {
        this.setState({
            historyType: true
        })
    }

    setDefaultPage() {
        if (this.state.historyType) {
            return <View style={{ padding: 13 }}>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>历史记录</Text>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { this.deleteHistory() }}>
                        <AntDesign
                            name={'delete'}
                            size={24}
                            color={'#b0b0b0'}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                    <ScrollView style={{ width: '100%', height: 50 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} horizontal={true} directionalLockEnabled={true}>
                        {this.setHistoryList()}
                    </ScrollView>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>热搜榜</Text>
                <View style={{ marginTop: 14 }}>
                    {this.setSongList()}
                </View>
            </View>
        } else {
            return <View style={{ padding: 13 }}>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700' }}>单曲</Text>
                        <TouchableOpacity style={{ marginLeft: 5, alignSelf: 'center' }} activeOpacity={0.6} onPress={() => { this.closeSearch() }}>
                            <AntDesign name={'close'} size={16} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
                {this.getSearchList()}
            </View>
        }
    }

    addMusic(item) {
        let res = API.songdetail({ ids: item.id })
            .then(res => {
                if (res.code == 200) {
                    let data = res.songs[0]
                    let res1 = API.songurl({ id: data.id })
                        .then(res1 => {
                            if (res1.code == 200) {
                                if(!res1.data[0].url){
                                    this.refs.toast.show('该歌曲无权限')
                                    return
                                }
                                let config = {
                                    id: data.id,
                                    title: data.name,
                                    checkout: true,
                                    pic: data.al.picUrl,
                                    author: data.al.name,
                                    file_link: res1.data[0].url,
                                    size: res1.data[0].size
                                }
                                let list = this.props.music

                                let bs = true
                                list.forEach(item => {
                                    item.checkout = false
                                    if (item.id == config.id) {
                                        bs = false
                                    }
                                })
                                if (bs) {
                                    list.push(config)
                                }
                                console.log(list)
                                this.props.onMusic(list)
                                let newlist = this.props.music
                                newlist.forEach((item, index) => {
                                    if (config.id == item.id) {
                                        DeviceEventEmitter.emit('playMusic', index)
                                    }
                                })
                                console.log(newlist, 'newlist')
                                util.setSongsList(newlist)
                            }
                        })

                }
            })

    }

    addSongs(item){
        let res = API.songdetail({ ids: item.id })
            .then(res => {
                if (res.code == 200) {
                    let data=res.songs[0]
                    let res1=API.songurl({id:data.id})
                    .then(res1=>{
                        if(res1.code==200){
                            let config = {
                                id: data.id,
                                title:data.name,
                                checkout:false,
                                pic:data.al.picUrl,
                                author:data.al.name,
                                file_link:res1.data[0].url,
                                size:res1.data[0].size
                            }
                            let list=this.props.music
                            let bs=true
                            list.forEach(item=>{
                                if(item.id==config.id){
                                    bs=false
                                }
                            })
                            if(bs){
                                list.push(config)
                            }
                            console.log(list)
                            this.props.onMusic(list)
                            util.setSongsList(list)
                        }
                    })
                    
                }
            })
    }

    getSearchList() {
        let arr = []
        this.state.searchList.forEach((item, index) => {
            arr.push(<TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
                <TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row', height: 50 }} activeOpacity={0.6} onPress={() => { this.addMusic(item) }}>
                    <Text style={{ alignSelf: 'center', fontSize: 14, color: '#959595' }}>{index + 1}</Text>

                    <View style={{ marginLeft: 14, width: '70%' }}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 16 }}>{item.name}</Text>
                        <Text style={{ fontSize: 13, color: '#999', marginTop: 3 }}>{item.artists[0].name}</Text>
                    </View>

                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={() => { this.addSongs(item) }}>
                    <Ionicons name={'ios-add-circle-outline'} size={20} color={'#999'} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
            </TouchableOpacity>)
        })
        return arr
    }
    loadData() {
        this.setState({
            isLoading:true
        })
        this.searchdefault()
        this.hotdetail()
        this.getHistoryList()
    }
    render() {

        return <View style={{ flex: 1 }}>
            <View style={{ padding: 10, flexWrap: 'wrap', flexDirection: 'row', display: 'flex', paddingTop: 14 }}>

                <TextInput
                    style={styles.keyWord}
                    ref='input'
                    placeholder={this.state.placeholderkeyWord}
                    placeholderTextColor={'#ccc'}
                    // password={true}
                    keyboardType={'default'}
                    keyboardAppearance={'default'}
                    multiline={true}
                    clearButtonMode={'unless-editing'}
                    blurOnSubmit={false}
                    autoCorrect={false}
                    autoFocus={false}
                    onChangeText={(keyWord) => this.setState({ keyWord })}
                    value={this.state.keyWord}
                />
                <TouchableOpacity activeOpacity={0.6} onPress={() => { this.onSearch(this.state.keyWord) }}>
                    <AntDesign
                        name={'search1'}
                        size={24}
                        color={'#323232'}
                        style={{ marginTop: 23, marginLeft: 10 }}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
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
                <View style={styles.contation}>

                    {this.setDefaultPage()}
                    <Toast ref="toast"  position='top' />
                </View>
            </ScrollView>

        </View>


    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        music: state.music.music,
        play: state.play.play
    }

}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMusic: (music) => {
            dispatch(actions.onMusic(music))
        },
        onPlay: (play) => {
            dispatch(actions.onPlay(play))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QsPage)

const styles = StyleSheet.create({
    contation: {
        flex: 1
    },
    keyWord: {
        marginTop: 10,
        fontSize: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        flex: 1
    }
})