import React from 'react';

import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface IProps {
  onPress(): void;
  title: string;
}

const PlayerControl: React.SFC<IProps> = props => {
  const { onPress, title } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.placeholder} />
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        <Feather style={styles.icon} name='play' />
        <TouchableWithoutFeedback onPress={() => {}}>
          <Feather style={styles.icon} name='x' />
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export { PlayerControl };

const { width } = Dimensions.get('window');
export const PLACEHOLDER_WIDTH = width / 3;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: 8
  },
  placeholder: {
    width: PLACEHOLDER_WIDTH
  },
  icon: {
    fontSize: 24,
    color: 'gray',
    padding: 8
  }
});
