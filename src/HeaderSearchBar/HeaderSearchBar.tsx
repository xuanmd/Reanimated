import * as React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  FlatList,
  Text,
  TextInput
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { onScroll } from 'react-native-redash';
import { useMemoOne } from 'use-memo-one';

const { Value, createAnimatedComponent, interpolate, Extrapolate } = Animated;
const AnimatedFlatList = createAnimatedComponent(FlatList);
const AnimatedInput = createAnimatedComponent(TextInput);
const data = new Array(20);
interface IProps {}
const renderItem = ({ item, index }) => {
  return (
    <View style={styles.listItem}>
      <Text>This is flatlist {index}</Text>
    </View>
  );
};
const HeaderSearchBar: React.SFC<IProps> = props => {
  const y = useMemoOne(() => new Value(0), []);
  const searchWidth = interpolate(y, {
    inputRange: [0, 50],
    outputRange: [300, 350],
    extrapolate: Extrapolate.CLAMP
  });
  const headerTranslate = interpolate(y, {
    inputRange: [0, 50],
    outputRange: [0, -42],
    extrapolate: Extrapolate.CLAMP
  });
  const logoOpacity = interpolate(y, {
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
  });
  return (
    <View style={styles.container}>
      <AnimatedFlatList
        contentContainerStyle={{ paddingTop: 120 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        scrollEventThrottle={16}
        onScroll={onScroll({ y })}
      />
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] }
        ]}
      >
        <Animated.Text style={[styles.logo, { opacity: logoOpacity }]}>
          Tiki
        </Animated.Text>
        <View style={styles.searchBar}>
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              right: 15,
              alignItems: 'center'
            }}
          >
            <TouchableOpacity style={{ marginRight: 15 }}>
              <FontAwesome5 name='filter' size={20} color='#DFEAF2' />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome5 name='shopping-cart' size={24} color='#DFEAF2' />
            </TouchableOpacity>
          </View>
          <AnimatedInput
            placeholder='Search...'
            style={[styles.input, { width: searchWidth }]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA'
  },
  header: {
    justifyContent: 'space-evenly',
    paddingTop: StatusBar.currentHeight,
    height: 120,
    backgroundColor: '#007AFF',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  input: {
    height: 44,
    backgroundColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 15
  },
  listItem: {
    height: 60,
    marginHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    borderRadius: 4,
    paddingHorizontal: 10
  }
});

export { HeaderSearchBar };
