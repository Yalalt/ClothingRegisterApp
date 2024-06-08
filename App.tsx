import React, { useEffect } from'react';
import HomeView from './src/views/HomeView';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createTables } from './src/database';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditMenuView from './src/views/EditMenuView';
import AddProductView from './src/views/AddProductView';
import ProductsSelectionView from './src/views/ProductsSelectionView';
import EditProductView from './src/views/EditProductView';
import ShoppingCartView from './src/views/ShoppingCartView';
import PurchasedView from './src/views/PurchasedView';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    createTables();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HomeView'>
        <Stack.Screen name='HomeView' component={HomeView} options={{ title: 'Home' }} />
        <Stack.Screen name='EditMenuView' component={EditMenuView} options={{ title: 'Edit Menu'}} />
        <Stack.Screen name='ProductsSelectionView' component={ProductsSelectionView} options={{ title: 'Products Selection' }} />
        <Stack.Screen name='AddProductView' component={AddProductView} options={{ title: 'Add Product' }} />
        <Stack.Screen name='EditProductView' component={EditProductView} options={{ title: 'Edit Product' }} />
        <Stack.Screen name='ShoppingCartView' component={ShoppingCartView} options={{ title: 'Shopping Cart' }} />
        <Stack.Screen name='PurchasedView' component={PurchasedView} options={{ title: 'Purchased' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;