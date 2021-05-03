import React, { Component, createContext } from 'react'
import { Text, View, Alert, Button } from 'react-native'
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { playNext, pause, play, resume } from '../misc/audioController';


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
            playbackPosition: null,
            playbackDuration: null,

        }
        this.totalAudioCount = 0;
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
        });
        this.totalAudioCount = media.totalCount;

        this.setState({ ...this.state, dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]), audioFiles: [...audioFiles, ...media.assets] })
    }

    loadPreviousAudio = async () => {
        let previousAudio = await AsyncStorage.getItem('previousAudio');
        let currentAudio;
        let currentAudioIndex;

        if (previousAudio === null) {
            currentAudio = this.state.audioFiles[0];
            currentAudioIndex = 0;

        } else {
            previousAudio = JSON.parse(previousAudio);
            currentAudio = previousAudio.audio;
            currentAudioIndex = previousAudio.indexOf;
        }

        this.setState({ ...this.state, currentAudio, currentAudioIndex })

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

    setOnPlaybackStatusUpdate = async playbackStatus => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.updateState(this, {
                playbackPostition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            })
        }

        if (playbackStatus.didJustFinish) {
            const nextAudioIndex = this.state.currentAudioIndex + 1;
            if (nextAudioIndex >= this.totalAudioCount) {
                this.state.playbackObj.unloadAsync();
                this.updateState(this, { soundObj: null, currentAudio: this.state.audioFiles[0], isPlaying: false, currentAudioIndex: 0, playbackPostition: null, playbackDuration: null })
                return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
            }
            const audio = this.state.audioFiles[nextAudioIndex];
            const status = await playNext(this.state.playbackObj, audio.uri);
            this.updateState(this, { soundObj: status, currentAudio: audio, isPlaying: true, currentAudioIndex: nextAudioIndex });
            await storeAudioForNextOpening(audio, nextAudioIndex);
        }
    };

    componentDidMount() {
        this.getPermission();
        if (this.state.playbackObj === null) {
            this.setState({ ...this.state, playbackObj: new Audio.Sound() });
        }
    }

    updateState = (prevState, newState = {}) => {
        this.setState({ ...prevState, ...newState });
    }
    render() {
        const { audioFiles, dataProvider, permissionError, playbackObj, soundObj, currentAudio, isPlaying, currentAudioIndex, playbackDuration, playbackPosition } = this.state;
        if (permissionError) return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 25, textAlign: 'center', color: 'red' }}>It looks like you havent accepted the permission</Text>
            </View>)
        return (
            <AudioContext.Provider
                value={{
                    audioFiles,
                    dataProvider,
                    playbackObj,
                    soundObj,
                    currentAudio,
                    isPlaying,
                    currentAudioIndex,
                    playbackDuration,
                    playbackPosition,
                    totalAudioCount: this.totalAudioCount,
                    updateState: this.updateState,
                    loadPreviousAudio: this.loadPreviousAudio,
                    OnPlaybackStatusUpdate: this.OnPlaybackStatusUpdate,
                }}>
                {this.props.children}
            </AudioContext.Provider>
        );
    }
}

export default AudioProvider
