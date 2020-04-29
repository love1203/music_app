import Types from '../../action/types'


const defaultState={
    user:{}
}
export default function onAction(state=defaultState,action){
    switch(action.type){
        case Types.USER:
            return{
                ...state,
                user:action.user
            };
        default:
            return state;
    }
}