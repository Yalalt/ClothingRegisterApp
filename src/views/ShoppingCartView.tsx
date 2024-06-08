import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import db from '../database';
import { Product } from '../types/types';

const ShoppingCartView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedProducts } = route.params || [];
  const [products, setProducts] = useState<Product[]>(selectedProducts);

  const handleQuantityChange = (index: number, quantity: number) => {
    const newProducts = [...products];
    newProducts[index].quantity = quantity;
    newProducts[index].total_price = quantity * newProducts[index].price;
    setProducts(newProducts);
  };

  const handleDeleteProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const saveProducts = () => {
    db.transaction(tx => {
      products.forEach(product => {
        const { name, code, quantity, price, total_price, image_uri } = product;
        const createdAt = new Date().toISOString().split('T')[0];
        const updatedAt = createdAt;
        tx.executeSql(
          'INSERT INTO temp_products (name, code, quantity, price, total_price, createdAt, updatedAt, image_uri) values (?, ?, ?, ?, ?, ?, ?, ?)',
          [name, code, quantity, price, total_price, createdAt, updatedAt, image_uri],
          () => {},
          (txObj, error) => {
            Alert.alert('Error', 'Failed to save product to temp');
            console.log(error);
          }
        );
      });
    });
    navigation.navigate('PurchasedView', { products });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Selected goods</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.productRow}>
            <Image source={{ uri: item.image_uri }} style={styles.image} />
            <View style={styles.productDetails}>
              <Text>{item.name}</Text>
              <Text>{item.code}</Text>
              <TextInput
                style={styles.input}
                value={item.quantity.toString()}
                onChangeText={(text) => handleQuantityChange(index, parseFloat(text))}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.priceDetails}>
              <TextInput
                style={styles.input}
                value={item.price.toString()}
                onChangeText={(text) => handleQuantityChange(index, parseFloat(text))}
                keyboardType="numeric"
              />
              <Text>{item.total_price}</Text>
              <TouchableOpacity onPress={() => handleDeleteProduct(index)}>
                <Text style={styles.deleteButton}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button title="Save" onPress={saveProducts} />
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
  title: {
    fontSize: 24,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    marginBottom: 5,
  },
  priceDetails: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ShoppingCartView;
