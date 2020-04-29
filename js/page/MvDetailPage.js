import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native'
import API from '../api/music'
import { ScrollView } from 'react-native-gesture-handler'
import NavigationUtil from '../navigators/NavigationUtil'
import BackPressComponent from '../utils/BackPressComponent'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'

export default class DetailPage extends Component {
    constructor(props) {
        super(props)
        const { item } = this.props.navigation.state.params
        this.state = {
            id: item.id,
            detail: {},
            detailUrl: '',
            isLoading: false,
            currentTime: 0,
            duration: 0,
            widthBar: 0,
            pause: false,
            mvs: [],
            isplayBtn: require('../img/zanting.png')
        }
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
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
        let res = API.mvdetail({ mvid: this.state.id })
            .then(res => {
                if (res.code == 200) {
                    console.log(res)
                    this.setState({
                        detail: res.data
                    })
                }
            })
        let res1 = API.mvurl({ id: this.state.id })
            .then(res1 => {
                if (res1.code == 200) {
                    this.setState({
                        detailUrl: res1.data.url
                    })
                }
            })
        let res2 = API.simimv({ mvid: this.state.id })
            .then(res2 => {
                if (res2.code == 200) {
                    this.setState({
                        mvs: res2.mvs
                    })
                }
            })
    }
    getNewDetail(id) {
        let res = API.mvdetail({ mvid: id })
            .then(res => {
                if (res.code == 200) {
                    console.log(res)
                    this.setState({
                        detail: res.data
                    })
                }
            })
        let res1 = API.mvurl({ id: id })
            .then(res1 => {
                if (res1.code == 200) {
                    this.setState({
                        detailUrl: res1.data.url
                    })
                }
            })
        let res2 = API.simimv({ mvid: id })
            .then(res2 => {
                if (res2.code == 200) {
                    this.setState({
                        mvs: res2.mvs
                    })
                }
            })
    }
    loadData() {
        this.getDetail()
    }

    setVideo() {
        if (this.state.detailUrl) {
            return <Video
                ref={'video'}
                source={{ uri: this.state.detailUrl }}
                style={{ width: '100%', height: 270, backgroundColor: 'black' }}
                volume={1.0}
                rate={1}
                paused={this.state.pause}
                resizeMode={'contain'}
                onProgress={(e) => this.onProgress(e)}
                onLoad={(e) => this.onLoad(e)}
            />
        } else {
            return null
        }
    }

    onProgress(e) {
        let currentTime = e.currentTime
        this.setState({
            currentTime: e.currentTime
        })
        let bs = (e.currentTime / this.state.duration) * 100
        this.setState({
            widthBar: bs
        })
        if (e.currentTime >= this.state.duration) {
            this.setState({
                pause: true
            })
        }
    }

    onLoad(e) {
        this.setState({
            duration: e.duration
        })
    }

    //播放/暂停
    playAction = () => {
        this.setState({
            pause: !this.state.pause
        })
        //判断按钮显示什么
        if (this.state.pause == true) {
            this.setState({
                isplayBtn: require('../img/zanting.png')
            })
        } else {
            this.setState({
                isplayBtn: require('../img/bofang.png')
            })
        }

    }

    linkPlayDetail(item) {
        this.setState({
            id: item.id
        })
        this.getNewDetail(item.id)
    }

    setSongsList() {
        if (this.state.mvs && this.state.mvs.length > 0) {
            let arr = []
            this.state.mvs.forEach(item => {
                arr.push(<TouchableOpacity style={{ width: '33%', padding: 5 }}
                    activeOpacity={0.6} onPress={() => { this.linkPlayDetail(item) }}>
                    <View>
                        <View style={{ width: '100%', height: 120, position: 'relative' }}>
                            <Image source={{ uri: item.cover }} style={{ width: '100%', height: 120, borderRadius: 5, position: "absolute" }} />
                            <View style={{ width: '100%', height: 120, borderRadius: 5, position: "absolute", zIndex: -1, backgroundColor: "#ccc" }}></View>
                        </View>
                        <Text style={{ fontSize: 12, marginTop: 5, marginBottom: 5, textAlign: 'center' }}>{item.name}</Text>
                    </View>
                </TouchableOpacity>)
            })
            return arr
        } else {
            return null
        }
    }

    //把秒数转换为时间类型
    formatTime(time) {
        // 71s -> 01:11
        let min = Math.floor(time / 60)
        let second = time - min * 60
        min = min >= 10 ? min : '0' + min
        second = second >= 10 ? second : '0' + second
        return min + ':' + second
    }

    render() {
        return <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
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
                {this.setVideo()}
                <View style={{ width: '100%', height: 2, backgroundColor: '#ccc' }}>
                    <View style={{ width: this.state.widthBar + '%', backgroundColor: 'red', height: 2 }}></View>
                </View>
                <TouchableOpacity style={{ position: 'absolute', left: 5, bottom: 10 }} onPress={() => this.playAction()}>
                    <Image source={this.state.isplayBtn} style={{ width: 40, height: 40,}} />
                </TouchableOpacity>
                <View style={{ position: 'absolute', right: 5, bottom: 15 }}>
                    <Text style={{ color: '#fff' }}>{this.formatTime(Math.floor(this.state.currentTime))}/{this.formatTime(Math.floor(this.state.duration))}</Text>
                </View>
            </View>
            <View style={{ padding: 14 }}>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>{this.state.detail.name}</Text>
                <Text numberOfLines={3} ellipsizeMode={'tail'} style={{ fontSize: 13, color: '#666', marginTop: 10 }}>{this.state.detail.desc}</Text>
            </View>
            <View style={{ padding: 14 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 10 }}>相似MV</Text>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                    {this.setSongsList()}
                </View>
            </View>

        </ScrollView>
    }
}

