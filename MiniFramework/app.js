// ============================================================
// CEREBRO LÓGICO Y CONTROL DE ESTADOS (app.js)
// ============================================================
import { MiniAppRegistry } from './MiniReactNative.js';
import * as UI from './components.js';

// Memoria de estado simulada idéntica a los valores iniciales de tu HomeScreen móvil
let estadoProyecto = {
  seleccionado: 'Plástico',
  botes: { 
    Plástico: 0, 
    Metal: 70, 
    Papel: 30 
  }
};

// Función cíclica encargada de gestionar los cambios de estado (Re-render reactivo)
function actualizarInterfaz() {
  const activo = estadoProyecto.seleccionado;
  const nivelActual = estadoProyecto.botes[activo];
  
  // Cálculo de alertas visuales cromáticas
  const obtenerColorNivel = (porcentaje) => {
    if (porcentaje >= 85) return '#EF4444'; // Alerta: Lleno
    if (porcentaje >= 50) return '#F59E0B'; // Advertencia: Medio
    return '#10B981'; // Sano: Disponible
  };

  // Botón Atómico 1: Aumentar Nivel (+10)
  const btnIncrementar = new UI.Button({
    title: "Aumentar",
    backgroundColor: '#2196F3',
    onPress: () => {
      estadoProyecto.botes[activo] = Math.min(100, estadoProyecto.botes[activo] + 10);
      actualizarInterfaz(); // Forzar actualización del árbol en el Framework
    }
  });

  // Botón Atómico 2: Reiniciar Nivel (0)
  const btnResetear = new UI.Button({
    title: "Reiniciar",
    backgroundColor: '#E2E8F0', 
    onPress: () => {
      estadoProyecto.botes[activo] = 0;
      actualizarInterfaz(); // Forzar actualización
    }
  });

  // Botón Atómico 3: APIs (Botón Morado)
  const btnApisMovi = new UI.Button({
    title: "🚀 APIs",
    backgroundColor: '#500b7e',
    onPress: () => alert("Framework: Redireccionando a capa de integración de APIs externas...")
  });

  // Montaje del árbol estructural combinando componentes sencillos y complejos
  const UIApp = new UI.View({
    className: "app-wrapper",
    children: [
      new UI.StatusBar({ backgroundColor: '#FFF' }),
      new UI.HeaderApp({ title: "🌱 EcoSort App", tagline: "Gestión de residuo inteligente" }),
      
      // Panel de mando con el porcentaje y los 3 botones mapeados
      new UI.ControlPanel({
        seleccionado: activo,
        nivel: nivelActual,
        color: obtenerColorNivel(nivelActual),
        btnAumentar: btnIncrementar,
        btnReiniciar: btnResetear,
        btnApis: btnApisMovi
      }),

      // Tarjetas dinámicas reactivas al click del Framework
      new UI.ContainerCard({
        tipo: "Plástico", icon: "🥤", nivel: estadoProyecto.botes.Plástico, color: obtenerColorNivel(estadoProyecto.botes.Plástico),
        esActivo: activo === 'Plástico', onClick: () => { estadoProyecto.seleccionado = 'Plástico'; actualizarInterfaz(); }
      }),
      new UI.ContainerCard({
        tipo: "Metal", icon: "🥫", nivel: estadoProyecto.botes.Metal, color: obtenerColorNivel(estadoProyecto.botes.Metal),
        esActivo: activo === 'Metal', onClick: () => { estadoProyecto.seleccionado = 'Metal'; actualizarInterfaz(); }
      }),
      new UI.ContainerCard({
        tipo: "Papel", icon: "📄", nivel: estadoProyecto.botes.Papel, color: obtenerColorNivel(estadoProyecto.botes.Papel),
        esActivo: activo === 'Papel', onClick: () => { estadoProyecto.seleccionado = 'Papel'; actualizarInterfaz(); }
      }),

      // Componente Complejo del Formulario de Registro Especial Manual
      new UI.ManualForm({}),
      
      // Bloque del Historial de datos leídos en la simulación del CRUD
      new UI.View({
        className: "history-block",
        children: [
          new UI.Divider({}),
          new UI.HistoryItem({ contenedor: "Plástico", nivel: 40, tipo_accion: "Aumento de nivel", fecha: "28/4/2026, 5:21:35 p.m." }),
          new UI.HistoryItem({ contenedor: "Plástico", nivel: 30, tipo_accion: "Aumento de nivel", fecha: "28/4/2026, 5:21:35 p.m." }),
          new UI.HistoryItem({ contenedor: "Metal", nivel: 10, tipo_accion: "Aumento de nivel", fecha: "14/4/2026, 10:23:31 p.m." })
        ]
      })
    ]
  });

  // Ejecución del renderizado final del motor web
  MiniAppRegistry.render('root-celular', UIApp);
}

// Inicialización de la vista reactiva
actualizarInterfaz();