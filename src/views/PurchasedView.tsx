import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import db from '../database';

const PurchasedView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { products } = route.params || [];

  const finalizePurchase = () => {
    db.transaction(tx => {
      products.forEach(product => {
        const { id, quantity } = product;
        tx.executeSql(
          'UPDATE products SET quantity = quantity - ? WHERE id = ?',
          [quantity, id],
          () => {},
          (txObj, error) => {
            Alert.alert('Error', 'Failed to update product quantity');
            console.log(error);
          }
        );
      });

      tx.executeSql('DELETE FROM temp_products', [], () => {
        Alert.alert('Success', 'Purchase finalized');
        navigation.navigate('HomeView');
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Sold Goods</Text>
        <Text>{new Date().toISOString().split('T')[0]}</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productRow}>
            <Text>{item.name}</Text>
            <Text>{item.code}</Text>
            <Text>{item.quantity}</Text>
            <Text>{item.price}</Text>
            <Text>{item.total_price}</Text>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <Button title="Home" onPress={() => navigation.navigate('HomeView')} />
        <Button title="Finish" onPress={finalizePurchase} />
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

export default PurchasedView;
