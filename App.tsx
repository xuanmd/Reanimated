import React from 'react';
import { StyleSheet, Text, View, YellowBox } from 'react-native';
import { Slider } from './src/CustomSlider/Slider';
import { Cursor } from './src/CustomSlider/Cursor';
import { ThemeSwitch } from './src/ThemeSwitch/ThemeSwitch';
import { HeaderSearchBar } from './src/HeaderSearchBar/HeaderSearchBar';
import { Home } from './src/YoutubeAnimation/Home';
YellowBox.ignoreWarnings(['Require cycle:']);

export default function App() {
  return (
    <View style={styles.container}>
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
    // alignItems: 'center'
    // justifyContent: 'center'
  }
});
