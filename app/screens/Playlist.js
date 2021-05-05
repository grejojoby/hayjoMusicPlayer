import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import PlaylistInputModal from '../components/PlaylistInputModal'
import { AudioContext } from '../context/AudioProvider'
import color from '../misc/color'

const Playlist = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const context = useContext(AudioContext);
    const { playList, addToPlayList, updateState } = context;

    const createPlaylist = async playlistName => {
        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {
            const audios = [];
            if (addToPlayList) {
                audios.push(addToPlayList);
            }
            const newList = {
                id: Date.now(),
                title: playlistName,
                audios: audios,
            }

            const updatedList = [...playList, newList]
            updateState(context, {
                addToPlayList: null,
                playList: updatedList,
            })
            await AsyncStorage.setItem('playlist', JSON.stringify(updatedList))
        }
        setModalVisible(false);
    }
    const renderPlayList = async () => {
        const result = await AsyncStorage.getItem('playlist');
        if (result === null) {
            const defaultPlayList = {
                id: Date.now(),
                title: 'My Favourite',
                audios: []
            }

            const newPlayList = [...playList, defaultPlayList]
            updateState(context, { playList: [...newPlayList] })
            return await AsyncStorage.setItem('playlist', JSON.stringify([...newPlayList]))
        }
        updateState(context, { playList: JSON.parse(result) })
    }
    useEffect(() => {
        if (!playList.length) {
            renderPlayList();
        }
    }, [])
    return (
        <ScrollView contentContainerStyle={styles.container}>

            {playList.length ? playList.map(item => <TouchableOpacity key={item.id.toString()} style={styles.playListBanner}>
                <Text>{item.title}</Text>
                <Text style={styles.audioCount}>{items.audios.length > 1 ? `${item.audios.length} Songs` : `${item.audios.length} Song`}</Text>
            </TouchableOpacity>) : null}



            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginTop: 15 }}>
                <Text style={styles.playListBtn}>+ Add New Playlist</Text>
            </TouchableOpacity>
            <PlaylistInputModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={createPlaylist}></PlaylistInputModal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    audioCount: {
        marginTop: 3,
        opacity: 0.5,
        fontSize: 14

    },
    playListBanner: {
        padding: 5,
        backgroundColor: 'rgba(204,204,204,0.3)',
        borderRadius: 5,
        marginBottom: 15,

    },
    playListBtn: {
        color: color.ACTIVE_BG,
        letterSpacing: 1,
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,

    }
})

export default Playlist;