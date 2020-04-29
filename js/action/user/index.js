import Types from '../types'

export function onUser(user){
    return dispatch=>{
        dispatch({type:Types.USER,user:user})
    }
}


