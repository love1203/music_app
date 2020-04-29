import {combineReducers} from 'redux'
import init from './init'
import user from './user'
import music from './music'
import play from './play'
import btn from './btn'
import {rootCom,RootNavigator} from '../navigators/AppNavigators'

const navstate=RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom))

const navReducer=(state=navstate,action)=>{
    const nextState=RootNavigator.router.getStateForAction(action,state)
    return nextState||state
}

const index=combineReducers({
    nav:navReducer,
    init:init,
    user:user,
    music:music,
    play:play,
    btn:btn
})

export default index