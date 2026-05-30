// ============================================================
// ARQUITECTURA GENERAL DEL FRAMEWORK (MiniReactNative.js)
// ============================================================

// Clase base abstracta de la cual heredarán todos nuestros componentes.
export class Component {
  constructor(props = {}) {
    this.props = props; // Almacena las propiedades o datos dinámicos del componente
  }

  // Método abstracto obligatorio. Si el hijo no lo implementa, arroja un error.
  render() {
    throw new Error("El método render() debe ser implementado por el componente hijo.");
  }
}

// Inyector central encargado de montar el árbol de componentes en el DOM de HTML
export const MiniAppRegistry = {
  render(elementId, rootComponent) {
    // Localiza el contenedor por su ID en el HTML
    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = ""; // Limpia la pantalla para evitar duplicados al actualizar el estado
      container.appendChild(rootComponent.render()); // Transforma e inyecta el componente en HTML
    }
  }
};