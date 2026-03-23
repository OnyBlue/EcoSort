import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import EstadoContenedor from "../components/EstadoContenedor";

export default function HomeScreen({ navigation }) {

  const [contador, setContador] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 EcoSort App</Text>

      <Text style={styles.numero}>{contador}%</Text>

      <Button 
        title="Aumentar nivel" 
        onPress={() => setContador(contador + 10)} 
      />

      <Button 
        title="Reiniciar" 
        onPress={() => setContador(0)} 
      />

      <View style={{ marginVertical: 10 }} />

      {/* BOTONES CON ENVÍO DE PARÁMETROS */}

      <Button 
        title="Contenedor Plástico"
        onPress={() =>
          navigation.navigate('Details', {
            tipo: 'Plástico',
            nivel: contador,
            estado: contador >= 80 ? 'Lleno' : 'Disponible',
            capacidad: '100 kg',
            ultimaRecoleccion: '20/03/2026',
          })
        }
      />

      <View style={{ marginVertical: 5 }} />

      <Button 
        title="Contenedor Metal"
        onPress={() =>
          navigation.navigate('Details', {
            tipo: 'Metal',
            nivel: 60,
            estado: 'Disponible',
            capacidad: '120 kg',
            ultimaRecoleccion: '19/03/2026',
          })
        }
      />

      <EstadoContenedor />
      
      <View style={{ marginVertical: 5 }} />

      <Button 
        title="Contenedor Papel"
        onPress={() =>
          navigation.navigate('Details', {
            tipo: 'Papel',
            nivel: 90,
            estado: 'Lleno',
            capacidad: '80 kg',
            ultimaRecoleccion: '18/03/2026',
          })
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 10 },
  numero: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: '#2196F3', 
    marginBottom: 20 
  }
});
