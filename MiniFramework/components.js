// ============================================================
// FÁBRICA DE COMPONENTES DEL FRAMEWORK (components.js)
// ============================================================
import { Component } from './MiniReactNative.js';

// ------------------------------------------------------------
// SECCIÓN A: 5 COMPONENTES COMPLEJOS (Múltiples elementos del DOM)
// ------------------------------------------------------------

// 1. ContainerCard: Tarjeta informativa con barra de estado e iconos de residuos
export class ContainerCard extends Component {
  render() {
    const card = document.createElement('div');
    card.className = `card ${this.props.esActivo ? 'card-active' : ''}`;

    // Barrita de color dinámica lateral (Verde, Naranja, Rojo)
    const indicator = document.createElement('div');
    indicator.className = 'status-indicator';
    indicator.style.backgroundColor = this.props.color;

    const content = document.createElement('div');
    content.className = 'card-content';

    const icon = document.createElement('span');
    icon.className = 'card-icon';
    icon.innerText = this.props.icon;

    const texts = document.createElement('div');
    texts.className = 'cardTextContainer';
    const title = document.createElement('h3');
    title.innerText = `Contenedor ${this.props.tipo}`;
    const subtitle = document.createElement('p');
    subtitle.innerText = `Nivel: ${this.props.nivel}%`;

    texts.appendChild(title);
    texts.appendChild(subtitle);
    content.appendChild(icon);
    content.appendChild(texts);
    card.appendChild(indicator);
    card.appendChild(content);

    if (this.props.onClick) card.onclick = this.props.onClick;
    return card;
  }
}

// 2. ControlPanel: Panel de mandos superior con el porcentaje y 3 botones reales (Aumentar, Reiniciar, APIs)
export class ControlPanel extends Component {
  render() {
    const panel = document.createElement('section');
    panel.className = 'control-panel';

    const label = document.createElement('span');
    label.className = 'control-label';
    label.innerHTML = `Ajustando: <strong>${this.props.seleccionado}</strong>`;

    const displayPercent = document.createElement('h1');
    displayPercent.className = 'numero-grande';
    displayPercent.style.color = this.props.color;
    displayPercent.innerText = `${this.props.nivel}%`;

    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';
    
    // Inyección de los 3 botones interactivos de tu app móvil
    buttonRow.appendChild(this.props.btnAumentar.render());
    buttonRow.appendChild(this.props.btnReiniciar.render());
    buttonRow.appendChild(this.props.btnApis.render());

    panel.appendChild(label);
    panel.appendChild(displayPercent);
    panel.appendChild(buttonRow);
    return panel;
  }
}

// 3. ManualForm: Apartado de "Registro Especial" (Sección Create Manual)
export class ManualForm extends Component {
  render() {
    const formContainer = document.createElement('div');
    formContainer.className = 'control-panel'; 
    formContainer.style.textAlign = 'left';

    const title = document.createElement('h3');
    title.innerText = "Registro Especial";
    title.style.margin = "0 0 12px 0";

    const row = document.createElement('div');
    row.className = 'button-row';

    const inputResiduo = document.createElement('input');
    inputResiduo.type = 'text';
    inputResiduo.placeholder = '¿Qué residuo es?';
    inputResiduo.className = 'input-crud'; 
    inputResiduo.style.flex = '2';

    const inputNivel = document.createElement('input');
    inputNivel.type = 'number';
    inputNivel.placeholder = 'Nivel %';
    inputNivel.className = 'input-crud'; 
    inputNivel.style.flex = '1';

    const btnAñadir = document.createElement('button');
    btnAñadir.className = 'main-button';
    btnAñadir.style.backgroundColor = '#10B981'; 
    btnAñadir.style.flex = '1'; 
    btnAñadir.innerText = 'Añadir';

    row.appendChild(inputResiduo);
    row.appendChild(inputNivel);
    row.appendChild(btnAñadir);
    
    formContainer.appendChild(title);
    formContainer.appendChild(row);
    return formContainer;
  }
}

// 4. HistoryItem: Renglón del Historial de reportes con acciones CRUD (✏️ y 🗑️)
export class HistoryItem extends Component {
  render() {
    const container = document.createElement('div');
    container.className = 'card';
    container.style.justifyContent = 'space-between';

    const infoDiv = document.createElement('div');
    
    const tag = document.createElement('b');
    tag.innerText = this.props.contenedor;
    tag.style.color = '#2196F3';

    const dataParagraph = document.createElement('p');
    dataParagraph.innerText = `${this.props.nivel}% - ${this.props.tipo_accion}`;
    dataParagraph.style.margin = '4px 0';
    dataParagraph.style.fontSize = '14px';

    const dateSpan = document.createElement('span');
    dateSpan.innerText = this.props.fecha;
    dateSpan.style.fontSize = '11px';
    dateSpan.style.color = '#A0AEC0';

    infoDiv.appendChild(tag);
    infoDiv.appendChild(dataParagraph);
    infoDiv.appendChild(dateSpan);

    // Contenedor de acciones (Update / Delete)
    const actionsDiv = document.createElement('div');
    actionsDiv.style.display = 'flex';
    actionsDiv.style.gap = '15px';
    actionsDiv.style.fontSize = '18px';

    const btnEdit = document.createElement('span');
    btnEdit.innerText = '✏️';
    btnEdit.style.cursor = 'pointer';
    
    const btnDelete = document.createElement('span');
    btnDelete.innerText = '🗑️';
    btnDelete.style.cursor = 'pointer';

    actionsDiv.appendChild(btnEdit);
    actionsDiv.appendChild(btnDelete);

    container.appendChild(infoDiv);
    container.appendChild(actionsDiv);
    return container;
  }
}

// 5. HeaderApp: Encabezado superior con título de app y botón de Salir
export class HeaderApp extends Component {
  render() {
    const header = document.createElement('header');
    header.className = 'app-header';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.width = '100%';

    const leftContainer = document.createElement('div');
    const title = document.createElement('h2');
    title.innerText = this.props.title;
    title.style.margin = '0';
    const tagline = document.createElement('p');
    tagline.innerText = this.props.tagline;
    tagline.style.margin = '2px 0 0 0';

    leftContainer.appendChild(title);
    leftContainer.appendChild(tagline);

    const logoutBtn = document.createElement('button');
    logoutBtn.innerText = 'Salir';
    logoutBtn.style.backgroundColor = '#FFE2E2';
    logoutBtn.style.color = '#EF4444';
    logoutBtn.style.border = 'none';
    logoutBtn.style.padding = '8px 15px';
    logoutBtn.style.borderRadius = '10px';
    logoutBtn.style.fontWeight = 'bold';
    logoutBtn.style.cursor = 'pointer';

    header.appendChild(leftContainer);
    header.appendChild(logoutBtn);
    return header;
  }
}

// ------------------------------------------------------------
// SECCIÓN B: 5 COMPONENTES ATÓMICOS O SENCILLOS (Una sola etiqueta principal)
// ------------------------------------------------------------

// 6. View: Contenedor estructural polivalente (Equivalente a <View>)
export class View extends Component {
  render() {
    const div = document.createElement('div');
    div.className = this.props.className || '';
    if (this.props.children) {
      this.props.children.forEach(child => div.appendChild(child.render()));
    }
    return div;
  }
}

// 7. Text: Renderizador básico de texto plano (Equivalente a <Text>)
export class Text extends Component {
  render() {
    const span = document.createElement('span');
    span.style.fontWeight = this.props.fontWeight || 'normal';
    span.style.fontSize = this.props.fontSize || '14px';
    span.style.color = this.props.color || '#333';
    span.innerText = this.props.children;
    return span;
  }
}

// 8. Button: Control interactivo customizable (Equivalente a <Button>)
export class Button extends Component {
  render() {
    const button = document.createElement('button');
    button.className = 'main-button';
    button.style.backgroundColor = this.props.backgroundColor || '#2196F3';
    button.innerText = this.props.title;
    if (this.props.onPress) button.onclick = this.props.onPress;
    return button;
  }
}

// 9. StatusBar: Div estético superior que emula la barra del sistema móvil
export class StatusBar extends Component {
  render() {
    const bar = document.createElement('div');
    bar.className = 'status-bar';
    bar.style.backgroundColor = this.props.backgroundColor || '#FFF';
    return bar;
  }
}

// 10. Divider: Elemento divisorio estético de tipo horizontal
export class Divider extends Component {
  render() {
    const hr = document.createElement('hr');
    hr.className = 'divider';
    return hr;
  }
}