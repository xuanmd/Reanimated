import React from 'react';
import * as Constants from 'expo-constants';

// ui
import { ScrollView, StyleSheet } from 'react-native';
import { VideoThumbnail } from './components/VideoThumbnail';
import { PlayerProvider } from './components/PlayerProvider';

import videos from './components/videos';

interface IProps {}
const Home: React.SFC<IProps> = props => {
  return (
    <PlayerProvider>
      <ScrollView style={styles.container}>
        {videos.map(video => (
          <VideoThumbnail key={video.id} video={video} />
        ))}
      </ScrollView>
    </PlayerProvider>
  );
};
export { Home };
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.default.statusBarHeight
  }
});
