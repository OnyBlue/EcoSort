import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [contador, setContador] = useState(0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>🏠 Pantalla de Inicio</Text>
      
      <Text style={styles.numero}>{contador}</Text>

      <View style={styles.buttonGap}>
        <Button 
          title='Aumentar número' 
          onPress={() => setContador(contador + 1)} 
        />
      </View>

      <View style={styles.buttonGap}>
        <Button 
          title='Reiniciar número' 
          onPress={() => setContador(0)} 
          color="#ff5c5c"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.buttonGap}>
        <Button 
          title='Ir a Ejemplo' 
          onPress={() => navigation.navigate('Example')} 
          color="#4CAF50"
        />
      </View>

      <View style={styles.buttonGap}>
        <Button 
          title="Ir a Detalles (API)" 
          onPress={() => navigation.navigate('Details')} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, marginBottom: 10 },
  numero: { fontSize: 60, fontWeight: 'bold', color: '#2196F3', marginBottom: 20 },
  buttonGap: { marginVertical: 8, width: '80%' },
  divider: { height: 1, backgroundColor: '#ccc', width: '90%', marginVertical: 20 }
});