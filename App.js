import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux'
import Store from './redux/store/index'

import MyAppComponent from './components/MyAppComponent'

export default function App() {
  return (
    <View style={styles.container}>
      <Provider store={Store}>
        <MyAppComponent/>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
