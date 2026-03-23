import React, { useState, useEffect } from 'react'; // 1. Agregamos useEffect aquí
import { View, Text, Button, StyleSheet, ActivityIndicator, Touchable } from 'react-native'; // 2. Agregamos ActivityIndicator

export default function ExampleScreen({ navigation }) {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      
      // ZenQuotes entrega un array: el texto en .q y autor en .a
      setQuote(data[0].q);
      setAuthor(data[0].a);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote("No se pudo cargar la frase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📜 Ejemplo de API</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>"{quote}"</Text>
          <Text style={styles.authorText}>- {author}</Text>
        </View>
      )}

      <View style={{ marginTop: 20, width: '80%' }}>
        <Button title="Volver" onPress={() => navigation.navigate("Home")} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F8F9FA',
    padding: 20 
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 30,
    color: '#333' 
  },
  quoteBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '100%',
  },
  quoteText: { 
    fontSize: 18, 
    fontStyle: 'italic', 
    textAlign: 'center',
    color: '#444'
  },
  authorText: { 
    fontSize: 14, 
    textAlign: 'right', 
    marginTop: 15,
    fontWeight: 'bold',
    color: '#777'
  }
});