import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, findNodeHandle, DeviceEventEmitter, RefreshControl } from 'react-native'
import BackPressComponent from '../utils/BackPressComponent'
import NavigationUtil from '../navigators/NavigationUtil'
import API from '../api/music'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import AntDesign from 'react-native-vector-icons/AntDesign'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import actions from '../action'
import util from '../utils/util'

export default class DetailPage extends Component {
    constructor(props) {
        super(props)
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
    }

    componentDidMount() {
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

    render() {
        return <View style={{ flex: 1,backgroundColor:'#f5f5f5' }}>
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', height: 78, paddingLeft: 14,backgroundColor: '#fff',paddingTop:28 }}>
                <TouchableOpacity style={{ marginRight: 5 }} activeOpacity={0.6} onPress={() => { this.onBack() }}>
                    <Ionicons name={'ios-arrow-round-back'} size={35} style={{ lineHeight: 50 }}></Ionicons>
                </TouchableOpacity>
                <Text style={{ fontSize: 17, fontWeight: '700', lineHeight: 50 }}>基本信息</Text>
            </View>
            <ScrollView style={{marginTop:10,backgroundColor:'#fff'}} showsVerticalScrollIndicator={false}>
                
            </ScrollView>
            
        </View>
    }
}