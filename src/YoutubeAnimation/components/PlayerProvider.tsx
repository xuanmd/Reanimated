import React, { useState } from 'react';

// ui
import {
  StatusBar,
  View,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { useMemoOne } from 'use-memo-one';
import { VideoModal } from './VideoModal';
const { Value, interpolate, timing, Clock } = Animated;
interface IProps {}
const isOS = Platform.OS === 'ios';
const { height } = Dimensions.get('window');
const toggleVideo = video => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };
  timing(clock, state, {
    toValue: video ? 1 : 0,
    duration: 400,
    easing: Easing.inOut(Easing.ease)
  });
};
export const videoContext = React.createContext();
const PlayerProvider: React.SFC<IProps> = props => {
  const [video, setVideo] = useState(null);
  const animatedValue = useMemoOne(() => new Value(0), []);
  const selectVideo = video => {
    setVideo(video);
    toggleVideo(video);
  };
  const translateY = interpolate(animatedValue, {
    inputRange: [0, 1],
    outputRange: [0, height]
  });
  return (
    <videoContext.Provider value={{ video, selectVideo }}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        <View style={StyleSheet.absoluteFill}>{props.children}</View>
        {isOS && (
          <Animated.View style={{ transform: [{ translateY }] }}>
            {video && <VideoModal {...{ video }} />}
          </Animated.View>
        )}
        {!isOS && video && <VideoModal {...{ video }} />}
      </View>
    </videoContext.Provider>
  );
};
export { PlayerProvider };

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
