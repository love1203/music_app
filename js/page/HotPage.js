import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, RefreshControl, DeviceEventEmitter } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import API from '../api/music'
import Swiper from 'react-native-swiper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigationUtil from '../navigators/NavigationUtil'
import { connect } from 'react-redux'
import actions from '../action'
import Toast from 'react-native-easy-toast'
import Ionicons from 'react-native-vector-icons/Ionicons'
import util from '../utils/util'
import StatusBarPage from '../components/StatusBarPage'

class HotPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgList: [],
            playList: [],
            songList: [],
            artistsList: [],
            isLoading: false,
            iconList: [
                {
                    url: require('../img/homeicon1.png'),
                    text: '每日推荐'
                },
                {
                    url: require('../img/homeicon2.png'),
                    text: '歌单'
                },
                {
                    url: require('../img/homeicon3.png'),
                    text: '排行榜'
                },
                {
                    url: require('../img/homeicon4.png'),
                    text: 'MV'
                },
                
            ]
        }
    }

    componentDidMount() {
        this.getBannerList()
        this.getPlaylist()
        this.getSongs()
        this.getArtists()
    }
    //获取轮播图
    getBannerList() {
        let res = API.getBanner({ type: 2 })
            .then(res => {
                if (res.code == 200) {
                    console.log(res.banners, 'res.banners')
                    this.setState({
                        imgList: res.banners
                    })
                }
            })
    }
    //获取热门歌单
    getPlaylist() {
        let res = API.getPlaylist()
            .then(res => {
                console.log(res, '111')
                if (res.code == 200) {
                    this.setState({
                        playList: res.playlists,
                        isLoading:false
                    })
                }
            })
    }
    //轮播图
    setImgList() {
        let imgArr = []
        this.state.imgList.forEach((item, index) => {
            imgArr.push(<TouchableOpacity style={styles.swiperImg} key={index} activeOpacity={0.6} onPress={() => { }}>
                <Image resizeMode='stretch' style={styles.image} source={{ uri: item.pic }} key={index} />
            </TouchableOpacity>)
        })
        return imgArr
    }
    //icon
    handleLink(item) {
        if (item.text == '每日推荐') {
            if (this.props.user.loginType) {
                NavigationUtil.toPage('TuijianPage')
            } else {
                this.refs.toast.show('请先登录，获取每日推荐歌曲')
            }
        } else if (item.text == '歌单') {
            NavigationUtil.toPage('MorePage')
        } else if (item.text == '排行榜') {
            NavigationUtil.toPage('PaihangPage')
        } else if (item.text == 'MV') {
            NavigationUtil.toPage('MvPage')
        } else if (item.text == '直播') {

        }
    }
    setIcon() {
        let iconArr = []
        this.state.iconList.forEach(item => {
            iconArr.push(<TouchableOpacity activeOpacity={0.6} onPress={() => { this.handleLink(item) }}>
                <View style={{ alignItems: 'center' }}>
                    <Image style={{ width: 48, height: 48 }} source={item.url} />
                    <Text style={{ marginTop: 5, fontSize: 13 }}>{item.text}</Text>
                </View>
            </TouchableOpacity>)
        })
        return iconArr
    }
    //热门歌单
    linkPlayDetail(id) {
        NavigationUtil.toPage('PlayListsDetailPage', { id: id })
    }
    setPlayList() {
        let playArr = []
        this.state.playList.forEach(item => {
            playArr.push(<TouchableOpacity activeOpacity={0.6} onPress={() => { this.linkPlayDetail(item.id) }}>
                <View style={{ alignItems: 'center', width: 100, marginRight: 10 }}>
                    <View style={{ width: 100, height: 100, position: 'relative' }}>
                        <Image source={{ uri: item.coverImgUrl }} style={{ width: 100, height: 100, borderRadius: 5, position: "absolute" }} />
                        <View style={{ width: 100, height: 100, borderRadius: 5, position: "absolute", zIndex: -1, backgroundColor: '#ccc' }}></View>
                    </View>

                    <Text style={{ fontSize: 12, marginTop: 7 }}>{item.name}</Text>
                </View>
            </TouchableOpacity>)
        })
        return playArr
    }
    //推荐新音乐
    getSongs() {
        let res = API.getNewSongs()
            .then(res => {
                if (res.code == 200) {
                    this.setState({
                        songList: res.result
                    })
                }
            })
    }
    //推荐歌手
    getArtists() {
        let res = API.getArtists({
            offset: 0,
            limit: 10
        })
            .then(res => {
                if (res.code == 200) {
                    console.log(res, 'geshou')
                    this.setState({
                        artistsList: res.artists
                    })
                }
            })
    }
    //热门歌单
    linkPeoPle(item) {
        console.log(item)
        NavigationUtil.toPage('PeopleListsDetailPage', { item: item })
    }
    setArtistsList() {
        let artArr = []
        this.state.artistsList.forEach(item => {
            artArr.push(<TouchableOpacity activeOpacity={0.6} onPress={() => { this.linkPeoPle(item) }}>
                <View style={{ alignItems: 'center', width: 100, marginRight: 10 }}>
                <View style={{ width: 100, height: 100, position: 'relative' }}>
                    <Image source={{ uri: item.picUrl }} style={{ width: 100, height: 100, borderRadius: 5, position: "absolute" }} />
                    <View style={{ width: 100, height: 100, borderRadius: 5, position: "absolute", zIndex: -1, backgroundColor: '#ccc' }}></View>
                    </View>
                    <Text style={{ fontSize: 12, marginTop: 7 }}>{item.name}</Text>
                </View>
            </TouchableOpacity>)
        })
        return artArr
    }

    addMusic(item) {
        console.log(item)
        let res = API.songdetail({ ids: item.id })
            .then(res => {
                if (res.code == 200) {
                    console.log(res, 'res')
                    let data = res.songs[0]
                    let res1 = API.songurl({ id: data.id })
                        .then(res1 => {
                            if (res1.code == 200) {
                                console.log(res1, 'res1')
                                if (!res1.data[0].url) {
                                    this.refs.toast.show('该歌曲暂无权限');
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

    addSongs(item) {
        let res = API.songdetail({ ids: item.id })
            .then(res => {
                if (res.code == 200) {
                    let data = res.songs[0]
                    let res1 = API.songurl({ id: data.id })
                        .then(res1 => {
                            if (res1.code == 200) {
                                if (!res1.data[0].url) {
                                    this.refs.toast.show('该歌曲暂无权限');
                                    return
                                }
                                let config = {
                                    id: data.id,
                                    title: data.name,
                                    checkout: false,
                                    pic: data.al.picUrl,
                                    author: data.al.name,
                                    file_link: res1.data[0].url,
                                    size: res1.data[0].size
                                }
                                let list = this.props.music
                                let bs = true
                                list.forEach(item => {
                                    if (item.id == config.id) {
                                        bs = false
                                    }
                                })
                                if (bs) {
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

    //音乐列表
    setSongList() {
        let songArr = []
        this.state.songList.forEach(item => {
            songArr.push(<View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', height: 50, width: '100%', marginBottom: 10 }}>
                <TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row', height: 50 }} activeOpacity={0.6} onPress={() => { this.addMusic(item) }}>
                <View style={{ width: 50, height: 50, position: 'relative' }}>
                    <Image source={{ uri: item.picUrl }} style={{ width: 50, height: 50, borderRadius: 5,position: "absolute" }} />
                    <View style={{ width: 50, height: 50, borderRadius: 5, position: "absolute", zIndex: -1, backgroundColor: '#ccc' }}></View>
                    </View>
                    <Text style={{ fontSize: 13, lineHeight: 50, marginLeft: 10 }}>{item.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={() => { this.addSongs(item) }}>
                    <Ionicons name={'ios-add-circle-outline'} size={20} color={'#999'} style={{ alignSelf: 'center' }} />
                </TouchableOpacity>
            </View>)
        })
        return songArr
    }
    loadData() {
        this.setState({
            isLoading:true
        })
        this.getBannerList()
        this.getPlaylist()
        this.getSongs()
        this.getArtists()
    }
    render() {

        return <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
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
                
            <View style={styles.container}>
                <View style={styles.swiperBox}>
                    <Swiper autoplay={true} height={180}
                        dot={<View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}
                        activeDot={<View style={{ backgroundColor: '#fe1f17', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}
                    >
                        {this.setImgList()}
                    </Swiper>
                </View>
                <View style={styles.iconBox}>
                    {this.setIcon()}
                </View>
                <View style={styles.contentBox}>
                    <Text style={{ fontSize: 13, color: '#999' }}>推荐歌单</Text>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700' }}>为你精挑细选</Text>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { NavigationUtil.toPage('MorePage') }} style={{ borderColor: '#ccc', borderWidth: 1, paddingLeft: 10, paddingRight: 10, borderRadius: 13, height: 25 }}>
                            <Text style={{ lineHeight: 23, fontSize: 12 }}>查看更多</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <ScrollView style={{ width: '100%', height: 140 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} horizontal={true} directionalLockEnabled={true}>
                            {this.setPlayList()}

                        </ScrollView>
                    </View>
                </View>
                <View style={styles.musicBox}>
                    <Text style={{ fontSize: 13, color: '#999' }}>推荐歌手</Text>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700' }}>热门歌手</Text>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { NavigationUtil.toPage('PeoplePage') }} style={{ borderColor: '#ccc', borderWidth: 1, paddingLeft: 10, paddingRight: 10, borderRadius: 13, height: 25 }}>
                            <Text style={{ lineHeight: 23, fontSize: 12 }}>查看更多</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <ScrollView style={{ width: '100%', height: 124 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} horizontal={true} directionalLockEnabled={true}>
                            {this.setArtistsList()}

                        </ScrollView>
                    </View>
                </View>
                <View style={styles.musicBox}>
                    <Text style={{ fontSize: 13, color: '#999' }}>歌曲推荐</Text>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700' }}>推荐新音乐</Text>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { NavigationUtil.toPage('NewsongsPage') }} style={{ borderColor: '#ccc', borderWidth: 1, paddingLeft: 10, paddingRight: 10, borderRadius: 13, height: 25 }}>
                            <Text style={{ lineHeight: 23, fontSize: 12 }}>查看更多</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        {this.setSongList()}
                    </View>
                </View>
                <Toast ref="toast" position='top' />
            </View>
        </ScrollView>

    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    music: state.music.music,
    play: state.play.play
})

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onUser: (user) => {
            dispatch(actions.onUser(user))
        },
        onMusic: (music) => {
            dispatch(actions.onMusic(music))
        },
        onPlay: (play) => {
            dispatch(actions.onPlay(play))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HotPage)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    swiperBox: {
        width: '100%',
        height: 180
    },
    swiperImg: {
        flex: 1
    },
    image: {
        flex: 1
    },
    iconBox: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 17,
    },
    contentBox: {
        padding: 14,
        marginTop: 10
    },
    musicBox: {
        padding: 14,
    }
})