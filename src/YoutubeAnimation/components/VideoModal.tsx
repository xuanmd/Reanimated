import React, { useContext } from 'react';
import { Video } from 'expo-av';
// ui
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { videoContext } from './PlayerProvider';
import { PlayerControl } from './PlayerControl';
import { VideoContent } from './VideoContent';
interface IProps {}
const { width, height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;
const VideoModal: React.SFC<IProps> = props => {
  const { video } = useContext(videoContext);
  return (
    <>
      <View
        style={{
          height: statusBarHeight,
          backgroundColor: 'black'
        }}
      />
      <View style={styles.shadow}>
        <View style={{ backgroundColor: 'white', width }}>
          <View style={{ ...StyleSheet.absoluteFillObject }}>
            <PlayerControl title={video.title} onPress={() => true} />
          </View>
          <Video
            source={video.video}
            style={{ width, height: width / 1.78 }}
            resizeMode={Video.RESIZE_MODE_COVER}
            shouldPlay
          />
        </View>
        <View style={{ backgroundColor: 'white', width, height }}>
          <View>
            <VideoContent {...{ video }} />
          </View>
        </View>
      </View>
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
