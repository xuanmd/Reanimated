import React, { memo } from 'react';
import { StyleSheet, Image } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';
import {
  horizontalPanGestureHandler,
  snapPoint,
  interpolateColor,
  toRad
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

const withTranslate = ({
  state: gestureState,
  translationX,
  velocityX,
  darkMode
}) => {
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
            startClock(clock),
            timing(clock, state, {
              duration: 200,
              easing: Easing.inOut(Easing.ease),
              toValue: snapPoint(state.position, state.velocity, [
                leftBound,
                rightBound
              ])
            })
          ],
          [
            stopClock(clock),
            cond(
              and(
                greaterOrEq(state.position, 70),
                and(
                  neq(gestureState, State.ACTIVE),
                  neq(gestureState, State.BEGAN)
                )
              ),
              call([], darkMode)
            )
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
      set(
        translateX,
        withTranslate({ state, translationX, velocityX, darkMode })
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
  const borderColor = interpolateColor(translateX, {
    inputRange: [0, 70],
    outputRange: [{ r: 245, g: 245, b: 245 }, { r: 100, g: 100, b: 100 }]
  });
  const rotateImage = interpolate(translateX, {
    inputRange: [0, 70],
    outputRange: [toRad(0), toRad(120)]
  });
  return (
    <Animated.View style={[styles.switch, { borderColor }]}>
      <Image
        source={require('../../assets/bg1.png')}
        style={{ width: 120, height: 50 }}
      />
      <Animated.Image
        source={require('../../assets/bg2.png')}
        style={{
          width: 120,
          height: 50,
          position: 'absolute',
          opacity: moonOpacity
        }}
      />
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            width: 46,
            height: 46,
            position: 'absolute',
            transform: [{ translateX, rotate: rotateImage }]
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
    borderWidth: 2,
    overflow: 'hidden'
  },
  switchIcon: {
    height: 46,
    width: 46,
    position: 'absolute'
  }
});
export { ThemeSwitch };
