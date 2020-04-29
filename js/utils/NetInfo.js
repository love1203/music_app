import React,{Component} from 'react'
import {Alert} from 'react-native'
import NetInfo from '@react-native-community/netinfo'

export function getNetInfo(){
    NetInfo.fetch().done((status)=> {
        console.log(status)
        if((status.type !== 'wifi'  )){
            Alert.alert('网络检测', '请网络是否wifi状态,注意您的流量哦', [
                {
                    text: '不再提示', onPress: ()=> {

                }},
                {
                    text: '好的', onPress: ()=> {

                    }
                }
            ])
        }
    });
}