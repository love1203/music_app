import Types from '../types'

export function onMusic(music){
    return dispatch=>{
        dispatch({type:Types.MUSIC,music:music})
    }
}

export function onPlay(play){
    return dispatch=>{
        dispatch({type:Types.PLAY,play:play})
    }
}

export function onBtn(btn){
    return dispatch=>{
        dispatch({type:Types.BTN,btn:btn})
    }
}

