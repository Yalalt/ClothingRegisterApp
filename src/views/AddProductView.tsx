import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import db from '../database';
import { Product } from '../types/types';

const AddProductView = () => {
  const navigation = useNavigation();
  const [productType, setProductType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('');

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

      if(documentDirectory) {
        const newPath = `${documentDirectory}/${fileName}`;
        await FileSystem.moveAsync({ from: uri, to: newPath });
        setImageUri(newPath);
      } else {
        console.warn('Unable to access document directory');
      }
    }
  };

  const clearForm = () => {
    setProductType('');
    setName('');
    setCode('');
    setQuantity('');
    setPrice('');
    setTotalPrice('');
    setImageUri('');
  };

  const saveProduct = () => {
    const createdAt = new Date().toISOString().split('T')[0];
    const updatedAt = createdAt;
    const totalPrice = parseFloat(quantity) * parseFloat(price);

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO products (name, code, quantity, price, total_price, createdAt, updatedAt, image_uri) values (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, code, quantity, price, totalPrice, createdAt, updatedAt, imageUri],
        () => {
          Alert.alert('Success', 'Product saved successfully');
          clearForm();
        },
        (txObj, error) => {
          Alert.alert('Error', 'Failed to save product');
          console.log(error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>New Products</Text>
      </View>
      <Text style={styles.date}>{new Date().toISOString().split('T')[0]}</Text>
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text>Select Image</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Product Type"
        value={productType}
        onChangeText={setProductType}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Code"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Text style={styles.totalPrice}>Total Price: {parseFloat(quantity) * parseFloat(price)}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Clear" onPress={clearForm} />
        <Button title="Save" onPress={saveProduct} />
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
  },
  title: {
    fontSize: 24,
  },
  date: {
    alignSelf: 'flex-end',
    marginVertical: 10,
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
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  totalPrice: {
    marginVertical: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AddProductView;
