import React,{Component} from 'react'
import {createStackNavigator,createAppContainer,createSwitchNavigator} from 'react-navigation'
import WelcomePage from '../page/WelcomePage'
import DetailPage from '../page/DetailPage'
import HomePage from '../page/HomePage'
import LoginPage from '../page/LoginPage'
import RegistPage from '../page/RegistPage'
import PhonePage from '../page/PhonePage'
import PlayPage from '../page/PlayPage'
import MorePage from '../page/MorePage'
import PeoplePage from '../page/PeoplePage'
import PaihangPage from '../page/PaihangPage'
import PeopleListsDetailPage from '../page/PeopleListsDetailPage'
import PlayListsDetailPage from '../page/PlayListsDetailPage'
import TuijianPage from '../page/TuijianPage'
import NewsongsPage from '../page/NewsongsPage'
import MvPage from '../page/MvPage'
import MvDetailPage from '../page/MvDetailPage'
import ShezhiPage from '../page/ShezhiPage'
import UserPage from '../page/UserPage'
import {connect} from 'react-redux'
import {createReactNavigationReduxMiddleware,createReduxContainer} from 'react-navigation-redux-helpers'

export const rootCom='Init'

const InitNavigator=createStackNavigator({
    WelcomePage:{
        screen:WelcomePage,
        navigationOptions:{
            header:null
        }
    }
})

const MainNavigator=createStackNavigator({
    HomePage:{
        screen:HomePage,
        navigationOptions:{
            header:null
        }
    },
    DetailPage:{
        screen:DetailPage,
        navigationOptions:{
            header:null
        }
    },  
    LoginPage:{
        screen:LoginPage,
        navigationOptions:{
            header:null
        }
    }, 
    PhonePage:{
        screen:PhonePage,
        navigationOptions:{
            header:null
        }
    }, 
    RegistPage:{
        screen:RegistPage,
        navigationOptions:{
            header:null
        }
    },
    PlayListsDetailPage:{
        screen:PlayListsDetailPage,
        navigationOptions:{
            header:null
        }
    },
    PlayPage:{
        screen:PlayPage,
        navigationOptions:{
            header:null
        }
    },
    PeopleListsDetailPage:{
        screen:PeopleListsDetailPage,
        navigationOptions:{
            header:null
        }
    },
    MorePage:{
        screen:MorePage,
        navigationOptions:{
            header:null
        }
    },
    PeoplePage:{
        screen:PeoplePage,
        navigationOptions:{
            header:null
        }
    },
    PaihangPage:{
        screen:PaihangPage,
        navigationOptions:{
            header:null
        }
    },
    TuijianPage:{
        screen:TuijianPage,
        navigationOptions:{
            header:null
        }
    },
    NewsongsPage:{
        screen:NewsongsPage,
        navigationOptions:{
            header:null
        }
    },
    MvPage:{
        screen:MvPage,
        navigationOptions:{
            header:null
        }
    },
    MvDetailPage:{
        screen:MvDetailPage,
        navigationOptions:{
            header:null
        }
    },
    ShezhiPage:{
        screen:ShezhiPage,
        navigationOptions:{
            header:null
        }
    },
    UserPage:{
        screen:UserPage,
        navigationOptions:{
            header:null
        }
    },
})

export const RootNavigator= createAppContainer(createSwitchNavigator({
    [rootCom]:InitNavigator,
    Main:MainNavigator,
},{
    navigationOptions:{
        header:null
    }
}))

export const middleWare=createReactNavigationReduxMiddleware(
    state => state.nav,
    'root',
)

const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

const mapStateToProps = state => ({
    state: state.nav,//v2
});

export default connect(mapStateToProps)(AppWithNavigationState);