import Types from '../../action/types'


const defaultState = {
    play: {
        playModel: 1,  // 播放模式  1:列表循环    2:随机    3:单曲循环
        pic_small: '',    //小图
        title: '',       //歌曲名字
        author: '',      //歌曲作者
        file_link: '',   //歌曲播放链接
        sliderValue: 0,    //Slide的value
        pause: true,       //歌曲播放/暂停
        currentTime: 0.0,   //当前时间
        duration: 0.0,     //歌曲时间
        currentIndex: 0,    //当前第几首
    }
}
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.PLAY:
            return {
                ...state,
                play: action.play
            };
        default:
            return state;
    }
}