import React, { useContext } from 'react';
// ui
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import { Video } from './videos';
import { videoContext } from './PlayerProvider';
interface IProps {
  video: Video;
}

const VideoThumbnail: React.SFC<IProps> = props => {
  const { video } = props;
  const { selectedVideo, selectVideo } = useContext(videoContext);
  return (
    <TouchableWithoutFeedback onPress={() => selectVideo(video)}>
      <View>
        <Image source={video.thumbnail} style={styles.thumbnail} />
        <View style={styles.description}>
          <Image source={video.avatar} style={styles.avatar} />
          <View>
            <Text style={styles.title}>{video.title}</Text>
            <Text style={styles.subtitle}>
              {`${video.username} • ${
                video.views
              } views • ${video.published.fromNow()}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export { VideoThumbnail };
const styles = StyleSheet.create({
  thumbnail: {
    width: '100%',
    height: 200
  },
  description: {
    flexDirection: 'row',
    margin: 16,
    marginBottom: 32
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16
  },
  title: {
    fontSize: 16
  },
  subtitle: {
    color: 'gray'
  }
});
