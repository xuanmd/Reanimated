import React from 'react';
// ui
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from './Card';
interface IProps {}

const SwipeCard: React.SFC<IProps> = props => {
  return (
    <View>
      <View style={styles.header}>
        <Feather name='user' size={32} color='gray' />
        <Feather name='message-circle' size={32} color='gray' />
      </View>
      <Card />
      <View style={styles.footer}>
        <View style={styles.circle}>
          <Feather name='x' size={32} color='#ec5288' />
        </View>
        <View style={styles.circle}>
          <Feather name='heart' size={32} color='#6ee3b4' />
        </View>
      </View>
    </View>
  );
};
export { SwipeCard };
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'gray',
    shadowOpacity: 0.6
  }
});
