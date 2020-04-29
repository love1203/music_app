import Types from '../../action/types'


const defaultState={
    init:'HotPage'
}
export default function onAction(state=defaultState,action){
    switch(action.type){
        case Types.INIT:
            return{
                ...state,
                init:action.init
            };
        default:
            return state;
    }
}