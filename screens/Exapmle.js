import React, { useState } from 'react'; // 1. Importamos useState
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Pantalla de Ejemplo</Text>
      <Button 
        title="Ir a Detalles" 
        onPress={() => navigation.navigate('Home')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 10 },
  numero: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: '#2196F3', 
    marginBottom: 20 
  }
});