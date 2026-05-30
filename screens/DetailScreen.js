import React, { useState, useEffect } from 'react'; // Añadimos useEffect
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, TextInput, Alert } from 'react-native';

// Importamos el servicio para el CRUD y la escucha activa
import { ResiduoService } from '../services/ResiduoService';

export default function DetailsScreen({ navigation, route }) {
  if (!route.params) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No hay datos disponibles</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { 
    tipo = "Desconocido", 
    capacidad = "N/A"
  } = route.params;

  // ESTADOS LOCALES DINÁMICOS EN LUGAR DE ESTÁTICOS
  const [reportesDelContenedor, setReportesDelContenedor] = useState([]);
  const [nivelActual, setNivelActual] = useState(route.params.nivel || 0);
  const [estadoActual, setEstadoActual] = useState(route.params.estado || "Vacío");
  const [ultimaRecoleccion, setUltimaRecoleccion] = useState(route.params.ultimaRecoleccion || "No registrada");

  // Estados para soportar la edición en el historial
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoValorEdit, setNuevoValorEdit] = useState('');

  // --- ESCUCHA EN TIEMPO REAL EXCLUSIVA PARA ESTA PANTALLA ---
  useEffect(() => {
    const unsubscribe = ResiduoService.subscribe((todoElHistorial) => {
      // 1. Filtramos los reportes exclusivos de este material
      const filtrados = todoElHistorial.filter(r => r.contenedor === tipo);
      setReportesDelContenedor(filtrados);

      // 2. Actualizamos dinámicamente el nivel superior con la lectura más reciente de Firebase (o del ESP32)
      if (filtrados.length > 0) {
        const masReciente = filtrados[0];
        const nivelNum = parseInt(masReciente.nivel) || 0;
        setNivelActual(nivelNum);
        
        // Calcular estado al vuelo
        if (nivelNum >= 85) setEstadoActual('Lleno');
        else if (nivelNum >= 50) setEstadoActual('Medio');
        else setEstadoActual('Vacío');
      }

      // 3. Buscamos el último vaciado actualizado
      const vaciado = todoElHistorial.find(r => r.contenedor === tipo && r.tipo_accion === "Contenedor vaciado");
      if (vaciado) setUltimaRecoleccion(vaciado.fechaFormateada);
    });

    return () => unsubscribe(); // Apagar escucha al salir
  }, [tipo]);

  const theme = {
    Plástico: { color: '#3B82F6', icon: '🥤' },
    Metal: { color: '#64748B', icon: '🥫' },
    Papel: { color: '#F59E0B', icon: '📄' },
  }[tipo] || { color: '#10B981', icon: '🗑️' };

  const getStatusColor = (n) => (n >= 85 ? '#EF4444' : n >= 50 ? '#F59E0B' : '#10B981');

  // Funciones CRUD directas
  const actualizarRegistro = async (id) => {
    if (!nuevoValorEdit) return setEditandoId(null);
    await ResiduoService.update(id, nuevoValorEdit);
    setEditandoId(null);
    setNuevoValorEdit('');
  };

  const eliminarRegistro = (id) => {
    Alert.alert("Eliminar", "¿Borrar este registro?", [
      { text: "No" },
      { text: "Sí", onPress: () => ResiduoService.delete(id) }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.headerContainer, { backgroundColor: theme.color }]}>
        <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>
          <Text style={styles.headerBackText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerIcon}>{theme.icon}</Text>
        <Text style={styles.headerTitle}>Contenedor de {tipo}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card Principal Reactiva */}
        <View style={styles.mainCard}>
          <Text style={styles.sectionLabel}>ESTADO DE LLENADO</Text>
          <View style={styles.levelRow}>
            <Text style={[styles.percentageText, { color: getStatusColor(nivelActual) }]}>{nivelActual}%</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(nivelActual) + '20' }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor(nivelActual) }]}>{estadoActual.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${Math.min(100, Math.max(0, nivelActual))}%`, backgroundColor: getStatusColor(nivelActual) }]} />
          </View>
        </View>

        {/* Grid Técnico */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Capacidad Máxima</Text>
            <Text style={styles.infoValue}>{capacidad}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Último Vaciado</Text>
            <Text style={styles.infoValue}>{ultimaRecoleccion}</Text>
          </View>
        </View>

        {/* HISTORIAL EXCLUSIVO CON REFRESH AUTOMÁTICO */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Historial de {tipo}</Text>
          {reportesDelContenedor.length === 0 ? (
            <Text style={styles.noDataText}>No hay reportes registrados para este contenedor.</Text>
          ) : (
            reportesDelContenedor.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={{ flex: 1 }}>
                  {editandoId === item.id ? (
                    <TextInput 
                      style={styles.inputEdit} 
                      keyboardType="numeric" 
                      defaultValue={item.nivel.toString()}
                      onChangeText={setNuevoValorEdit}
                      onBlur={() => actualizarRegistro(item.id)}
                      autoFocus
                    />
                  ) : (
                    <Text style={styles.historyValue}>{item.nivel}% - {item.tipo_accion}</Text>
                  )}
                  <Text style={styles.historyDate}>{item.fechaFormateada}</Text>
                </View>
                <View style={styles.historyActions}>
                  <TouchableOpacity onPress={() => setEditandoId(item.id)} style={{ marginRight: 15 }}><Text>✏️</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarRegistro(item.id)}><Text>🗑️</Text></TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Tip EcoSort</Text>
          <Text style={styles.tipText}>
            {nivelActual >= 85 
              ? `El contenedor de ${tipo.toLowerCase()} requiere recolección inmediata para evitar desbordamientos en la rampa.`
              : `Aún hay espacio suficiente. El ESP32 continuará monitoreando las lecturas automáticas.`}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.color }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>Entendido</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// Los estilos se mantienen exactamente igual que antes...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  errorText: { fontSize: 16, color: '#64748B', marginBottom: 20 },
  backButton: { backgroundColor: '#3B82F6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  backButtonText: { color: 'white', fontWeight: 'bold' },
  headerContainer: { height: 200, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingTop: 40 },
  headerBack: { position: 'absolute', top: 50, left: 20 },
  headerBackText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  headerIcon: { fontSize: 60, marginBottom: 10 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  content: { padding: 20 },
  mainCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginTop: -40, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 1 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  percentageText: { fontSize: 42, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold' },
  progressTrack: { height: 10, backgroundColor: '#E2E8F0', borderRadius: 5, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 5 },
  infoGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  infoItem: { flex: 1, backgroundColor: 'white', borderRadius: 15, padding: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  infoLabel: { fontSize: 11, color: '#64748B', marginBottom: 5, fontWeight: '600' },
  infoValue: { fontSize: 14, color: '#1E293B', fontWeight: 'bold' },
  tipCard: { backgroundColor: '#F1F5F9', borderRadius: 15, padding: 15, marginBottom: 30, borderLeftWidth: 4, borderLeftColor: '#CBD5E0', marginTop: 20 },
  tipTitle: { fontWeight: 'bold', color: '#475569', marginBottom: 5 },
  tipText: { color: '#64748B', fontSize: 14, lineHeight: 20 },
  actionButton: { paddingVertical: 16, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  historySection: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, marginBottom: 5 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 },
  historyItem: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  historyValue: { fontSize: 15, color: '#4A5568', marginVertical: 2 },
  historyDate: { fontSize: 11, color: '#A0AEC0' },
  historyActions: { flexDirection: 'row', alignItems: 'center' },
  inputEdit: { borderBottomWidth: 2, borderBottomColor: '#2196F3', fontSize: 14, padding: 5, width: 80 },
  noDataText: { color: '#94A3B8', fontSize: 14, textAlign: 'center', marginVertical: 10 }
});