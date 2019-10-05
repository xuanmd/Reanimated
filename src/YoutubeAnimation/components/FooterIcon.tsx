import * as React from 'react';
// ui
import { View, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface IProps {
  name: string;
  label: string;
}

const FooterIcon: React.SFC<IProps> = props => {
  const { name, label } = props;
  return (
    <View style={styles.container}>
      <Feather style={styles.icon} name={name} />
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
};
export { FooterIcon };

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center'
  },
  icon: {
    fontSize: 24,
    color: 'gray'
  },
  label: {
    color: 'gray',
    marginTop: 8,
    fontSize: 8,
    fontWeight: '500'
  }
});
