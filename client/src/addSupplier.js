import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import Axios from 'axios';

const AddSupplierScreen = () => {
  const [supplierName, setSupplierName] = useState('');
  const [category, setCategory] = useState('');

  const addSupplier = () => {
    Axios.post('http://localhost:8080/supplier', {
      supplier_name: supplierName,
      category: category
    })
    .then((response) => {
      console.log('Supplier added successfully:', response.data);
      // Handle success, maybe navigate to another screen or show a success message
    })
    .catch((error) => {
      console.error('Error adding supplier:', error);
      // Handle error, display an error message to the user
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Supplier Name"
        onChangeText={(text) => setSupplierName(text)}
        value={supplierName}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        onChangeText={(text) => setCategory(text)}
        value={category}
      />
      <Button title="Add Supplier" onPress={addSupplier} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
});

export default AddSupplierScreen;
