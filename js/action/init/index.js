import Types from '../types'

export function onInit(init){
    return dispatch=>{
        dispatch({type:Types.INIT,init:init})
    }
}


