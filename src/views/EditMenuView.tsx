// src/views/EditMenuView.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EditMenuView = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Edit</Text>
      <View style={styles.buttonsContainer}>
        <Button title="Add New Product" onPress={() => navigation.navigate('AddProductView')} />
        <Button title="Edit Product" onPress={() => navigation.navigate('EditProductView')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
  },
});

export default EditMenuView;
