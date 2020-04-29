import Types from '../../action/types'


const defaultState={
    btn:false
}
export default function onAction(state=defaultState,action){
    switch(action.type){
        case Types.BTN:
            return{
                ...state,
                btn:action.btn
            };
        default:
            return state;
    }
}