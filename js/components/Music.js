import React, { Component } from 'react'
import { View, Text, StatusBar, TouchableOpacity,Dimensions } from 'react-native'
import { connect } from 'react-redux'
import actions from '../action'
import Video from 'react-native-video'
var { width, height } = Dimensions.get('window');

class Music extends Component{
    constructor(props){
        super(props)
        this.state={
            songs:[],
            file_link:'',
            pause:true,
            playModel:1,
            currentIndex:0,
            duration:0,
            currentTime:0,
            pic_small:'',
            title:'',
            author:'',
            sliderValue:0
        }
    }

    //播放器每隔250ms调用一次
    onProgress = (data) => { 
        let val = data.currentTime
        let config=this.props.play
        config.sliderValue=val
        config.currentTime=val
        this.props.onPlay(config)
        this.setState({
            sliderValue:val,
            currentTime:val
        })
        //如果当前歌曲播放完毕,需要开始下一首
        if (val >= (this.state.duration - 0.2)) {
            if (this.state.playModel == 1) {
                //列表 就播放下一首
                this.nextAction(this.state.currentIndex + 1)
            } else if (this.state.playModel == 2) {
                let last = this.state.songs.length //json 中共有几首歌
                let random = Math.floor(Math.random() * last)  //取 0~last之间的随机整数
                this.nextAction(random) //播放
            } else {
                //单曲 就再次播放当前这首歌曲
                this.refs.video.seek(0) //让video 重新播放
            }
        }
        //console.log(this.props.play,'this.props.play')
    }

    onLoad = (data) => {
        let config=this.props.play
        config.duration=data.duration
        this.props.onPlay(config)
        this.setState({
            duration:data.duration
        })
    }

    nextAction = (index) => {
        if (index == this.state.songs.length) {
            index = 0 //如果是最后一首就回到第一首
        }
        let config=this.props.play
        config.currentIndex=index
        this.props.onPlay(config)
        this.setState({
            currentIndex:index
        })
        this.loadSongInfo(index)   //加载数据
    }

    loadSongInfo = (index) => {
        //加载歌曲
        let songList = this.props.music //取出json中的歌曲数组
        console.log(songList,'songList')
        let config=this.props.play
        config.file_link=songList[index].file_link
        config.pic_small=songList[index].pic
        config.title=songList[index].title
        config.author=songList[index].author
        config.currentIndex=index
        this.props.onPlay(config)
        this.setState({
            songs:songList,
            file_link:songList[index].file_link,
            pause:this.props.play.pause,
            currentIndex:index,
            pic_small:songList[index].pic,
            title:songList[index].title,
            author:songList[index].author,
        })
    }
    

    onClick(index){
        this.setState({
            sliderValue:0,
            currentTime:0
        })
        this.loadSongInfo(index)
    }

    openClose(){
        let config=JSON.parse(JSON.stringify(this.props.play))
        console.log(config.pause)
        if(config.pause){
            this.setState({
                pause:false
            })
        }else{
            this.setState({
                pause:true
            })
        }
    }


    render(){
        if(this.state.file_link){
            return <Video
        source={{ uri: this.state.file_link }}
        ref='video'
        volume={1.0}
        paused={this.state.pause}
        playInBackground={true}
        onProgress={(e) => this.onProgress(e)}
        onLoad={(e) => this.onLoad(e)}
    />
        }else{
            return null
        }

        
    }
}



const mapStateToProps = (state, ownProps) => {
    return {
        music: state.music.music,
        play:state.play.play
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMusic: (music) => {
            dispatch(actions.onMusic(music))
        },
        onPlay:(play)=>{
            dispatch(actions.onPlay(play))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps, null, { forwardRef: true })(Music)