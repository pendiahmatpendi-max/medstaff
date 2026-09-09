import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InboxScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ini adalah Halaman Kotak Masuk</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  text: { fontSize: 18, fontWeight: 'bold' }
});