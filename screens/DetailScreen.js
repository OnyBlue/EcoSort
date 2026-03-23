import React, { useState, useEffect } from 'react'; // 1. Agregamos useState
import { View, Text, Button, StyleSheet, ActivityIndicator} from 'react-native';

import { TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';

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

  const { tipo, nivel, estado, capacidad, ultimaRecoleccion } = route.params;

  // Configuración de colores según el tipo de material
  const theme = {
    Plástico: { color: '#3B82F6', icon: '🥤' },
    Metal: { color: '#64748B', icon: '🥫' },
    Papel: { color: '#F59E0B', icon: '📄' },
  }[tipo] || { color: '#10B981', icon: '🗑️' };

  // Color de estado según el nivel
  const getStatusColor = (n) => (n >= 85 ? '#EF4444' : n >= 50 ? '#F59E0B' : '#10B981');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      {/* Header con el color del material */}
      <View style={[styles.header, { backgroundColor: theme.color }]}>
        <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>
          <Text style={styles.headerBackText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerIcon}>{theme.icon}</Text>
        <Text style={styles.headerTitle}>Contenedor de {tipo}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card Principal de Nivel */}
        <View style={styles.mainCard}>
          <Text style={styles.sectionLabel}>ESTADO DE LLENADO</Text>
          <View style={styles.levelRow}>
            <Text style={[styles.percentageText, { color: getStatusColor(nivel) }]}>{nivel}%</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(nivel) + '20' }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor(nivel) }]}>{estado.toUpperCase()}</Text>
            </View>
          </View>

          {/* Barra de progreso visual */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${nivel}%`, backgroundColor: getStatusColor(nivel) }]} />
          </View>
        </View>

        {/* Grid de Información Técnica */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Capacidad Máxima</Text>
            <Text style={styles.infoValue}>{capacidad}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Última Recolección</Text>
            <Text style={styles.infoValue}>{ultimaRecoleccion}</Text>
          </View>
        </View>

        {/* Sección de Recomendaciones */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Tip EcoSort</Text>
          <Text style={styles.tipText}>
            {nivel >= 85 
              ? `El contenedor de ${tipo.toLowerCase()} requiere recolección inmediata para evitar desbordamientos.`
              : `Aún hay espacio suficiente. Recuerda compactar bien los residuos de ${tipo.toLowerCase()}.`}
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
  },
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 40,
  },
  headerBack: { position: 'absolute', top: 50, left: 20 },
  headerBackText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  headerIcon: { fontSize: 60, marginBottom: 10 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },

  content: { padding: 20 },

  mainCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginTop: -40, // Efecto de solapamiento con el header
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 1 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  percentageText: { fontSize: 42, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold' },
  
  progressTrack: { height: 10, backgroundColor: '#E2E8F0', borderRadius: 5, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 5 },

  infoGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  infoItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  infoLabel: { fontSize: 11, color: '#64748B', marginBottom: 5, fontWeight: '600' },
  infoValue: { fontSize: 15, color: '#1E293B', fontWeight: 'bold' },

  tipCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#CBD5E0',
  },
  tipTitle: { fontWeight: 'bold', color: '#475569', marginBottom: 5 },
  tipText: { color: '#64748B', fontSize: 14, lineHeight: 20 },

  actionButton: {
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});