import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import color from '../misc/color';


const PlayerButton = (props) => {

    const {
        iconType,
        size = 40,
        iconColor = color.FONT,
        onPress,
    }

    const getIconName = (type) => {
        switch (type) {
            case 'PLAY':
                return 'pausecircle'// related to play
            case 'PAUSE':
                return 'playcircleo' // related to pause
            case 'NEXT':
                return 'forward' // related to next
            case 'PREV':
                return 'banckward' // related to prev

            default:
                break;
        }
    }
    return (
        <AntDesign {...props} onPress={onPress} name={getIconName(iconType)} size={size} color={iconColor}/>
    )
}

const styles = StyleSheet.create({
    container: {

    },

})

export default PlayerButton;