import React from 'react'
import { Modal, StyleSheet, Text, TextInput, View, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import color from '../misc/color'

const PlaylistInputModal = ({ visible, onClose, onSubmit }) => {

    const [playlistName, setPlaylistName] = useState('');
    const handleOnSubmit = () => {
        if (!playlistName.trim()) {
            onClose()
        }
        else {
            onSubmit(playlistName)
            setPlaylistName('');
            onClose()
        }
    }
    return (
        <Modal visible={visible} animationType='fade' transparent>
            <View style={styles.modalContainer}>
                <View style={styles.inputContainer}>
                    <Text style={{ color: color.ACTIVE_BG }}>Create New Playlist</Text>
                    <TextInput style={styles.input} value={playlistName} onChangeText={(text) => setPlaylistName(text)}></TextInput>
                    <AntDesign name="check" size={24} color={color.ACTIVE_FONT} style={styles.submitIcon} onPress={handleOnSubmit} />
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
            </TouchableWithoutFeedback>
        </Modal>
    );
}
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    inputContainer: {
        width: width - 20,
        height: 200,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: width - 40,
        borderBottomColor: color.ACTIVE_BG,
        borderBottomWidth: 1,
        fontSize: 18,
        paddingVertical: 5
    },
    submitIcon: {
        padding: 10,
        backgroundColor: color.ACTIVE_BG,
        borderRadius: 50,
        marginTop: 15,

    },
    modalBG: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    }

})

export default PlaylistInputModal;

