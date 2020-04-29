import Types from '../../action/types'


const defaultState={
    music:[]
}
export default function onAction(state=defaultState,action){
    switch(action.type){
        case Types.MUSIC:
            return{
                ...state,
                music:action.music
            };
        default:
            return state;
    }
}