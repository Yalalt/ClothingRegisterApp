// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createTables } from './src/database';
import { View } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    createTables();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;