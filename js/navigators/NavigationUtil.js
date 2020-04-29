export default class NavigationUtil{

    static toPage(page,params){
        NavigationUtil.navigation.navigate(page,{...params})
    }

    static goBack(navigation){
        navigation.goBack()
    }
    static resetToHomePage(params){
        const {navigation}=params
        navigation.navigate('Main')
    }
}