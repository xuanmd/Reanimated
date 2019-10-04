import React, { memo, useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';
import {
  horizontalPanGestureHandler,
  snapPoint,
  interpolateColor,
  approximates
} from 'react-native-redash';
import { useMemoOne } from 'use-memo-one';
interface IProps {}
const {
  useCode,
  block,
  Value,
  set,
  add,
  cond,
  eq,
  Clock,
  greaterOrEq,
  lessOrEq,
  and,
  not,
  startClock,
  stopClock,
  greaterThan,
  lessThan,
  timing,
  interpolate,
  Extrapolate,
  createAnimatedComponent,
  call,
  neq
} = Animated;

const withTranslate = ({ state: gestureState, translationX, velocityX }) => {
  const clock = new Clock();
  const anchor = new Value(0);
  const state = {
    time: new Value(0),
    position: new Value(0),
    velocity: new Value(0),
    finished: new Value(0),
    frameTime: new Value(0)
  };
  const leftBound = 0;
  const rightBound = 70;
  return block([
    startClock(clock),
    cond(
      eq(gestureState, State.ACTIVE),
      [
        set(state.position, add(anchor, translationX)),
        cond(
          not(greaterOrEq(state.position, leftBound)),
          set(state.position, 0)
        ),
        cond(
          not(lessOrEq(state.position, rightBound)),
          set(state.position, 70)
        ),
        set(state.velocity, velocityX),
        set(state.time, 0),
        set(state.frameTime, 0)
      ],
      [
        set(anchor, state.position),
        cond(
          and(
            greaterThan(state.position, leftBound),
            lessThan(state.position, rightBound)
          ),
          [
            timing(clock, state, {
              duration: 200,
              easing: Easing.inOut(Easing.ease),
              toValue: snapPoint(state.position, state.velocity, [
                leftBound,
                rightBound
              ])
            })
          ]
        )
      ]
    ),
    state.position
  ]);
};
const AnimatedImage = createAnimatedComponent(Image);

const ThemeSwitch: React.SFC<IProps> = memo(props => {
  const { state, gestureHandler, translationX, velocityX } = useMemoOne(
    () => horizontalPanGestureHandler(),
    []
  );
  const translateX = useMemoOne(() => new Value(0), []);
  const darkMode = () => {
    console.log('dark mode');
  };
  useCode(
    block([
      set(translateX, withTranslate({ state, translationX, velocityX })),
      cond(
        and(eq(translateX, 70), neq(state, State.ACTIVE)),
        call([], darkMode)
      )
    ]),
    []
  );
  const sunOpacity = interpolate(translateX, {
    inputRange: [0, 70],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
  });
  const moonOpacity = interpolate(translateX, {
    inputRange: [0, 70],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP
  });
  const backgroundColor = interpolateColor(translateX, {
    inputRange: [0, 70],
    outputRange: [{ r: 255, g: 255, b: 255 }, { r: 7, g: 11, b: 52 }]
  });
  const borderColor = interpolateColor(translateX, {
    inputRange: [0, 70],
    outputRange: [{ r: 200, g: 200, b: 200 }, { r: 100, g: 100, b: 100 }]
  });
  return (
    <Animated.View style={[styles.switch, { backgroundColor, borderColor }]}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            width: 46,
            height: 46,
            position: 'absolute',
            transform: [{ translateX }]
          }}
        >
          <AnimatedImage
            source={require('../../assets/moon.png')}
            style={[styles.switchIcon, { opacity: moonOpacity }]}
          />
          <AnimatedImage
            source={require('../../assets/sun.png')}
            style={[styles.switchIcon, { opacity: sunOpacity }]}
          />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  switch: {
    height: 50,
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2
  },
  switchIcon: {
    height: 46,
    width: 46,
    position: 'absolute'
  }
});
export { ThemeSwitch };
