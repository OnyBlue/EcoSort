import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function WeatherScreen({ navigation }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  // CORRECCIÓN: La API KEY debe ir entre comillas simples o dobles
  const API_KEY = 'e586f1391bd8964fefd563fafe1f1a47'; 
  const CITY = 'Merida,MX'; 

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=es&appid=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeather(data);
      } else {
        // Esto te avisará en la consola si la ciudad no existe o la llave está mal
        console.error('Error de API:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener el clima:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado del Clima</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={{color: '#aaa', marginTop: 10}}>Cargando datos...</Text>
        </View>
      ) : weather ? (
        <View style={styles.card}>
          <Text style={styles.cityName}>{weather.name}</Text>
          
          <Image
            source={{ 
              uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` 
            }}
            style={styles.image}
          />
          
          <Text style={styles.tempText}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.description}>{weather.weather[0].description}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humedad</Text>
              <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Viento</Text>
              <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={{color: '#ff4444'}}>No se pudo cargar la información</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>Actualizar Clima</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#151515',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#202020',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    // Sombra para Android
    elevation: 10,
  },
  cityName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 140,
    height: 140,
  },
  tempText: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    marginTop: -10,
  },
  description: {
    color: '#00d4ff',
    fontSize: 18,
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    color: '#777',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#00d4ff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#151515',
    fontWeight: 'bold',
    fontSize: 16,
  },
});