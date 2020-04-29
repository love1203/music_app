import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    View,
    Slider,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Animated,
    Easing,
    findNodeHandle,
    TouchableHighlight,
    Modal,
    DeviceEventEmitter
} from 'react-native'
var { width, height } = Dimensions.get('window');
import Video from 'react-native-video'
var lyrObj = []   // 存放歌词
var myAnimate;
import { connect } from 'react-redux'
import API from '../api/music'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DrawDialog from '../components/DrawDialog'
import NavigationUtil from '../navigators/NavigationUtil'
import BackPressComponent from '../utils/BackPressComponent'
import actions from '../action'
import Toast from 'react-native-easy-toast'

class PlayPage extends Component {
    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0)
        this.state = {
            visShow: false,
            viewRef: null,
            songs: [],   //数据源
            playModel: 1,  // 播放模式  1:列表循环    2:随机    3:单曲循环
            btnModel: require('../img/xunhuan.png'), //播放模式按钮背景图
            pic_small: '',    //小图
            pic_big: '',      //大图
            title: '',       //歌曲名字
            author: '',      //歌曲作者
            file_link: '',   //歌曲播放链接
            songLyr: [],     //当前歌词
            sliderValue: 0,    //Slide的value
            pause: false,       //歌曲播放/暂停
            currentTime: 0.0,   //当前时间
            duration: 0.0,     //歌曲时间
            currentIndex: 0,    //当前第几首
            isplayBtn: require('../img/bofang.png')  //播放/暂停按钮背景图
        }

    }
    //上一曲
    prevAction = (index) => {
        this.recover()
        lyrObj = [];
        if (index == -1) {
            index = this.state.songs.length - 1 // 如果是第一首就回到最后一首歌
        }
        let list = this.props.music
        list.forEach((item, i) => {
            item.checkout = false
            if (i == index) {
                item.checkout = true
            }
        })
        this.props.onMusic(list)
        this.setState({
            currentIndex: index  //更新数据
        })
        this.loadSongInfo(index)  //加载数据
    }
    //下一曲
    nextAction = (index) => {
        this.recover()
        lyrObj = [];
        if (index == this.state.songs.length) {
            index = 0 //如果是最后一首就回到第一首
        }
        let list = this.props.music
        list.forEach((item, i) => {
            item.checkout = false
            if (i == index) {
                item.checkout = true
            }
        })
        this.props.onMusic(list)
        this.setState({
            currentIndex: index,  //更新数据
        })
        this.loadSongInfo(index)   //加载数据
    }
    //换歌时恢复进度条 和起始时间
    recover = () => {
        this.setState({
            sliderValue: 0,
            currentTime: 0.0
        })
    }
    //播放模式 接收传过来的当前播放模式 this.state.playModel
    playModel = (playModel) => {
        playModel++;
        playModel = playModel == 4 ? 1 : playModel
        //重新设置
        this.setState({
            playModel: playModel
        })
        //根据设置后的模式重新设置背景图片
        if (playModel == 1) {
            this.setState({
                btnModel: require('../img/xunhuan.png'),
            })
            this.refs.toast.show('循环播放')
        } else if (playModel == 2) {
            this.setState({
                btnModel: require('../img/suiji.png'),
            })
            this.refs.toast.show('随机播放')
        } else {
            this.setState({
                btnModel: require('../img/danqu.png'),
            })
            this.refs.toast.show('单曲循环')
        }
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
    //播放器每隔250ms调用一次
    onProgress = (data) => {
        let val = data.currentTime
        this.setState({
            sliderValue: val,
            currentTime: data.currentTime
        })
        if (val >= (this.state.duration - 0.2)) {
            if (this.state.playModel == 1) {
                //列表 就播放下一首
                this.nextAction(this.state.currentIndex + 1)
            } else if (this.state.playModel == 2) {
                let last = this.state.songs.length //json 中共有几首歌
                let random = Math.floor(Math.random() * last)  //取 0~last之间的随机整数
                this.nextAction(random) //播放
            } else {
                //this.loadSongInfo(this.state.currentIndex)
                this.refs.video.seek(0) //让video 重新播放
                this.refs.scr.scrollTo({ x: 0, y: 0, animated: false });
            }

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
    // 歌词
    renderItem() {
        // 数组
        var itemAry = [];
        for (var i = 0; i < lyrObj.length; i++) {
            var item = lyrObj[i].txt
            if (this.state.currentTime.toFixed(2) > lyrObj[i].total) {
                //正在唱的歌词
                itemAry.push(
                    <View key={i} style={styles.itemStyle}>
                        <Text style={{ color: '#fff', textAlign: "center", fontSize: 14, lineHeight: 30 }}> {item} </Text>
                    </View>
                );
                this.refs.scr.scrollTo({ x: 0, y: (25 * i), animated: false });
            }
            else {
                //所有歌词
                itemAry.push(
                    <View key={i} style={styles.itemStyle}>
                        <Text style={{ color: '#a69aa4', textAlign: "center", fontSize: 14, lineHeight: 30 }}> {item} </Text>
                    </View>
                )
            }
        }

        return itemAry;
    }
    // 播放器加载好时调用,其中有一些信息带过来
    onLoad = (data) => {
        this.setState({ duration: data.duration });
    }

    loadSongInfo = (index) => {
        //加载歌曲
        let songList = this.props.music //取出json中的歌曲数组
        console.log(songList, 'songList')
        this.setState({
            songType: true,
            songs: songList,   //设置数数据源
            pic_small: songList[index].pic, //小图
            pic_big: songList[index].pic,  //大图
            title: songList[index].title,     //歌曲名
            author: songList[index].author,   //歌手
            file_link: songList[index].file_link,   //播放链接
        })

        //加载歌词
        let songid = this.props.music[index].id
        console.log(songid, 'songid')
        let responseJson = API.lyric({ id: songid })
            .then((responseJson) => {
                let lry = responseJson.lrc.lyric
                let lryAry = lry.split('\n')   //按照换行符切数组
                lryAry.forEach(function (val, index) {
                    var obj = {}   //用于存放时间
                    val = val.replace(/(^\s*)|(\s*$)/g, '')    //正则,去除前后空格
                    let indeofLastTime = val.indexOf(']')  // ]的下标
                    let timeStr = val.substring(1, indeofLastTime) //把时间切出来 0:04.19
                    let minSec = ''
                    let timeMsIndex = timeStr.indexOf('.')  // .的下标
                    if (timeMsIndex !== -1) {
                        //存在毫秒 0:04.19
                        minSec = timeStr.substring(1, val.indexOf('.'))  // 0:04.
                        obj.ms = parseInt(timeStr.substring(timeMsIndex + 1, indeofLastTime))  //毫秒值 19
                    } else {
                        //不存在毫秒 0:04
                        minSec = timeStr
                        obj.ms = 0
                    }
                    let curTime = minSec.split(':')  // [0,04]
                    obj.min = parseInt(curTime[0])   //分钟 0
                    obj.sec = parseInt(curTime[1])   //秒钟 04
                    obj.txt = val.substring(indeofLastTime + 1, val.length) //歌词文本: 留下唇印的嘴
                    obj.txt = obj.txt.replace(/(^\s*)|(\s*$)/g, '')
                    obj.dis = false
                    obj.total = obj.min * 60 + obj.sec + obj.ms / 100   //总时间
                    if (obj.txt.length > 0) {
                        lyrObj.push(obj)
                    }
                })
            })
    }



    onShowPage(index) {
        this.recover()
        this.setState({
            pause: false,
            isplayBtn:require('../img/zanting.png')
        })
        this.setState({
            currentIndex: index
        })
        this.loadSongInfo(index)
    }

    setCon() {
        return <View style={{ position: 'absolute', width: width, top: 100 }}>
            <View style={{ alignItems: 'center' }}>
                <View style={{ width: 250, height: 250, backgroundColor: '#333', borderRadius: 125, justifyContent: 'center' }}>
                    <Image
                        ref='myAnimate'
                        style={{ width: '90%', height: '90%', alignSelf: 'center', borderRadius: 110 }}
                        source={{ uri: this.state.pic_small }}
                    />
                    <Image
                        ref='myAnimate'
                        style={{ width: '90%', height: '90%', alignSelf: 'center', borderRadius: 110, position: 'absolute', zIndex: -1 }}
                        source={require('../img/mr.png')}
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} ref={'scr'} style={{ height: height / 3, marginTop: 20 }}>
                    <View>
                        {this.renderItem()}
                    </View>
                </ScrollView>
            </View>
        </View>
    }




    onparShow() {
        this.refs.drawDialog.onShow()
    }

    closePage() {
        DeviceEventEmitter.emit('closePage')
    }

    setVideo() {
        if (this.state.file_link) {
            return <Video
                source={{ uri: this.state.file_link }}
                ref='video'
                volume={1.0}
                paused={this.state.pause}
                playInBackground={true}
                onProgress={(e) => this.onProgress(e)}
                onLoad={(e) => this.onLoad(e)}
            />
        } else {
            return null
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <Image source={require('../img/bg.jpg')} style={{position:'absolute',top:0,left:0,right:0,bottom:0,width:width,height:height+100,opacity:0.2}} />
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginTop: 20, padding: 14 }}>
                    <TouchableOpacity style={{ marginRight: 10, alignSelf: 'center' }} activeOpacity={0.6} onPress={() => { this.closePage() }}>
                        <Ionicons name={'ios-arrow-round-back'} size={40} style={{ color: '#fff', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <View style={{ width: '70%' }}>
                        <Text style={{ fontSize: 17, fontWeight: '700', lineHeight: 30, color: '#fff' }}>{this.state.title}</Text>
                        <Text style={{ fontSize: 13, color: '#ccc' }}>{this.state.author}</Text>
                    </View>
                </View>
                <View style={{ position: 'absolute', width: '100%', bottom: 20, padding: 20 }}>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', display: 'flex' }}>
                        <Text style={styles.textBox}>{this.formatTime(Math.floor(this.state.currentTime))}</Text>
                        <Slider
                            ref='slider'
                            style={{ marginLeft: 2, marginRight: 2, flex: 1 }}
                            value={this.state.currentTime}
                            maximumValue={this.state.duration}
                            minimumTrackTintColor={'#898b9a'}
                            maximumTrackTintColor={'#5d5f6e'}
                            thumbTintColor={'#fff'}
                            step={1}
                            minimumTrackTintColor='#FFDB42'
                            onValueChange={(value) => {
                                this.setState({
                                    currentTime: value
                                })
                            }
                            }
                            onSlidingComplete={(value) => {
                                this.refs.video.seek(value)
                            }}
                        />
                        <Text style={styles.textBox}>{this.formatTime(Math.floor(this.state.duration))}</Text>
                    </View>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                        <TouchableOpacity onPress={() => this.playModel(this.state.playModel)}>
                            <Image source={this.state.btnModel} style={styles.iconStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.prevAction(this.state.currentIndex - 1)}>
                            <Image source={require('../img/prev.png')} style={styles.iconStyle} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.playAction()}>
                            <Image source={this.state.isplayBtn} style={styles.iconStyle} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.nextAction(this.state.currentIndex + 1)}>
                            <Image source={require('../img/next.png')} style={styles.iconStyle} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { this.onparShow() }}>
                            <Image source={require('../img/list.png')} style={styles.iconStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
                {this.setCon()}
                <View>
                    {/*播放器*/}
                    {this.setVideo()}
                </View>
                <Toast ref="toast" position='top' />
                <DrawDialog ref={'drawDialog'} />

            </View>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        music: state.music.music
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMusic: (music) => {
            dispatch(actions.onMusic(music))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(PlayPage)

const styles = StyleSheet.create({
    iconStyle: {
        width: 50, height: 50
    },
    textBox: {
        fontSize: 12,
        color: '#b0b2bf',
        alignSelf: 'center'
    },
    textBox1: {
        fontSize: 12,
        color: '#535061',
        alignSelf: 'center'
    },
    absolute: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        position: 'relative'
    },
    image: {
        flex: 1
    },
    playingControl: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20
    },
    playingInfo: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(255,255,255,0.0)'
    },
    text: {
        color: "black",
        fontSize: 22
    },
    modal: {
        height: 300,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingTop: 5,
        paddingBottom: 50
    },
    itemStyle: {

    }
})