import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { initDatabase, registrarUsuario, loginUsuario } from '../Database/database';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Inicializar DB al cargar el componente
  useEffect(() => {
    initDatabase(); 
  }, []);

  // Función para validar que los campos no estén vacíos
  const validarCampos = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos requeridos", "Por favor, completa todos los campos.");
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validarCampos()) return; // Detiene la ejecución si los campos están vacíos

    loginUsuario(email, password, (res) => {
      if (res.success) {
        console.log("Login exitoso");
        // Limpiar campos antes de navegar
        setEmail('');
        setPassword('');
        navigation.replace('Home'); 
      } else {
        // SQLite no encontró coincidencia entre email y password
        Alert.alert("Error de Acceso", "El correo o la contraseña son incorrectos.");
      }
    });
  };

  const handleRegister = () => {
    if (!validarCampos()) return;

    registrarUsuario(email, password, (res) => {
      if (res.success) {
        Alert.alert("Éxito", "Usuario registrado correctamente. Ahora puedes iniciar sesión.");
        // Limpiar password por seguridad tras registro
        setPassword('');
      } else {
        Alert.alert("Error", res.error || "Este correo ya está registrado.");
      }
    });
  };

  return (
    // KeyboardAvoidingView evita que el teclado cubra los inputs en iOS/Android
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.logo}>🌱 EcoSort</Text>
        <Text style={styles.subtitle}>Gestión de Residuos</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput 
            style={styles.input} 
            placeholder="ejemplo@correo.com" 
            value={email}
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={styles.input} 
            placeholder="********" 
            secureTextEntry 
            value={password}
            onChangeText={setPassword} 
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar al Panel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={handleRegister}>
          <Text style={styles.linkText}>
            ¿Eres nuevo? <Text style={styles.linkHighlight}>Regístrate aquí</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center', 
    padding: 30,
  },
  logo: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#10B981',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4
  },
  input: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    fontSize: 16,
    color: '#1E293B'
  },
  button: { 
    backgroundColor: '#10B981', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  buttonText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  registerLink: { 
    marginTop: 25, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#64748B',
    fontSize: 14
  },
  linkHighlight: {
    color: '#10B981',
    fontWeight: 'bold'
  }
});