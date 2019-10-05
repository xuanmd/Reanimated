import * as React from 'react';
// ui
import { View, StyleSheet } from 'react-native';
import { FooterIcon } from './FooterIcon';
interface IProps {}
const HEADER_HEIGHT = 80;

const Footer: React.SFC<IProps> = props => {
  return (
    <View style={styles.container}>
      <FooterIcon name='home' label='Home' />
      <FooterIcon name='trending-up' label='Trending' />
      <FooterIcon name='youtube' label='Subscriptions' />
      <FooterIcon name='mail' label='Inbox' />
      <FooterIcon name='folder' label='Folder' />
    </View>
  );
};
export { Footer };

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});
