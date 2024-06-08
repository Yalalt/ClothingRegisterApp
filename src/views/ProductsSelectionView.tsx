// src/views/ProductsSelectionView.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, CheckBox } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import db from '../database';

const ProductsSelectionView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const { searchText, type } = route.params || {};

    let query = 'SELECT * FROM products';
    const params = [];

    if (searchText) {
      query += ' WHERE name LIKE ? OR code LIKE ?';
      params.push(`%${searchText}%`, `%${searchText}%`);
    } else if (type) {
      query += ' WHERE productType = ?';
      params.push(type);
    }

    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, { rows: { _array } }) => {
          setProducts(_array);
        },
        (txObj, error) => {
          Alert.alert('Error', 'Failed to load products');
          console.log(error);
        }
      );
    });
  }, [route.params]);

  const handleSelectProduct = (product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(product)
        ? prevSelected.filter((p) => p.id !== product.id)
        : [...prevSelected, product]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Product Selection</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productRow}>
            <Text>{item.code}</Text>
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
            <Text>{item.quantity}</Text>
            <CheckBox
              value={selectedProducts.includes(item)}
              onValueChange={() => handleSelectProduct(item)}
            />
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add" onPress={() => navigation.navigate('HomeView')} />
        <Button
          title="Sell"
          onPress={() => navigation.navigate('ShoppingCartView', { selectedProducts })}
        />
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
  title: {
    fontSize: 24,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductsSelectionView;
