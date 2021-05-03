import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import AudioListItem from '../components/AudioListItem'
import Screen from '../components/Screen'
import OptionsModal from '../components/OptionsModal'
import { Audio } from 'expo-av'
import { play, pause, resume, playNext } from '../misc/audioController';
import { storeAudioForNextOpening } from '../misc/helper'

export class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props) {
        super(props)
        this.state = {
            optionModalVisible: false,

        };

        this.currentItem = {

        }
    }

    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        switch (type) {
            case 'audio':
                dim.width = Dimensions.get('window').width;
                dim.height = 70;
                break;
            default:
                dim.width = 0;
                dim.height = 0;
        }
        dim.width = Dimensions.get('window').width;
        dim.height = 70;
    })

    setOnPlaybackStatusUpdate = async playbackStatus => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.context.updateState(this.context, {
                playbackPostition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            })
        }

        if (playbackStatus.didJustFinish) {
            const nextAudioIndex = this.context.currentAudioIndex + 1;
            if (nextAudioIndex >= this.context.totalAudioCount) {
                this.context.playbackObj.unloadAsync();
                this.context.updateState(this.context, { soundObj: null, currentAudio: this.context.audioFiles[0], isPlaying: false, currentAudioIndex: 0, playbackPostition: null, playbackDuration: null })
                return await storeAudioForNextOpening(this.context.audioFiles[0], 0);
            }
            const audio = this.context.audioFiles[nextAudioIndex];
            const status = await playNext(this.context.playbackObj, audio.uri);
            this.context.updateState(this.context, { soundObj: status, currentAudio: audio, isPlaying: true, currentAudioIndex: nextAudioIndex });
            await storeAudioForNextOpening(audio, nextAudioIndex);
        }
    };

    handleAudioPress = async audio => {
        const { soundObj, playbackObj, currentAudio, updateState, audioFiles } = this.context;
        ///Playing audio for first time
        if (soundObj === null) {
            const playbackObj = new Audio.Sound();
            const status = await play(playbackObj, audio.uri);
            const index = audioFiles.indexOf(audio);
            updateState(this.context, { currentAudio: audio, playbackObj: playbackObj, soundObj: status, isPlaying: true, currentAudioIndex: index });
            playbackObj.setOnPlaybackStatusUpdate(this.setOnPlaybackStatusUpdate);
            return storeAudioForNextOpening(audio, index);
        }
        //pause if already playing
        if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
            const status = await pause(playbackObj);
            return updateState(this.context, { soundObj: status, isPlaying: false });
        }

        if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
            const status = await resume(playbackObj);
            return updateState(this.context, { soundObj: status, isPlaying: true });
        }

        if (soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await playNext(playbackObj, audio.uri);
            const index = audioFiles.indexOf(audio);
            updateState(this.context, { currentAudio: audio, soundObj: status, isPlaying: true, currentAudioIndex: index });
            return storeAudioForNextOpening(audio, index);
        }
    }

    componentDidMount() {
        this.context.loadPreviousAudio();
    }

    rowRenderer = (type, item, index, extendedState) => {
        return <AudioListItem title={item.filename} activeListItem={this.context.currentAudioIndex === index} isPlaying={extendedState.isPlaying} duration={item.duration} onAudioPress={() => this.handleAudioPress(item)} onOptionPress={() => {
            this.currentItem = item;
            this.setState({ ...this.state, optionModalVisible: true });
        }} />
    }

    render() {
        return (<AudioContext.Consumer>
            {({ dataProvider, isPlaying }) => {
                if (!dataProvider._data.length) return null;
                return (
                    <Screen>
                        <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRenderer} extendedState={{ isPlaying }} />
                        <OptionsModal onPlayPress={() => console.log("Play")} onPlaylistPress={() => console.log("Playlist")} currentItem={this.currentItem} visible={this.state.optionModalVisible} onClose={() => this.setState({ ...this.state, optionModalVisible: false })} />
                    </Screen>
                )
            }}
        </AudioContext.Consumer>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AudioList
