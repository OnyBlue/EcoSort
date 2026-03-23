import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MenuItem = ({ item, navigation }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.itemContainer}>
      
      <TouchableOpacity 
        style={styles.item}
        onPress={() => {
          if (item.children) {
            setOpen(!open);
          } else if (item.screen) {
            navigation.navigate(item.screen);
          }
        }}
      >
        <Text style={styles.itemText}>
          {item.children ? (open ? '▼ ' : '▶ ') : '• '}
          {item.label}
        </Text>
      </TouchableOpacity>

      {/* Recursividad */}
      {open && item.children && item.children.map((child, index) => (
        <MenuItem key={index} item={child} navigation={navigation} />
      ))}

    </View>
  );
};

export default function MenuDesplegable({ navigation }) {

  const menuData = [
    {
      label: "Inicio",
      screen: "Home"
    },
    {
      label: "Contenedores",
      children: [
        { label: "Plástico", screen: "Details" },
        { label: "Metal", screen: "Details" },
        { label: "Papel", screen: "Details" }
      ]
    },
    {
      label: "Reportes",
      children: [
        { label: "Historial", screen: "Details" },
        { label: "Estadísticas", screen: "Details" }
      ]
    }
  ];

  return (
    <View style={styles.menu}>
      {menuData.map((item, index) => (
        <MenuItem key={index} item={item} navigation={navigation} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    elevation: 3
  },
  itemContainer: {
    marginLeft: 10
  },
  item: {
    paddingVertical: 8
  },
  itemText: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500'
  }
});