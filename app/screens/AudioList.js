import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import AudioListItem from '../components/AudioListItem'
import Screen from '../components/Screen'
import OptionsModal from '../components/OptionsModal'
import { Audio } from 'expo-av'
import { play, pause, resume } from '../misc/audioController'

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
                break;
        }
        dim.width = Dimensions.get('window').width;
        dim.height = 70;
    })

    handleAudioPress = async audio => {
        const { soundObj, playbackObj, currentAudio, updateState } = this.context;
        ///Playing audio for first time
        if (soundObj === null) {
            const playbackObj = new Audio.Sound();
            const status = await play(playbackObj, audio.uri);
            return updateState(this.context, { currentAudio: audio, playbackObj: playbackObj, soundObj: status });
        }
        //pause if already playing
        if (soundObj.isLoaded && soundObj.isPlaying) {
            const status = await pause(playbackObj);
            return updateState(this.context, {soundObj: status})
        }

        if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
            const status = await resume(playbackObj);
            return updateState(this.context, {soundObj: status})
        }
    }

    rowRenderer = (type, item) => {
        return <AudioListItem title={item.filename} duration={item.duration} onAudioPress={() => this.handleAudioPress(item)} onOptionPress={() => {
            this.currentItem = item;
            this.setState({ ...this.state, optionModalVisible: true });
        }} />
    }

    render() {
        return (<AudioContext.Consumer>
            {({ dataProvider }) => {
                return (
                    <Screen>
                        <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRenderer} />
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
