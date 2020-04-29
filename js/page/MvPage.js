import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native'
import API from '../api/music'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import { ScrollView } from 'react-native-gesture-handler'
import NavigationUtil from '../navigators/NavigationUtil'
import BackPressComponent from '../utils/BackPressComponent'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Swiper from 'react-native-swiper'

export default class MyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgList:[],
            tagsList: [
                {
                    name: '全部',
                    value: '全部'
                },
                {
                    name: '官方版',
                    value: '官方版'
                },
                {
                    name: '原生',
                    value: '原生'
                },
                {
                    name: '现场版',
                    value: '现场版'
                },
                {
                    name: '网易出品',
                    value: '网易出品'
                },

            ]
        }
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
    }

    componentWillMount() {
        this.backPress.componentDidMount()
        this.getBannerList()
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }
    onBackPress() {
        this.onBack()
        return true
    }
    onBack() {
        NavigationUtil.goBack(this.props.navigation)
    }

    linkPlayDetail(item) {
        NavigationUtil.toPage('MvDetailPage', { item: item })
    }


    _genTabs() {
        const tabs = {};
        this.state.tagsList.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item.value} />,
                navigationOptions: {
                    title: item.name
                }
            }
        });
        return tabs;
    }

    //获取轮播图
    getBannerList() {
        let res = API.firstmv()
            .then(res => {
                if (res.code == 200) {
                    let list=res.data
                    list=list.splice(0,5)
                    console.log(list)
                    this.setState({
                        imgList: list
                    })
                }
            })
    }

    //轮播图
    setImgList() {
        let imgArr = []
        this.state.imgList.forEach((item, index) => {
            imgArr.push(<TouchableOpacity style={{flex:1}} activeOpacity={0.6} onPress={()=>{this.linkPlayDetail(item)}}>
                <Image resizeMode='stretch' style={{flex:1}} source={{ uri: item.cover }} key={index} />
            </TouchableOpacity>)
        })
        return imgArr
    }

    render() {

        const TabNavigator = this.state.tagsList.length ? createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(), {
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                activeTintColor: 'red',
                inactiveTintColor: '#333',
                upperCaseLabel: false,//是否使标签大写，默认为true
                scrollEnabled: true,//是否支持 选项卡滚动，默认false
                style: {
                    backgroundColor: '#fff',//TabBar 的背景颜色
                    // 移除以适配react-navigation4x
                    // height: 30//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
                },
                indicatorStyle: styles.indicatorStyle,//标签指示器的样式
                labelStyle: styles.labelStyle,//文字的样式
            },
            lazy: true
        }
        )) : null;

        return <View style={{ flex: 1 }}>
            <View style={{  flex: 1 }}>
                {/* <View style={{ flexWrap: 'wrap', flexDirection: 'row', height: 50, marginTop: 20 }}>
                    <TouchableOpacity style={{ marginRight: 5 }} activeOpacity={0.6} onPress={() => { this.onBack() }}>
                        <Ionicons name={'ios-arrow-round-back'} size={35} style={{ lineHeight: 50 }}></Ionicons>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 17, fontWeight: '700', lineHeight: 50 }}>MV</Text>
                </View> */}
                <View style={{width:'100%',height:200}}>
                    <Swiper autoplay={true} height={200}
                        dot={<View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}
                        activeDot={<View style={{ backgroundColor: '#fe1f17', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}
                    >
                        {this.setImgList()}
                    </Swiper>
                </View>
                {TabNavigator && <TabNavigator />}
            </View>
        </View>
    }
}

class PopularTabPage extends Component {
    constructor(props) {
        super(props)
        const { tabLabel } = this.props;
        this.state = {
            tabLabel: tabLabel,
            sonsList: []
        }
    }

    componentDidMount() {
        this.catlist()
    }

    loadData() {
        this.catlist()
    }

    catlist() {
        console.log(this.state.tabLabel)
        let res = API.allmv({ area: this.state.tabLabel })
            .then(res => {
                if (res.code == 200) {
                    console.log(res, '222')
                    this.setState({
                        sonsList: res.data,
                        isLoading: false
                    })
                }
            })
    }

    linkPlayDetail(item) {
        NavigationUtil.toPage('MvDetailPage', { item: item })
    }

    setSongsList() {
        let arr = []
        this.state.sonsList.forEach(item => {
            arr.push(<TouchableOpacity style={{ width: '33%', padding: 5 }} activeOpacity={0.6} onPress={() => { }}
                activeOpacity={0.6} onPress={() => { this.linkPlayDetail(item) }}>
                <View>
                <View style={{width: '100%', height: 120,position:'relative'}}>
                    <Image source={{ uri: item.cover }} style={{ width: '100%', height: 120, borderRadius: 5,position: "absolute" }} />
                    <View style={{ width: '100%', height: 120, borderRadius: 5, position: "absolute", zIndex: -1, backgroundColor: "#ccc"}}></View>
                    </View>
                    <Text style={{ fontSize: 12, marginTop: 5, marginBottom: 5, textAlign: 'center' }}>{item.name}</Text>
                </View>
            </TouchableOpacity>)
        })
        return arr
    }

    render() {
        return <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    title={'Loading'}
                    titleColor={'#ff3740'}
                    colors={['#ff3740']}
                    refreshing={this.state.isLoading}
                    onRefresh={() => this.loadData()}
                    tintColor={'#ff3740'}
                />
            }>
            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', marginTop: 10 }}>
                {this.setSongsList()}
            </View>
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    tabStyle: {
        // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
        padding: 0,
        height: 50,
        width: 80
    },
    indicatorStyle: {
        height: 1,
        backgroundColor: 'red'
    },
    labelStyle: {
        fontSize: 14,
        margin: 0,
        fontWeight: '700'
    },
})