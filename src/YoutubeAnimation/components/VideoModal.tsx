import React from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { verticalPanGestureHandler, snapPoint } from 'react-native-redash';
import Animated, { Easing } from 'react-native-reanimated';
import { useMemoOne } from 'use-memo-one';
const {
  useCode,
  block,
  eq,
  cond,
  Value,
  set,
  add,
  lessOrEq,
  interpolate,
  Extrapolate,
  createAnimatedComponent,
  timing,
  Clock,
  startClock
} = Animated;
const AnimatedVideo = createAnimatedComponent(Video);
// ui
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { PlayerControl } from './PlayerControl';
import { VideoContent } from './VideoContent';
import { Video } from 'expo-av';
import { Video as VideoInterface } from './videos';

interface IProps {
  video: VideoInterface;
}
const { width, height } = Dimensions.get('window');
// width: 411
// height: 845
const statusBarHeight = StatusBar.currentHeight;
const minHeight = 60;
const upperBound = 0;
const midBound = height - 3 * minHeight;
const lowerBound = height - 2 * minHeight;

const withScroll = ({ velocityY, translationY, state: gestureState }) => {
  const state = {
    time: new Value(0),
    position: new Value(0),
    velocity: new Value(0),
    finished: new Value(0),
    frameTime: new Value(0)
  };
  const clock = new Clock();
  const offset = new Value(0);
  return block([
    startClock(clock),
    cond(
      eq(gestureState, State.ACTIVE),
      [
        set(state.position, add(offset, translationY)),
        cond(
          lessOrEq(state.position, upperBound),
          set(state.position, upperBound)
        ),
        set(state.velocity, velocityY),
        set(state.time, 0),
        set(state.frameTime, 0)
      ],
      [
        set(offset, state.position),
        timing(clock, state, {
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          toValue: snapPoint(state.position, state.velocity, [
            upperBound,
            lowerBound
          ])
        })
      ]
    ),
    state.position
  ]);
};
const VideoModal: React.SFC<IProps> = props => {
  const { video } = props;
  const translateY = useMemoOne(() => new Value(0), []);
  const { velocityY, translationY, state, gestureHandler } = useMemoOne(
    () => verticalPanGestureHandler(),
    []
  );
  useCode(
    block([set(translateY, withScroll({ velocityY, translationY, state }))]),
    []
  );
  const modalTranslateY = interpolate(translateY, {
    inputRange: [0, midBound, lowerBound],
    outputRange: [0, midBound, midBound + 40],
    extrapolate: Extrapolate.CLAMP
  });
  const containerWidth = interpolate(translateY, {
    inputRange: [0, midBound],
    outputRange: [width, width - 16],
    extrapolate: Extrapolate.CLAMP
  });
  const containerHeight = interpolate(translateY, {
    inputRange: [0, midBound],
    outputRange: [height, 0],
    extrapolate: Extrapolate.CLAMP
  });
  const videoWidth = interpolate(translateY, {
    inputRange: [0, midBound, lowerBound],
    outputRange: [width, width - 16, (minHeight * 21) / 9],
    extrapolate: Extrapolate.CLAMP
  });
  const videoHeight = interpolate(translateY, {
    inputRange: [0, midBound, lowerBound],
    outputRange: [231, 100, 60],
    extrapolate: Extrapolate.CLAMP
  });
  const contentOpacity = interpolate(translateY, {
    inputRange: [0, midBound],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
  });
  return (
    <>
      <View
        style={{
          height: statusBarHeight,
          backgroundColor: 'black'
        }}
      />
      <Animated.View
        style={[
          styles.shadow,
          {
            transform: [{ translateY: modalTranslateY }]
          }
        ]}
      >
        <PanGestureHandler {...gestureHandler}>
          <Animated.View
            style={{
              backgroundColor: 'white',
              width: containerWidth
            }}
          >
            <View style={{ ...StyleSheet.absoluteFillObject }}>
              <PlayerControl title={video.title} onPress={() => true} />
            </View>
            <AnimatedVideo
              source={video.video}
              style={{ width: videoWidth, height: videoHeight }}
              resizeMode={Video.RESIZE_MODE_COVER}
              shouldPlay
            />
          </Animated.View>
        </PanGestureHandler>

        <Animated.View
          style={{
            backgroundColor: 'white',
            width: containerWidth,
            height: containerHeight
          }}
        >
          <Animated.View
            style={{
              opacity: contentOpacity
            }}
          >
            <VideoContent {...{ video }} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </>
  );
};
const styles = StyleSheet.create({
  shadow: {
    alignItems: 'center',
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 2
  }
});
export { VideoModal };
