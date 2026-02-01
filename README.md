# 🧪 Cypress Testing: Dólar Blue vs Euro Blue

![Cypress](https://img.shields.io/badge/Cypress-15.9.0-17202C?style=for-the-badge&logo=cypress)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-24.13.0-339933?style=for-the-badge&logo=node.js&logoColor=white)

## 📋 Descripción

Sistema de testing automatizado E2E (End-to-End) desarrollado con Cypress para validar cotizaciones financieras en tiempo real. El proyecto compara las cotizaciones de **Dólar Blue** y **Euro Blue** en el sitio [dolarito.ar](https://www.dolarito.ar) y valida que la diferencia porcentual no supere un umbral definido.

## 🎯 Objetivo

Crear tests automatizados que:
- ✅ Extraigan valores reales de cotizaciones desde una página web
- ✅ Calculen diferencias porcentuales entre monedas
- ✅ Validen que las diferencias no superen umbrales establecidos
- ✅ Proporcionen mensajes de error claros y descriptivos
- ✅ Sean robustos ante cambios en la estructura del DOM

## 🚀 Características

### Funcionalidades Principales
- **Extracción dinámica de precios**: Usa selectores basados en texto visible (más estables que clases CSS)
- **Validación de umbrales**: Compara diferencias porcentuales con límites configurables
- **Función helper `limpiarPrecio()`**: Normaliza formatos monetarios ($1.234,56 → 1234.56)
- **Función helper `extraerPrecio()`**: Busca patrones de precios en contenedores HTML
- **Manejo de excepciones**: Ignora errores de aplicación que no afectan los tests
- **Logs descriptivos**: Muestra valores extraídos y cálculos realizados
- **Mensajes de error personalizados**: Facilita el debugging cuando fallan las validaciones

### Tests Implementados

#### 1️⃣ Test Principal: Diferencia no debe superar el 50%
```javascript
it('La diferencia no debe superar el 50%', () => {
  // Extrae Dólar Blue
  // Extrae Euro Blue
  // Valida que diferencia ≤ 50%
})
```

#### 2️⃣ Test de Validación: Diferencia no debe superar el 1%
```javascript
it('🧪 PRUEBA: La diferencia no debe superar el 1% (debería FALLAR)', () => {
  // Mismo proceso pero con umbral del 1%
  // Diseñado para fallar y demostrar que el sistema funciona
})
```

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Cypress** | 15.9.0 | Framework de testing E2E |
| **JavaScript** | ES6+ | Lenguaje de programación |
| **Node.js** | 24.13.0 | Entorno de ejecución |
| **npm** | - | Gestor de paquetes |
| **Git** | - | Control de versiones |

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ instalado
- npm instalado
- Git instalado

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/daifer-18/dolarito-tests.git
cd dolarito-tests
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Verificar instalación**
```bash
npx cypress verify
```

## 🎮 Uso

### Ejecutar tests en modo headless (terminal)
```bash
npx cypress run
```

### Ejecutar tests en modo interactivo (GUI)
```bash
npx cypress open
```

### Ejecutar un test específico
```bash
npx cypress run --spec cypress/e2e/dolarito.cy.js
```

### Ejecutar en diferentes navegadores
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

## 📊 Estructura del Proyecto

```
dolarito-tests/
├── cypress/
│   ├── e2e/
│   │   └── dolarito.cy.js       # Tests principales
│   ├── fixtures/
│   │   └── example.json         # Datos de prueba
│   ├── support/
│   │   ├── commands.js          # Comandos personalizados
│   │   └── e2e.js               # Configuración global
│   ├── screenshots/             # Screenshots de tests fallidos
│   └── videos/                  # Videos de ejecución (opcional)
├── node_modules/                # Dependencias
├── .gitignore                   # Archivos ignorados por Git
├── cypress.config.js            # Configuración de Cypress
├── package.json                 # Dependencias y scripts
├── package-lock.json            # Lock de dependencias
├── README.md                    # Este archivo
├── LINKEDIN_POST.txt            # Descripciones para LinkedIn
└── GITHUB_COMMANDS.txt          # Comandos Git útiles
```

## 💻 Código Destacado

### Función `limpiarPrecio()`
Convierte strings de precios en números:
```javascript
const limpiarPrecio = (texto) => {
    const limpio = texto.replace(/[^\d.,]/g, '')
    const numero = limpio.replace(/\./g, '').replace(',', '.')
    return Number(numero)
}
// "$1.470,50" → 1470.50
```

### Función `extraerPrecio()`
Busca precios en contenedores HTML:
```javascript
const extraerPrecio = ($container) => {
    const todosLosTextos = []
    $container.find('*').each((i, el) => {
        const texto = Cypress.$(el).text().trim()
        if (texto.length > 0 && texto.length < 15) {
            todosLosTextos.push(texto)
        }
    })
    const precios = todosLosTextos.filter(t => 
        /^\$?\s*\d{1,2}[.,]\d{3}/.test(t) || /^\d{3,4}$/.test(t)
    )
    return precios.length > 0 ? precios[0] : null
}
```

### Validación con mensaje personalizado
```javascript
expect(
    diferencia,
    'La diferencia entre el euro y el dólar supera el 50%'
).to.be.lte(0.5)
```

## 🧪 Estrategia de Testing

### Selección de Elementos
- **Evita selectores frágiles**: No usa clases CSS que pueden cambiar
- **Usa texto visible**: `cy.contains(/blue/i)` es más estable
- **Navegación del DOM**: `.closest()`, `.parent()`, `.find()`
- **Filtros personalizados**: Busca elementos específicos con jQuery

### Manejo de Asincronía
- **Aliases de Cypress**: `cy.wrap(valor).as('dolarBlue')`
- **Encadenamiento**: `cy.get('@dolarBlue').then((valor) => {...})`
- **Esperas explícitas**: `cy.wait(3000)` cuando es necesario

### Robustez
- **Manejo de excepciones**: `Cypress.on('uncaught:exception', () => false)`
- **Timeouts configurables**: `{ timeout: 30000 }`
- **Logs descriptivos**: `cy.log()` para debugging
- **Screenshots automáticos**: En caso de fallos

## 📈 Resultados Esperados

### Test 1: Margen del 50% ✅
```
💵 Dólar Blue: $1.470
💶 Euro Blue: $1.550
📊 Diferencia absoluta: $80.00
📈 Diferencia porcentual: 5.44%
✅ PASA - 5.44% ≤ 50%
```

### Test 2: Margen del 1% ❌
```
💵 Dólar Blue: $1.470
💶 Euro Blue: $1.550
📊 Diferencia absoluta: $80.00
📈 Diferencia porcentual: 5.44%
❌ FALLA - 5.44% > 1%
Error: 🧪 PRUEBA: La diferencia entre el euro y el dólar supera el 1%
```

## 🔧 Configuración

### cypress.config.js
```javascript
module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 10000
  }
})
```

## 🐛 Troubleshooting

### Problema: Timeout al cargar la página
**Solución**: Aumentar `pageLoadTimeout` en `cypress.config.js`

### Problema: No se encuentran elementos
**Solución**: Verificar que la página haya cargado completamente con `cy.wait()`

### Problema: Precios no se extraen correctamente
**Solución**: Revisar los logs con `cy.log()` y ajustar los regex en `extraerPrecio()`

## 📝 Buenas Prácticas Aplicadas

- ✅ **Código limpio y comentado**
- ✅ **Funciones reutilizables** (helpers)
- ✅ **Nombres descriptivos** de variables y funciones
- ✅ **Mensajes de error claros**
- ✅ **Logs para debugging**
- ✅ **Separación de concerns** (extracción vs validación)
- ✅ **Tests independientes** (cada test puede ejecutarse solo)
- ✅ **Commits semánticos** en Git
- ✅ **.gitignore configurado** correctamente

## 🚀 Mejoras Futuras

- [ ] Agregar más tests para diferentes pares de monedas
- [ ] Implementar Page Object Model (POM)
- [ ] Integrar con CI/CD (GitHub Actions)
- [ ] Generar reportes HTML (Mochawesome)
- [ ] Agregar tests de performance
- [ ] Implementar tests visuales (Percy, Applitools)
- [ ] Agregar cobertura de código
- [ ] Dockerizar el proyecto

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

**Daifer-18**
- GitHub: [@daifer-18](https://github.com/daifer-18)
- Proyecto: [dolarito-tests](https://github.com/daifer-18/dolarito-tests)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en abrir un issue en el repositorio.

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
