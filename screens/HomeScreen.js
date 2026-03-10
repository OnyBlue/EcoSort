import React, { useState } from 'react'; // 1. Importamos useState
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  // 2. Definimos el estado: 
  // 'contador' es el valor actual, 'setContador' es la función para cambiarlo.
  const [contador, setContador] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Pantalla de Inicio</Text>
      
      {/* 3. Mostramos el valor del contador */}
      <Text style={styles.numero}>{contador}</Text>

      <Button 
        title='Presiona para aumentar el número' 
        onPress={() => setContador(contador + 1)} // 4. Aumentamos el valor
      />

      <Button title='Reiniciar numero' 
      onPress={() => setContador(0)} /> 

      <View style={{ marginVertical: 10 }} />

      <Button 
        title="Ir a Detalles" 
        onPress={() => navigation.navigate('Details')} 
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