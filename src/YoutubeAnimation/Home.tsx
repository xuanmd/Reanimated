import React, { useState } from 'react';
import * as Constants from 'expo-constants';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
// ui
import { ScrollView, StyleSheet } from 'react-native';
import { VideoThumbnail } from './components/VideoThumbnail';
import { PlayerProvider } from './components/PlayerProvider';

import videos from './components/videos';
import { useMemoOne } from 'use-memo-one';

interface IProps {}
const Home: React.SFC<IProps> = props => {
  const [ready, setReady] = useState(false);
  useMemoOne(async () => {
    await Promise.all(
      videos.map(video =>
        Promise.all([
          Asset.loadAsync(video.video),
          Asset.loadAsync(video.avatar),
          Asset.loadAsync(video.thumbnail)
        ])
      )
    );
    setReady(true);
  }, []);
  if (!ready) {
    return <AppLoading />;
  }
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
