import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, findNodeHandle, DeviceEventEmitter, RefreshControl, Dimensions } from 'react-native'
import BackPressComponent from '../utils/BackPressComponent'
import NavigationUtil from '../navigators/NavigationUtil'
import API from '../api/music'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import actions from '../action'
import util from '../utils/util'
var { width, height } = Dimensions.get('window');

class PlayListsDetailPage extends Component {
    constructor(props) {
        super(props)
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })

        this.state = {
            detail: [],
            isLoading: false,
            newdetail: []
        }
    }

    componentDidMount() {
        this.backPress.componentDidMount()
        this.getDetail()
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

    getDetail() {
        let res = API.toplist()
            .then(res => {
                if (res.code == 200) {

                    let list = res.list
                    let arr1 = []
                    let arr2 = []
                    list.forEach(item => {
                        if (item.tracks && item.tracks.length > 0) {
                            arr1.push(item)
                        } else {
                            arr2.push(item)
                        }
                    })
                    console.log(arr1)
                    console.log(arr2)
                    this.setState({
                        detail: arr1,
                        newdetail: arr2,
                        isLoading: false
                    })
                }
            })
    }

    getSongs(list) {
        let arr = []
        list.tracks.forEach((item, index) => {
            arr.push(<View style={{ flexWrap: 'wrap', flexDirection: 'row', marginBottom: 10, marginTop: 5 }}>
                <Text style={{ fontSize: 13, color: '#666' }}>{index + 1}.</Text>
                <Text style={{ fontSize: 13, color: '#666' }}>{item.first}-{item.second}</Text>
            </View>)
        })
        return arr
    }

    addMusic(item) {
        NavigationUtil.toPage('PlayListsDetailPage', { id: item.id })
    }

    getSearchList() {
        if (this.state.detail && this.state.detail.length > 0) {
            let arr = []
            this.state.detail.forEach((item, index) => {
                arr.push(<TouchableOpacity style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 14 }} activeOpacity={0.6} onPress={() => { this.addMusic(item) }}>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', display: 'flex', width: '100%' }}>
                        <View style={{ width: 110, height: 110, borderRadius: 5, position: 'relative' }}>
                            <Image source={{ uri: item.coverImgUrl }} style={{ width: '100%', height: '100%', borderRadius: 5, position: "absolute" }} />
                            <View style={{ width: '100%', height: '100%', borderRadius: 5, position: "absolute", zIndex: -1, backgroundColor: "#ccc" }}></View>
                            <Text style={{ fontSize: 12, color: '#fff', position: 'absolute', bottom: 5, textAlign: 'center', alignSelf: 'center' }}>{item.updateFrequency}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            {this.getSongs(item)}
                        </View>
                    </View>
                </TouchableOpacity>)
            })
            return arr
        } else {
            return null
        }

    }

    setSongsList() {
        let arr = []
        this.state.newdetail.forEach(item => {
            arr.push(<TouchableOpacity style={{ width: '33%', padding: 5 }} activeOpacity={0.6} onPress={() => { this.addMusic(item) }}>
                <View>
                    <View style={{ width: '100%',height: 120, position: 'relative' }}>
                        <Image source={{ uri: item.coverImgUrl }} style={{ width: '100%', height: '100%', borderRadius: 5, position: 'absolute' }} />
                        <View style={{ width: '100%', height: '100%', borderRadius: 5, position: "absolute", zIndex: -1, backgroundColor: "#ccc" }}></View>
                    </View>

                    <Text style={{ fontSize: 12, marginTop: 5, marginBottom: 5,textAlign:'center' }}>{item.name}</Text>
                </View>
            </TouchableOpacity>)
        })
        return arr
    }

    loadData() {
        this.setState({
            isLoading: true
        })
        this.getDetail()
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ height: 70, width: '100%', flexWrap: 'wrap', flexDirection: 'row', padding: 14, paddingTop: 20, backgroundColor: "#fff" }}>
                <TouchableOpacity style={{ marginRight: 5 }} activeOpacity={0.6} onPress={() => { this.onBack() }}>
                    <Ionicons name={'ios-arrow-round-back'} size={35} style={{ lineHeight: 50, color: '#333' }}></Ionicons>
                </TouchableOpacity>
                <Text style={{ lineHeight: 50, color: '#333', fontSize: 16, fontWeight: '700', marginLeft: 10 }}>排行榜</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
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
                <View style={{ flex: 1 }}>
                    <View style={{ padding: 14 }}>
                        {this.getSearchList()}
                        <View style={{ marginTop: 16 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>推荐榜</Text>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row' ,marginTop:10}}>
                                {this.setSongsList()}
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>

        </View>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        music: state.music.music,
        play: state.play.play
    }

}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMusic: (music) => {
            dispatch(actions.onMusic(music))
        },
        onPlay: (play) => {
            dispatch(actions.onPlay(play))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayListsDetailPage)

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0
    },

})