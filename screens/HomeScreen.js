import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Alert, 
  Modal 
} from 'react-native';

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
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusColor = (nivel) => {
    if (nivel >= 85) return '#EF4444'; 
    if (nivel >= 50) return '#F59E0B'; 
    return '#10B981'; 
  };

  // --- FUNCIÓN CERRAR SESIÓN ---
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          onPress: () => navigation.replace('Login'), // Reemplaza Home por Login
          style: "destructive" 
        }
      ]
    );
  };

  const modificarNivelYGuardar = async (cantidad) => {
    const nuevoNivel = Math.max(0, Math.min(100, niveles[seleccionado] + cantidad));
    setNiveles(prev => ({ ...prev, [seleccionado]: nuevoNivel }));

    try {
      await addDoc(collection(db, "reportes_reciclaje"), {
        contenedor: seleccionado,
        nivel: nuevoNivel,
        fecha: serverTimestamp(),
        tipo_accion: "Aumento de nivel"
      });
    } catch (error) {
      console.error("Error al subir a Firebase: ", error);
      Alert.alert("Error de conexión", "No se pudo guardar en la nube.");
    }
  };

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
      
      {/* HEADER CON BOTÓN DE SALIR */}
      <View style={styles.topBar}>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>🌱 EcoSort App</Text>
          <Text style={styles.tagline}>Gestión de residuo inteligente</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.containerMain}>
        
        {/* COMPONENTES DE ESTADO */}
        {/* <EstadoContenedor /> */}
        {/*<MenuDesplegable navigation={navigation} />*/}

        <View style={styles.controlPanel}>
          <Text style={styles.controlLabel}>
            Ajustando: <Text style={{color: '#2196F3'}}>{seleccionado}</Text>
          </Text>
          <Text style={[styles.numero, { color: getStatusColor(niveles[seleccionado]) }]}>
            {niveles[seleccionado]}%
          </Text>
          
          <View style={styles.row}>
            <TouchableOpacity style={styles.mainButton} onPress={() => modificarNivelYGuardar(10)}>
              <Text style={styles.buttonText}>Aumentar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mainButton, { backgroundColor: '#E2E8F0' }]} 
              onPress={reiniciarNivel} 
            >
              <Text style={[styles.buttonText, { color: '#64748B' }]}>Reiniciar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mainButton, { backgroundColor: '#500b7e' }]} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.buttonText, { color: '#ffffff' }]}>🚀 APIs</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ContainerCard tipo="Plástico" icon="🥤" />
        <ContainerCard tipo="Metal" icon="🥫" />
        <ContainerCard tipo="Papel" icon="📄" />

        {/* --- MODAL DE APIS --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona una Fuente</Text>
              
              <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[styles.modalOption, { backgroundColor: '#22C55E' }]} 
                  onPress={() => { setModalVisible(false); navigation.navigate('Pokemon'); }}
                >
                  <Text style={styles.modalOptionText}>Pokémon Data</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, { backgroundColor: '#1162e5' }]} 
                  onPress={() => { setModalVisible(false); navigation.navigate('StarWars'); }}
                >
                  <Text style={styles.modalOptionText}>Star Wars Universe</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, { backgroundColor: '#ffaa00' }]} 
                  onPress={() => { setModalVisible(false); navigation.navigate('ChuckNorris'); }}
                >
                  <Text style={styles.modalOptionText}>Chuck Norris Facts</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, { backgroundColor: '#00d4ff' }]} 
                  onPress={() => { setModalVisible(false); navigation.navigate('Weather'); }}
                >
                  <Text style={styles.modalOptionText}>Estado del Clima</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, { backgroundColor: '#8B5CF6' }]} 
                  onPress={() => { setModalVisible(false); navigation.navigate('RickMorty'); }}
                >
                  <Text style={styles.modalOptionText}>Rick & Morty Wiki</Text>
                </TouchableOpacity>
              </ScrollView>

              <TouchableOpacity 
                style={styles.closeModalButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeModalText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7'
  },
  headerInfo: { flex: 1 },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 13 },
  containerMain: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A202C' },
  tagline: { fontSize: 13, color: '#718096' },

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
    marginTop: 10
  },
  controlLabel: { fontSize: 13, fontWeight: 'bold', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: 1 },
  numero: { fontSize: 56, fontWeight: 'bold', marginVertical: 5 },
  
  row: { flexDirection: 'row', gap: 8, marginTop: 10, width: '100%' },
  mainButton: {
    backgroundColor: '#2196F3',
    height: 50,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },

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
  dotMark: { color: '#CBD5E0', fontSize: 18, marginRight: 5 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 20,
  },
  modalOption: {
    width: '100%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  modalOptionText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  closeModalButton: {
    marginTop: 10,
    padding: 10,
  },
  closeModalText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 }
});