import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export class AudioList extends Component {
            
    render() {
        return (
            <View style={styles.container}>
                <Text>Audio List</Text>
            </View>
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
