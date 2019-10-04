import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Slider } from './src/CustomSlider/Slider';
import { Cursor } from './src/CustomSlider/Cursor';
import { ThemeSwitch } from './src/ThemeSwitch/ThemeSwitch';
export default function App() {
  return (
    <View style={styles.container}>
      <ThemeSwitch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
