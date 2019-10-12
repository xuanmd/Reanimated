import React, { useEffect, useState } from 'react';
// ui
import { View, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { SwipeCard } from './components/SwipeCard';
interface IProps {}
const profileData = [
  { image_url: require('../../assets/tinderImages/1.jpg'), name: 'Lan Anh' },
  { image_url: require('../../assets/tinderImages/2.jpg'), name: 'Truc Nhi' },
  { image_url: require('../../assets/tinderImages/3.jpg'), name: 'Tram Anh' },
  { image_url: require('../../assets/tinderImages/4.jpg'), name: 'Ribi Sachi' },
  { image_url: require('../../assets/tinderImages/5.jpg'), name: 'Kha Ngan' },
  { image_url: require('../../assets/tinderImages/6.jpg'), name: 'Vy' }
];
const Home: React.SFC<IProps> = props => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([
      Asset.loadAsync(require('../../assets/tinderImages/1.jpg')),
      Asset.loadAsync(require('../../assets/tinderImages/2.jpg')),
      Asset.loadAsync(require('../../assets/tinderImages/3.jpg')),
      Asset.loadAsync(require('../../assets/tinderImages/4.jpg')),
      Asset.loadAsync(require('../../assets/tinderImages/5.jpg')),
      Asset.loadAsync(require('../../assets/tinderImages/6.jpg'))
    ]).then(() => setReady(true));
  }, []);
  if (!ready) {
    return <AppLoading />;
  }
  return (
    <View style={styles.container}>
      <SwipeCard />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
export { Home };
