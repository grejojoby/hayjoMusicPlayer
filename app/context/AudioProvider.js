import React, { Component, createContext } from 'react'
import { Text, View, Alert, Button } from 'react-native'
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';

export const AudioContext = createContext()

export class AudioProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audioFiles: [],
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playbackObj: null,
            soundObj: null,
            currentAudio: {},
            isPlaying: false,
            currentAudioIndex: null,
        }
    }

    persmissionAlert = () => {
        Alert.alert("Permission Required", "This app needs to access audio files!", [{
            text: "I am ready",
            onPress: () => this.getPermission()
        }, {
            text: "Cancel",
            onPress: () => this.persmissionAlert()
        }])
    }

    getAudioFiles = async () => {
        const { dataProvider, audioFiles } = this.state
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio'
        })
        media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: media.totalCount,
        })

        this.setState({ ...this.state, dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]), audioFiles: [...audioFiles, ...media.assets] })
    }

    getPermission = async () => {
        const permission = await MediaLibrary.getPermissionsAsync()
        if (permission.granted) {
            this.getAudioFiles()
        }

        if (!permission.canAskAgain && !permission.granted) {
            this.setState({ ...this.state, permissionError: true })
        }
        if (!permission.granted && permission.canAskAgain) {
            const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'denied' && canAskAgain) {
                this.persmissionAlert()
            }
            if (status === 'granted') {
                this.getAudioFiles()
            }
            if (status === 'denied' && !canAskAgain) {
                this.setState({ ...this.state, permissionError: true })
            }
        }
    }

    componentDidMount() {
        this.getPermission()
    }

    updateState = (prevState, newState = {}) => {
        this.setState({ ...prevState, ...newState });
    }
    render() {
        const { audioFiles, dataProvider, permissionError, playbackObj, soundObj, currentAudio, isPlaying, currentAudioIndex } = this.state;
        if (permissionError) return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 25, textAlign: 'center', color: 'red' }}>It looks like you havent accepted the permission</Text>
            </View>)
        return (
            <AudioContext.Provider value={{ audioFiles, dataProvider, playbackObj, soundObj, currentAudio, isPlaying, currentAudioIndex, updateState: this.updateState }}>
                {this.props.children}
            </AudioContext.Provider>
        );
    }
}

export default AudioProvider
