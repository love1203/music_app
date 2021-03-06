import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, findNodeHandle, DeviceEventEmitter, NativeModules, Animated, Easing,Dimensions } from 'react-native'
import BackPressComponent from '../utils/BackPressComponent'
import NavigationUtil from '../navigators/NavigationUtil'
import API from '../api/music'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import actions from '../action'
import Toast from 'react-native-easy-toast'
import util from '../utils/util'
var { width, height } = Dimensions.get('window');

class PlayListsDetailPage extends Component {
    constructor(props) {
        super(props)
        this.animatedValue1 = new Animated.Value(0)
        this.animatedValue2 = new Animated.Value(0)
        this.animatedValue3 = new Animated.Value(0)
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
        const { id } = this.props.navigation.state.params
        this.id = id
        this.state = {
            detail: {},
            viewRef: null,
            pageX: 0,
            pageY: 0
        }
    }

    componentDidMount() {
        this.backPress.componentDidMount()
        this.getDetail()
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

    getDetail() {
        let res = API.playlistdetail({ id: this.id })
            .then(res => {
                if (res.code == 200) {
                    console.log(res.playlist)
                    this.setState({
                        detail: res.playlist
                    })
                }
            })
    }

    imageLoaded() {
        this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
    }

    setTag() {
        if (this.state.detail.tags && this.state.detail.tags.length > 0) {
            let arr = []
            this.state.detail.tags.forEach(item => {
                arr.push(<View style={{ paddingRight: 6, paddingLeft: 6, height: 20, borderColor: '#ccc', borderWidth: 1, borderRadius: 3, marginRight: 5 }}>
                    <Text style={{ color: '#fff', fontSize: 10, lineHeight: 18 }}>{item}</Text>
                </View>)
            })
            return arr
        } else {
            return null
        }
    }

    setCheckout(index) {
        let arr = this.props.music
        console.log(this.props.music)
        if (arr && arr.length > 0) {
            arr.forEach((item, i) => {
                item.checkout = false
            })
            arr.forEach((item, i) => {
                if (index == i) {
                    item.checkout = true
                }
            })
        }
        this.props.onMusic(arr)

    }

    async addAll(e) {
        NativeModules.UIManager.measure(e.target, (x, y, width, height, pageX, pageY) => {
            console.log(pageX)
            console.log(pageY)
            this.animate(pageX,pageY)
        })
        let arrId = []
        this.state.detail.tracks.forEach(item => {
            arrId.push(item.id)
        })
        let str = arrId.join(',')
        let songs = []
        let res = await API.songdetail({ ids: str })
        if (res.code == 200) {
            songs = res.songs
        }
        let urls = []
        let res1 = await API.songurl({ id: str })
        if (res1.code == 200) {
            urls = res1.data
        }
        let list = []
        songs.forEach(item => {
            urls.forEach(op => {
                if (op.url) {
                    if (op.id == item.id) {
                        let config = {
                            id: item.id,
                            title: item.name,
                            checkout: false,
                            pic: item.al.picUrl,
                            author: item.al.name,
                            file_link: op.url,
                            size: op.size
                        }
                        list.push(config)
                    }
                }

            })
        })
        console.log(list)
        list[0].checkout = true
        this.props.onMusic(list)
        util.setSongsList(list)
        DeviceEventEmitter.emit('playMusic', 0)
    }

    setCrea() {
        return <Animated.View style={{ width: 20, height: 20, backgroundColor: '#fac6c6', position: 'absolute', top: this.animatedValue2, left: this.animatedValue1,opacity:this.animatedValue3,borderRadius:10 }}>

            </Animated.View>
    }

    animate(x,y) { 
        this.animatedValue1.setValue(x);
        this.animatedValue2.setValue(y);
        this.animatedValue3.setValue(1);
        const createAnimation = function (to,value, duration, easing, delay = 0) { 
          return Animated.timing(
            value,
            {
              toValue: to,
              duration,
              easing,
              delay
            }
          )
        }
        Animated.parallel([
          createAnimation(width-50,this.animatedValue1, 500, Easing.ease),
          createAnimation(height,this.animatedValue2, 500, Easing.ease),
          createAnimation(0,this.animatedValue3, 500, Easing.ease)
        ]).start();
      }

    addMusic(e, item) {
        NativeModules.UIManager.measure(e.target, (x, y, width, height, pageX, pageY) => {
            console.log(pageX)
            console.log(pageY)
            this.animate(pageX,pageY)
        })
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

    addSongs(e,item) {
        NativeModules.UIManager.measure(e.target, (x, y, width, height, pageX, pageY) => {
            console.log(pageX)
            console.log(pageY)
            this.animate(pageX,pageY)
        })
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



    getSearchList() {
        if (this.state.detail.tracks && this.state.detail.tracks.length > 0) {
            let arr = []
            this.state.detail.tracks.forEach((item, index) => {
                arr.push(<View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
                    <TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row', height: 50 }} activeOpacity={0.6} onPress={(e) => { this.addMusic(e, item) }}>
                        <Text style={{ alignSelf: 'center', fontSize: 14, color: '#959595' }}>{index + 1}</Text>

                        <View style={{ marginLeft: 14, width: '80%' }}>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 16 }}>{item.name}</Text>
                            <Text style={{ fontSize: 13, color: '#999', marginTop: 3 }}>{item.al.name}</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={(e) => { this.addSongs(e,item) }}>
                        <Ionicons name={'ios-add-circle-outline'} size={20} color={'#999'} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>

                </View>)
            })
            return arr
        } else {
            return null
        }

    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#fff' }}>

            <View style={{ position: 'relative' }}>
                <View style={{ height: 250, overflow: 'hidden' }}>
                    <Image ref={(img) => { this.backgroundImage = img; }} source={{ uri: this.state.detail.coverImgUrl }} style={styles.absolute} onLoadEnd={this.imageLoaded.bind(this)} />
                    <View style={[styles.absolute, { backgroundColor: '#333', opacity: 0.8 }]}></View>
                    <View style={{ padding: 14, flexWrap: 'wrap', flexDirection: 'row', position: 'absolute', top: 60, display: 'flex' }}>
                        <View style={{ width: 90, height: 90, position: 'relative' }}>
                            <Image source={{ uri: this.state.detail.coverImgUrl }} style={{ width: 90, height: 90, borderRadius: 5, position: "absolute" }} />
                            <View style={{ width: 90, height: 90, borderRadius: 5, position: "absolute", zIndex: -1, backgroundColor: "red" }}></View>
                        </View>
                        <View style={{ marginLeft: 14, flex: 1 }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{this.state.detail.name}</Text>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginTop: 5 }}>
                                {this.setTag()}
                            </View>
                            <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ color: '#ccc', fontSize: 13, marginTop: 5 }}>{this.state.detail.description}</Text>
                        </View>
                    </View>
                </View>

            </View>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={{ padding: 14, backgroundColor: '#fff', marginTop: -20, borderRadius: 10 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginRight: 5 }} activeOpacity={0.6} onPress={(e) => { this.addAll(e) }}>
                            <AntDesign name={'playcircleo'} size={20} style={{ lineHeight: 30 }}></AntDesign>
                        </TouchableOpacity>
                        <Text style={{ lineHeight: 30, fontSize: 16, marginLeft: 2 }}>播放全部</Text>
                        <Text style={{ fontSize: 13, color: '#999', marginLeft: 4, lineHeight: 30, }}>(共{this.state.detail.trackCount}首)</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        {this.getSearchList()}
                    </View>
                </View>

            </ScrollView>
            <View style={{ position: 'absolute', height: 70, top: 0, width: '100%', flexWrap: 'wrap', flexDirection: 'row', padding: 14 }}>
                <TouchableOpacity style={{ marginRight: 5 }} activeOpacity={0.6} onPress={() => { this.onBack() }}>
                    <Ionicons name={'ios-arrow-round-back'} size={35} style={{ lineHeight: 50, color: '#fff' }}></Ionicons>
                </TouchableOpacity>
                <Text style={{ lineHeight: 50, color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 10 }}>歌单</Text>
            </View>
            <Toast ref="toast" position='top' />
            {this.setCrea()}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayListsDetailPage)

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0
    },

})