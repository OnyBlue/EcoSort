import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import EstadoContenedor from "../components/EstadoContenedor";
import MenuDesplegable from "../components/MenuDesplegable";

export default function HomeScreen({ navigation }) {
  const [niveles, setNiveles] = useState({
    Plástico: 0,
    Metal: 60,
    Papel: 30
  });

  const [seleccionado, setSeleccionado] = useState('Plástico');

  const getStatusColor = (nivel) => {
    if (nivel >= 85) return '#EF4444'; 
    if (nivel >= 50) return '#F59E0B'; 
    return '#10B981'; 
  };

  const modificarNivel = (cantidad) => {
    setNiveles(prev => ({
      ...prev,
      [seleccionado]: Math.max(0, Math.min(100, prev[seleccionado] + cantidad))
    }));
  };

  // Función para navegar a detalles
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
            irADetalles(tipo); // Si ya está seleccionado, navega
          } else {
            setSeleccionado(tipo); // Si no, lo selecciona
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

        {/* Texto dinámico a la derecha */}
        {esActivo ? (
          <View style={styles.reportBadge}>
            <Text style={styles.reportText}>Ver reporte {tipo.toLowerCase()} →</Text>
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
      <ScrollView contentContainerStyle={styles.container}>
        
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
              onPress={() => modificarNivel(10)}
            >
              <Text style={styles.buttonText}>Aumentar nivel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mainButton, { backgroundColor: '#E2E8F0' }]} 
              onPress={() => setNiveles({...niveles, [seleccionado]: 0})}
            >
              <Text style={[styles.buttonText, { color: '#64748B' }]}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ContainerCard tipo="Plástico" icon="🥤" />
        <ContainerCard tipo="Metal" icon="🥫" />
        <ContainerCard tipo="Papel" icon="📄" />
        <EstadoContenedor />

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


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, marginBottom: 10 },
  numero: { fontSize: 60, fontWeight: 'bold', color: '#2196F3', marginBottom: 20 },
  buttonGap: { marginVertical: 8, width: '80%' },
  divider: { height: 1, backgroundColor: '#ccc', width: '90%', marginVertical: 20 },
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 20 },
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
  
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  mainButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

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
    shadowColor: '#000',
    shadowOpacity: 0.05,
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
  reportText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  dotMark: { color: '#CBD5E0', fontSize: 18, marginRight: 5 }
});