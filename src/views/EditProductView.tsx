// src/views/EditProductView.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import db from '../database';

const EditProductView = () => {
  const navigation = useNavigation();
  const [productType, setProductType] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [products, setProducts] = useState([]);

  const searchProducts = () => {
    let query = 'SELECT * FROM products';
    const params: any[] | undefined = [];

    if (productType) {
      query += ' WHERE productType = ?';
      params.push(productType);
    }

    if (searchCode) {
      query += params.length ? ' AND ' : ' WHERE ';
      query += 'code LIKE ?';
      params.push(`%${searchCode}%`);
    }

    db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
        (_, { rows: { _array } }) => {
          setProducts(_array);
        },
        (txObj, error) => {
          Alert.alert('Error', 'Failed to search products');
          console.log(error);
        }
      );
    });
  };

  const deleteProduct = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM products WHERE id = ?',
        [id],
        () => {
          Alert.alert('Success', 'Product deleted successfully');
          searchProducts();
        },
        (txObj, error) => {
          Alert.alert('Error', 'Failed to delete product');
          console.log(error);
        }
      );
    });
  };

  const saveProduct = (id, name, code, quantity, price) => {
    const total_price = quantity * price;
    const updatedAt = new Date().toISOString().split('T')[0];

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE products SET name = ?, code = ?, quantity = ?, price = ?, total_price = ?, updatedAt = ? WHERE id = ?',
        [name, code, quantity, price, total_price, updatedAt, id],
        () => {
          Alert.alert('Success', 'Product updated successfully');
          searchProducts();
        },
        (txObj, error) => {
          Alert.alert('Error', 'Failed to update product');
          console.log(error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button title='Back' onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Repair Goods</Text>
        <Text>{new Date().toISOString().split('T')[0]}</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.input} placeholder='Product Type' value={productType} onChangeText={setProductType} />
        <TextInput style={styles.input} placeholder='Search by Code' value={searchCode} onChangeText={setSearchCode} />
        <Button title='Search' onPress={searchProducts} />
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productRow}>
            <TextInput style={styles.productText} value={item.code} onChangeText={(text) => (item.code = text)} />
            <TextInput style={styles.productText} value={item.name} onChangeText={(text) => (item.name = text)} />
            <TextInput
              style={styles.productText}
              value={item.quantity.toString()}
              keyboardType='numeric'
              onChangeText={(text) => (item.quantity = parseFloat(text))}
            />
            <TextInput
              style={styles.productText}
              value={item.price.toString()}
              keyboardType='numeric'
              onChangeText={(text) => (item.price = parseFloat(text))}
            />
            <Text>{item.total_price}</Text>
            <Button
              title='Save'
              onPress={() => saveProduct(item.id, item.name, item.code, item.quantity, item.price)}
            />
            <Button title='Delete' onPress={() => deleteProduct(item.id)} />
          </View>
        )}
      />
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
  searchContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productText: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 5,
    padding: 5,
  },
});

export default EditProductView;
