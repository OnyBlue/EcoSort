import React, { useState, useEffect } from 'react'; // 1. Agregamos useState
import { View, Text, Button, StyleSheet, ActivityIndicator, Pressable } from 'react-native';

export default function DetailsScreen({ navigation }) {
  // 2. Movemos la lógica de estado dentro de DetailsScreen
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      // Usando ZenQuotes como mencionaste antes (el formato de Quotable es distinto)
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      
      // En ZenQuotes las propiedades son 'q' para frase y 'a' para autor
      setQuote(data[0].q);
      setAuthor(data[0].a);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  // 3. El useEffect debe estar al nivel de la función, no dentro de fetchQuote
  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📜 Estás en Detalles</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>"{quote}"</Text>
          <Text style={styles.authorText}>- {author}</Text>
        </View>
      )}

      <Button title="Volver" onPress={() => navigation.goBack()} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f0f0',
    padding: 20 
  },
  header: { 
    fontSize: 18, 
    marginBottom: 20,
    fontWeight: 'bold' 
  },
  quoteBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
  },
  quoteText: { 
    fontSize: 16, 
    fontStyle: 'italic', 
    textAlign: 'center' 
  },
  authorText: { 
    fontSize: 14, 
    textAlign: 'right', 
    marginTop: 10,
    fontWeight: 'bold'
  }
});