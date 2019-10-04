import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { Cursor } from './Cursor';
// interfaces
interface IProps {}
// animation
const { Value } = Animated;
const { width: totalWidth } = Dimensions.get('window');
const count = 5;
const width = totalWidth / count;
const height = width;
const Slider: React.FunctionComponent<IProps> = props => {
  const x = new Value(0);
  const snapPoints = new Array(count)
    .fill(0)
    .map((e, i) => ({ x: i * height }));
  return (
    <View style={styles.container}>
      <Cursor
        size={height}
        {...{ x, count }}
        snapPoints={snapPoints}
        animatedValueX={x}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: totalWidth,
    height,
    borderRadius: height / 2,
    backgroundColor: '#f1f2f6'
  }
});
export { Slider };
