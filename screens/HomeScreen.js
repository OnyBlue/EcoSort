import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';

// --- INTEGRACIÓN CON FIREBASE ---
import { db } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

import EstadoContenedor from "../components/EstadoContenedor";
import MenuDesplegable from "../components/MenuDesplegable";

export default function HomeScreen({ navigation }) {
  const [niveles, setNiveles] = useState({
    Plástico: 0,
    Metal: 60,
    Papel: 30
  });

  const [seleccionado, setSeleccionado] = useState('Plástico');

  // Colores dinámicos según el nivel
  const getStatusColor = (nivel) => {
    if (nivel >= 85) return '#EF4444'; 
    if (nivel >= 50) return '#F59E0B'; 
    return '#10B981'; 
  };

  // FUNCIÓN PARA ACTUALIZAR NIVEL Y GUARDAR EN LA NUBE
  const modificarNivelYGuardar = async (cantidad) => {
    const nuevoNivel = Math.max(0, Math.min(100, niveles[seleccionado] + cantidad));
    
    setNiveles(prev => ({
      ...prev,
      [seleccionado]: nuevoNivel
    }));

    try {
      await addDoc(collection(db, "reportes_reciclaje"), {
        contenedor: seleccionado,
        nivel: nuevoNivel,
        fecha: serverTimestamp(),
        tipo_accion: "Aumento de nivel"
      });
      console.log("Datos sincronizados con éxito");
    } catch (error) {
      console.error("Error al subir a Firebase: ", error);
      Alert.alert("Error de conexión", "No se pudo guardar en la nube.");
    }
  };

  // Función para vaciar el contenedor
  const reiniciarNivel = async () => {
    setNiveles({...niveles, [seleccionado]: 0});
    try {
      await addDoc(collection(db, "reportes_reciclaje"), {
        contenedor: seleccionado,
        nivel: 0,
        fecha: serverTimestamp(),
        tipo_accion: "Contenedor vaciado"
      });
    } catch (e) {
      console.log("Error al resetear: ", e);
    }
  };

  const irADetalles = (tipo) => {
    navigation.navigate('Details', {
      tipo: tipo,
      nivel: niveles[tipo],
      estado: niveles[tipo] >= 85 ? 'Lleno' : 'Disponible',
      capacidad: tipo === 'Plástico' ? '100 kg' : tipo === 'Metal' ? '120 kg' : '80 kg',
      ultimaRecoleccion: '22/03/2026',
    });
  };

  const ContainerCard = ({ tipo, icon }) => {
    const esActivo = seleccionado === tipo;
    const nivelActual = niveles[tipo];

    return (
      <TouchableOpacity 
        style={[styles.card, esActivo && styles.cardActive]}
        activeOpacity={0.8}
        onPress={() => {
          if (esActivo) {
            irADetalles(tipo); 
          } else {
            setSeleccionado(tipo); 
          }
        }}
      >
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(nivelActual) }]} />
        
        <View style={styles.cardContent}>
          <Text style={styles.cardIcon}>{icon}</Text>
          <View>
            <Text style={styles.cardTitle}>Contenedor {tipo}</Text>
            <Text style={styles.cardSubtitle}>Nivel: {nivelActual}%</Text>
          </View>
        </View>

        {esActivo ? (
          <View style={styles.reportBadge}>
            <Text style={styles.reportText}>Reporte →</Text>
          </View>
        ) : (
          <Text style={styles.dotMark}>●</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.containerMain}>
        
        <View style={styles.header}>
          <Text style={styles.title}>🌱 EcoSort App</Text>
          <Text style={styles.tagline}>Gestión de residuo inteligente</Text>
        </View>

        <MenuDesplegable navigation={navigation} />

        <View style={styles.controlPanel}>
          <Text style={styles.controlLabel}>
            Ajustando: <Text style={{color: '#2196F3'}}>{seleccionado}</Text>
          </Text>
          <Text style={[styles.numero, { color: getStatusColor(niveles[seleccionado]) }]}>
            {niveles[seleccionado]}%
          </Text>
          
          <View style={styles.row}>
            <TouchableOpacity 
              style={styles.mainButton} 
              onPress={() => modificarNivelYGuardar(10)} 
            >
              <Text style={styles.buttonText}>Aumentar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mainButton, { backgroundColor: '#E2E8F0' }]} 
              onPress={reiniciarNivel} 
            >
              <Text style={[styles.buttonText, { color: '#64748B' }]}>Reiniciar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mainButton, { backgroundColor: '#97ce4c' }]} 
              onPress={() => navigation.navigate('RickMorty')} 
            >
              <Text style={styles.buttonText}>PEPINILLO RICK</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ContainerCard tipo="Plástico" icon="🥤" />
        <ContainerCard tipo="Metal" icon="🥫" />
        <ContainerCard tipo="Papel" icon="📄" />
        <EstadoContenedor />

        {/* Botón para la API de Pokémon */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#22C55E',
            padding: 15,
            borderRadius: 12,
            marginTop: 20,
            alignItems: 'center'
          }}
          onPress={() => navigation.navigate('Pokemon')}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
            Ver datos de la API (Pokémon)
          </Text>
        </TouchableOpacity>

        {/* BOTÓN STAR WARS */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#1162e5',
            padding: 15,
            borderRadius: 12,
            marginTop: 20,
            alignItems: 'center'
          }}
          onPress={() => navigation.navigate('StarWars')}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
            Ver datos de la API (Star Wars)
          </Text>
        </TouchableOpacity>

        {/* NUEVO BOTÓN: API de Chuck Norris */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#ffaa00',
            padding: 15,
            borderRadius: 12,
            marginTop: 15,
            alignItems: 'center'
          }}
          onPress={() => navigation.navigate('ChuckNorris')}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
            Ir a la API de Chuck Norris
          </Text>
        </TouchableOpacity>

        {/* NUEVO BOTÓN: API de Clima (OpenWeather) */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#00d4ff', // Color celeste/clima
            padding: 15,
            borderRadius: 12,
            marginTop: 15,
            alignItems: 'center'
          }}
          onPress={() => navigation.navigate('Weather')} // Asegúrate que este nombre coincida con tu Stack Navigator
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
            Consultar Clima Actual
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  containerMain: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A202C' },
  tagline: { fontSize: 14, color: '#718096' },

  controlPanel: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  controlLabel: { fontSize: 13, fontWeight: 'bold', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: 1 },
  numero: { fontSize: 56, fontWeight: 'bold', marginVertical: 5 },
  
  row: { flexDirection: 'row', gap: 10, marginTop: 10, width: '100%' },
  mainButton: {
    backgroundColor: '#2196F3',
    height: 50,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  cardActive: {
    borderColor: '#2196F3',
    backgroundColor: '#F0F9FF',
  },
  statusIndicator: { width: 6, height: 45, borderRadius: 3, marginRight: 15 },
  cardContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  cardIcon: { fontSize: 30, marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#2D3748' },
  cardSubtitle: { fontSize: 14, color: '#718096', marginTop: 2 },
  
  reportBadge: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  reportText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  dotMark: { color: '#CBD5E0', fontSize: 18, marginRight: 5 }
});