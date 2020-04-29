import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native'
import API from '../api/music'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import { ScrollView } from 'react-native-gesture-handler'
import NavigationUtil from '../navigators/NavigationUtil'
import BackPressComponent from '../utils/BackPressComponent'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class MyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tagsList: []
        }
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
    }

    componentWillMount() {
        this.hotplaylist()
        this.backPress.componentDidMount()
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

    hotplaylist() {
        let res = API.hotplaylist()
            .then(res => {

                if (res.code == 200) {
                    this.setState({
                        tagsList: res.tags
                    })
                }
            })
    }
    _genTabs() {
        const tabs = {};
        this.state.tagsList.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item.name} />,
                navigationOptions: {
                    title: item.name
                }
            }
        });
        return tabs;
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
            <View style={{ padding: 14, flex: 1 }}>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', height: 50, marginTop: 20 }}>
                    <TouchableOpacity style={{ marginRight: 5 }} activeOpacity={0.6} onPress={() => { this.onBack() }}>
                        <Ionicons name={'ios-arrow-round-back'} size={35} style={{ lineHeight: 50 }}></Ionicons>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 17, fontWeight: '700', lineHeight: 50 }}>歌单广场</Text>
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
        this.setState({
            isLoading:true
        })
        this.catlist()
    }

    catlist() {
        console.log(<this className="state tabLabel"></this>)
        let res = API.catlist({ cat: this.state.tabLabel })
            .then(res => {
                if (res.code == 200) {
                    this.setState({
                        sonsList: res.playlists,
                        isLoading: false
                    })
                }
            })
    }

    linkPlayDetail(id) {
        NavigationUtil.toPage('PlayListsDetailPage', { id: id })
    }

    setSongsList() {
        let arr = []
        this.state.sonsList.forEach(item => {
            arr.push(<TouchableOpacity style={{ width: '33%', padding: 5 }} activeOpacity={0.6} onPress={() => { }}
                activeOpacity={0.6} onPress={() => { this.linkPlayDetail(item.id) }}>
                <View>
                    <View style={{width: '100%', height: 120,position:'relative'}}>
                    <Image source={{ uri: item.coverImgUrl }} style={{ width: '100%', height: 120, borderRadius: 5,position:'absolute' }} />
                    <View style={{ width: '100%', height: 120, borderRadius: 5, position: "absolute", zIndex: -1, backgroundColor: "#ccc"}}></View>
                    </View>
                    
                    <Text style={{ fontSize: 12, marginTop: 5, marginBottom: 5 }}>{item.name}</Text>
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
        width: 70
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