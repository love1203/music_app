import {applyMiddleware,createStore} from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducer'
import {middleWare} from '../navigators/AppNavigators'
import action from '../action'

const logger=store=>next=>action=>{
    if(typeof action === 'function'){
        console.log('dispatching is function')
    }else{
        console.log('dispatching',action)
    }
    const result=next(action)
    console.log('nextState',action)
    return action
}

const middleWares=[
    middleWare,
    thunk,
    //logger
]

export default createStore(reducers,applyMiddleware(...middleWares))