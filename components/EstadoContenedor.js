import React, { useState } from "react";
import { View, Text, Button } from "react-native";

const EstadoContenedor = () => {
  const [nivel, setNivel] = useState(30);
  const [tipo, setTipo] = useState("Plástico");

  const actualizarDatos = () => {
    const niveles = [20, 50, 80, 100];
    const tipos = ["Plástico", "Papel", "Metal"];

    const nuevoNivel = niveles[Math.floor(Math.random() * niveles.length)];
    const nuevoTipo = tipos[Math.floor(Math.random() * tipos.length)];

    setNivel(nuevoNivel);
    setTipo(nuevoTipo);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Tipo detectado: {tipo}</Text>
      <Text>Nivel del contenedor: {nivel}%</Text>

      <Button title="Actualizar datos" onPress={actualizarDatos} />
    </View>
  );
};

export default EstadoContenedor;