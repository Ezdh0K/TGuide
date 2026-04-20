import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EventBoardScreen() {
  return (
    <View style={styles.container}>
      <Text>Здесь будут события в городе которые можно посетить</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});