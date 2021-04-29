import React from 'react'
import { View, Text } from 'react-native'
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import Playlist from '../screens/Playlist';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return <Tab.Navigator>
        <Tab.Screen name='AudioList' component={AudioList} options={{
            tabBarIcon: ({ color, size }) => (<MaterialIcons name="headset" size={size} color={color} />)
        }} />
        <Tab.Screen name='Player' component={Player} options={{
            tabBarIcon: ({ color, size }) => (<FontAwesome5 name="compact-disc" size={size} color={color} />)
        }} />
        <Tab.Screen name='Playlist' component={Playlist} options={{
            tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="playlist-music" size={size} color={color} />)
        }} />
    </Tab.Navigator>
}

export default AppNavigator;
