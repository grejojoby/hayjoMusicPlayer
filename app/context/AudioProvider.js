import React, { Component, createContext } from 'react'
import { Text, View, Alert } from 'react-native'
import * as MediaLibrary from 'expo-media-library';

export const AudioContext = createContext() 

export class AudioProvider extends Component {
    constructor(props){
        super(props);
        this.state = {
            audioFiles: []
        }
    }

    persmissionAlert = () => {
        Alert.alert("Permission Required", "This app needs to access audio files!", [{
            text:"I am ready",
            onPress: () => this.getPermission()
        }, {
            text: "Cancel",
            onPress: () => this.persmissionAlert()
        }])
    }

    getAudioFiles = async () => {
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio'
        })
        media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: media.totalCount,
        })

        this.setState()
    }

    getPermission = async () => {
        const permission = await MediaLibrary.getPermissionsAsync()
        if(permission.granted){
            this.getAudioFiles()
        }
        if(!permission.granted && permission.canAskAgain){
            const {status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
            if(status === 'denied' && canAskAgain){
                this.persmissionAlert()
            }
            if(status === 'granted'){
                this.getAudioFiles()
            }
            if(status === 'denied' && !canAskAgain){

            }
        }
    }

    componentDidMount(){
        this.getPermission()
    }

    render() {
        return <AudioContext.Provider value={{}}>
            {this.props.children}
        </AudioContext.Provider>
    }
}

export default AudioProvider
