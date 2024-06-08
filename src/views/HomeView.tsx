// src/views/HomeView.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const HomeView = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [imageUri, setImageUri] = useState('');

  const documentDirectory = FileSystem.documentDirectory;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImageUri(uri);
      const fileName = uri.split('/').pop();
      if (documentDirectory) {
        const newPath = `${documentDirectory}/${fileName}`;
        await FileSystem.moveAsync({ from: uri, to: newPath });
        setImageUri(newPath);
      } else {
        console.warn('Unable to access document directory');
      }
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button title='Edit' onPress={() => navigation.navigate('EditMenuView')} />
        <Text>{getCurrentDate()}</Text>
      </View>
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text>Select Image</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='Search products...'
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title='Search' onPress={() => navigation.navigate('ProductsSelectionView', { searchText })} />
      </View>
      <View style={styles.buttonsContainer}>
        <Button title='Shirts' onPress={() => navigation.navigate('ProductsSelectionView', { type: 'shirts' })} />
        <Button title='Pants' onPress={() => navigation.navigate('ProductsSelectionView', { type: 'pants' })} />
        <Button
          title='Outer Clothes'
          onPress={() => navigation.navigate('ProductsSelectionView', { type: 'outer_clothes' })}
        />
        <Button title='Hats' onPress={() => navigation.navigate('ProductsSelectionView', { type: 'hats' })} />
        <Button title='Shoes' onPress={() => navigation.navigate('ProductsSelectionView', { type: 'shoes' })} />
        <Button title='Others' onPress={() => navigation.navigate('ProductsSelectionView', { type: 'others' })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HomeView;
