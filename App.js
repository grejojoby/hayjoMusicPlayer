import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AudioProvider from './app/context/AudioProvider';
import { SafeAreaView } from 'react-native';
import AudioListItem from './app/components/audioListItem';

export default function App() {
  return (
    // <AudioProvider>
    //   <NavigationContainer>
    //     <AppNavigator />
    //   </NavigationContainer>
    // </AudioProvider>
    <SafeAreaView>
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
      <AudioListItem />
    </SafeAreaView>
  );
}

