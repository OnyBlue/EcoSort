import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Alert, 
  Modal,
  TextInput 
} from 'react-native';

// --- INTEGRACIÓN CON FIREBASE ---
import { ResiduoService } from '../services/ResiduoService';

export default function HomeScreen({ navigation }) {
  const [seleccionado, setSeleccionado] = useState('Plástico');
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados para Firebase
  const [reportes, setReportes] = useState([]);

  // Estados para Creación Manual
  const [nuevoResiduoNombre, setNuevoResiduoNombre] = useState('');
  const [nuevoResiduoNivel, setNuevoResiduoNivel] = useState('');

  // --- ESCUCHAR FIREBASE ---
  useEffect(() => {
    const unsubscribe = ResiduoService.subscribe((data) => {
      setReportes(data);
    });
    return () => unsubscribe();
  }, []);

  // --- Obtiene el último nivel registrado ---
  const obtenerUltimoNivel = (tipo) => {
    const reportesDelTipo = reportes.filter(r => r.contenedor === tipo);
    if (reportesDelTipo.length > 0) {
      return parseInt(reportesDelTipo[0].nivel) || 0;
    }
    return 0;
  };

  // --- Obtener última fecha de recolección ---
  const obtenerUltimaRecoleccion = (tipo) => {
    const vaciado = reportes.find(r => r.contenedor === tipo && r.tipo_accion === "Contenedor vaciado");
    return vaciado ? vaciado.fechaFormateada : "No registrada";
  };

  const getStatusColor = (nivel) => {
    if (nivel >= 85) return '#EF4444'; 
    if (nivel >= 50) return '#F59E0B'; 
    return '#10B981'; 
  };

  const getEstadoTexto = (nivel) => {
    if (nivel >= 85) return 'Lleno';
    if (nivel >= 50) return 'Medio';
    return 'Vacío';
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", onPress: () => navigation.replace('Login'), style: "destructive" }
    ]);
  };

  // --- OPERACIONES CONTROL PANEL ---
  const modificarNivelYGuardar = async (cantidad) => {
    const nivelActual = obtenerUltimoNivel(seleccionado);
    const nuevoNivel = Math.max(0, Math.min(100, nivelActual + cantidad));
    await ResiduoService.create(seleccionado, nuevoNivel, "Aumento Manual");
  };

  const reiniciarNivel = async () => {
    await ResiduoService.create(seleccionado, 0, "Contenedor vaciado");
  };

  const crearRegistroManual = async () => {
    if (!nuevoResiduoNombre || !nuevoResiduoNivel) {
      Alert.alert("Campos vacíos", "Llena el nombre y el porcentaje.");
      return;
    }
    await ResiduoService.create(nuevoResiduoNombre, parseInt(nuevoResiduoNivel), "Ingreso Manual");
    setNuevoResiduoNombre('');
    setNuevoResiduoNivel('');
  };

  // --- COMPONENTE TARJETA ---
  const ContainerCard = ({ tipo, icon, capacidadMax }) => {
    const esActivo = seleccionado === tipo;
    const nivelActual = obtenerUltimoNivel(tipo);

    return (
      <TouchableOpacity 
        style={[styles.card, esActivo && styles.cardActive]}
        onPress={() => {
          if (esActivo) {
            // ENVIAMOS EL ARREGLO DE REPORTES COMPLETO A LA PANTALLA DE DETALLES
            navigation.navigate('Details', { 
              tipo, 
              nivel: nivelActual,
              estado: getEstadoTexto(nivelActual),
              capacidad: capacidadMax,
              ultimaRecoleccion: obtenerUltimaRecoleccion(tipo),
            }); 
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
        {esActivo ? <View style={styles.reportBadge}><Text style={styles.reportText}>Ver Detalles →</Text></View> : <Text style={styles.dotMark}>●</Text>}
      </TouchableOpacity>
    );
  };

  const nivelPanelControl = obtenerUltimoNivel(seleccionado);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
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
        
        {/* PANEL DE CONTROL EN TIEMPO REAL */}
        <View style={styles.controlPanel}>
          <Text style={styles.controlLabel}>Ajustando: <Text style={{color: '#2196F3'}}>{seleccionado}</Text></Text>
          <Text style={[styles.numero, { color: getStatusColor(nivelPanelControl) }]}>{nivelPanelControl}%</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.mainButton} onPress={() => modificarNivelYGuardar(10)}><Text style={styles.buttonText}>Aumentar</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#E2E8F0' }]} onPress={reiniciarNivel}><Text style={[styles.buttonText, { color: '#64748B' }]}>Vaciar</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#500b7e' }]} onPress={() => setModalVisible(true)}><Text style={[styles.buttonText, { color: '#ffffff' }]}>🚀 APIs</Text></TouchableOpacity>
          </View>
        </View>

        <ContainerCard tipo="Plástico" icon="🥤" capacidadMax="120 Litros" />
        <ContainerCard tipo="Metal" icon="🥫" capacidadMax="80 Litros" />
        <ContainerCard tipo="Otros" icon="🗑️" capacidadMax="150 Litros" />

        {/* REGISTRO ESPECIAL MANUAL */}
        <View style={styles.manualForm}>
          <Text style={styles.historyTitle}>Registro Especial</Text>
          <View style={styles.row}>
            <TextInput 
              style={[styles.inputEdit, { flex: 2, marginRight: 10 }]} 
              placeholder="¿Qué residuo es?"
              value={nuevoResiduoNombre}
              onChangeText={setNuevoResiduoNombre}
            />
            <TextInput 
              style={[styles.inputEdit, { flex: 1, marginRight: 10 }]} 
              placeholder="Nivel %"
              keyboardType="numeric"
              value={nuevoResiduoNivel}
              onChangeText={setNuevoResiduoNivel}
            />
            <TouchableOpacity style={styles.addBtn} onPress={crearRegistroManual}>
              <Text style={{color: '#FFF', fontWeight: 'bold'}}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MODAL APIS */}
        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona una Fuente</Text>
              <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={[styles.modalOption, { backgroundColor: '#22C55E' }]} onPress={() => { setModalVisible(false); navigation.navigate('Pokemon'); }}><Text style={styles.modalOptionText}>Pokémon Data</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalOption, { backgroundColor: '#1162e5' }]} onPress={() => { setModalVisible(false); navigation.navigate('StarWars'); }}><Text style={styles.modalOptionText}>Star Wars Universe</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalOption, { backgroundColor: '#ffaa00' }]} onPress={() => { setModalVisible(false); navigation.navigate('ChuckNorris'); }}><Text style={styles.modalOptionText}>Chuck Norris Facts</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalOption, { backgroundColor: '#00d4ff' }]} onPress={() => { setModalVisible(false); navigation.navigate('Weather'); }}><Text style={styles.modalOptionText}>Estado del Clima</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalOption, { backgroundColor: '#8B5CF6' }]} onPress={() => { setModalVisible(false); navigation.navigate('RickMorty'); }}><Text style={styles.modalOptionText}>Rick & Morty Wiki</Text></TouchableOpacity>
              </ScrollView>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={styles.closeModalText}>Cancelar</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

// Los estilos se mantienen idénticos a tu archivo original...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
  headerInfo: { flex: 1 },
  logoutButton: { backgroundColor: '#FEE2E2', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 13 },
  containerMain: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A202C' },
  tagline: { fontSize: 13, color: '#718096' },
  controlPanel: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, alignItems: 'center', marginBottom: 25, elevation: 4, marginTop: 10 },
  controlLabel: { fontSize: 13, fontWeight: 'bold', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: 1 },
  numero: { fontSize: 56, fontWeight: 'bold', marginVertical: 5 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10, width: '100%' },
  mainButton: { backgroundColor: '#2196F3', height: 50, borderRadius: 15, flex: 1, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: 'transparent', elevation: 2 },
  cardActive: { borderColor: '#2196F3', backgroundColor: '#F0F9FF' },
  statusIndicator: { width: 6, height: 45, borderRadius: 3, marginRight: 15 },
  cardContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  cardIcon: { fontSize: 30, marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#2D3748' },
  cardSubtitle: { fontSize: 14, color: '#718096', marginTop: 2 },
  reportBadge: { backgroundColor: '#2196F3', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  reportText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  dotMark: { color: '#CBD5E0', fontSize: 18, marginRight: 5 },
  manualForm: { marginTop: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 3 },
  addBtn: { backgroundColor: '#10B981', paddingHorizontal: 15, borderRadius: 10, justifyContent: 'center' },
  inputEdit: { borderBottomWidth: 2, borderBottomColor: '#2196F3', fontSize: 14, padding: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 30, padding: 25, alignItems: 'center', maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A202C', marginBottom: 20 },
  modalOption: { width: '100%', padding: 15, borderRadius: 15, marginBottom: 12, alignItems: 'center' },
  modalOptionText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  closeModalText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16, marginTop: 10 }
});