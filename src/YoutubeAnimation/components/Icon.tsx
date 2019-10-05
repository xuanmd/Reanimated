import * as React from 'react';
// ui
import { View, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
interface IProps {
  name: string;
  label: string;
}

const Icon: React.SFC<IProps> = props => {
  const { name, label } = props;
  return (
    <View style={styles.container}>
      <Feather style={styles.icon} {...{ name }} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  icon: {
    fontSize: 24,
    color: 'gray'
  },
  label: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 8
  }
});
export { Icon };
