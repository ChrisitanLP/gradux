# ⚡ Sistema de Gestión Académica - Argon Dashboard React

Sistema integral para la gestión académica de instituciones educativas, basado en una plantilla moderna de panel administrativo construida con React y respaldado por un backend en Node.js/Express. El sistema permite el manejo de usuarios, estudiantes, informes, actividades y control de acceso con roles, todo sobre una base de datos MySQL.

---

## 📋 Tabla de Contenidos
- [⚡ Sistema de Gestión Académica - Argon Dashboard React](#-sistema-de-gestión-académica---argon-dashboard-react)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [✨ Características Principales](#-características-principales)
  - [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
  - [📁 Estructura del Proyecto](#-estructura-del-proyecto)
    - [📂 Descripción detallada de módulos](#-descripción-detallada-de-módulos)
  - [🛠️ Requisitos Previos](#️-requisitos-previos)
  - [📦 Instalación](#-instalación)
    - [1. Clonar el repositorio](#1-clonar-el-repositorio)
    - [2. Instalar dependencias](#2-instalar-dependencias)
    - [3. Crear estructura de directorios adicional](#3-crear-estructura-de-directorios-adicional)
    - [4. Configurar la base de datos](#4-configurar-la-base-de-datos)
  - [⚙️ Configuración](#️-configuración)
    - [Archivo `.env`](#archivo-env)
    - [Archivo `.npmrc`](#archivo-npmrc)
    - [Configuración de Base de Datos](#configuración-de-base-de-datos)
  - [🚀 Uso](#-uso)
    - [Ejecutar el Frontend](#ejecutar-el-frontend)
    - [Ejecutar el Backend](#ejecutar-el-backend)
    - [Modo de Desarrollo con Debug](#modo-de-desarrollo-con-debug)
  - [🔧 Sistema Backend](#-sistema-backend)
    - [Funcionalidades Principales](#funcionalidades-principales)
    - [Seguridad Implementada](#seguridad-implementada)
    - [Estructura de Base de Datos](#estructura-de-base-de-datos)
  - [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Herramientas de Desarrollo](#herramientas-de-desarrollo)
  - [🎨 Personalización](#-personalización)
    - [Modificar Estilos](#modificar-estilos)
    - [Agregar Nuevos Componentes](#agregar-nuevos-componentes)
    - [Configurar Nuevas Rutas API](#configurar-nuevas-rutas-api)
  - [🐛 Solución de Problemas](#-solución-de-problemas)
    - [Error de Autenticación](#error-de-autenticación)
    - [Error de Conexión a Base de Datos](#error-de-conexión-a-base-de-datos)
    - [Problemas de Compilación React](#problemas-de-compilación-react)
    - [Conflictos de Dependencias](#conflictos-de-dependencias)
  - [📊 Registro de Logs](#-registro-de-logs)
  - [🚧 Limitaciones Conocidas](#-limitaciones-conocidas)
  - [🔄 Próximas Funcionalidades](#-próximas-funcionalidades)
  - [🤝 Contribución](#-contribución)
    - [Reportar Issues](#reportar-issues)
  - [📄 Licencia](#-licencia)

---

## ✨ Características Principales

- **Panel Administrativo Moderno**: Interfaz React basada en Argon Dashboard con diseño responsive
- **API REST Completa**: Sistema de autenticación y gestión integral de datos académicos
- **Control de Acceso por Roles**: Sistema de permisos basado en roles de usuario
- **Gestión de Estudiantes**: Seguimiento de estudiantes, tesis y asignación de tutores
- **Sistema de Informes**: Generación y gestión de informes académicos (Anexo 5, Anexo 11)
- **Métricas Académicas**: Estadísticas de estudiantes activos, graduados e informes por tutor
- **Seguridad Avanzada**: Hash de contraseñas, bloqueo de cuentas y control de sesiones
- **Base de Datos MySQL**: Integración robusta con Sequelize ORM

---

## 🏗️ Arquitectura del Sistema

El sistema utiliza una arquitectura de tres capas que proporciona separación clara entre la presentación, lógica de negocio y persistencia de datos:

```
┌─────────────────────────────────────────┐
│           Frontend Layer                │
│     React + Argon Dashboard             │
│   (Componentes, Layouts, Views)         │
└─────────────┬───────────────────────────┘
              │ API REST
┌─────────────▼───────────────────────────┐
│           Backend Layer                 │
│      Express.js + Middlewares           │
│  (Controladores, Autenticación, APIs)   │
└─────────────┬───────────────────────────┘
              │ MySQL Queries
┌─────────────▼───────────────────────────┐
│          Database Layer                 │
│           MySQL + Sequelize             │
│   (usuarios, estudiantes, informes)     │
└─────────────────────────────────────────┘
```
---

## 📁 Estructura del Proyecto

```
gradux/
├── .github/                      # Configuración de GitHub Actions
│   └── workflows/               # Flujos de trabajo automatizados
├── backend/                     # Lógica del servidor
│   ├── config/                 # Configuración de base de datos
│   │   └── db.js              # Conexión MySQL
│   ├── controllers/           # Controladores de API
│   │   └── authController.js  # Lógica de autenticación y CRUD
│   ├── middlewares/          # Middlewares de seguridad
│   │   └── authMiddleware.js # Control de acceso y roles
│   ├── models/              # Modelos de datos Sequelize
│   └── routes/             # Definición de rutas API
├── Documentation/             # Documentación del proyecto
├── public/                   # Archivos públicos estáticos
├── src/                     # Código fuente frontend
│   ├── api/                # Servicios de API
│   ├── assets/            # Recursos estáticos
│   │   ├── css/          # Hojas de estilo compiladas
│   │   ├── fonts/        # Fuentes tipográficas
│   │   ├── img/          # Imágenes y recursos gráficos
│   │   │   ├── brand/    # Logos e identidad visual
│   │   │   ├── icons/    # Iconografía del sistema
│   │   │   └── theme/    # Imágenes temáticas
│   │   ├── plugins/      # Plugins y librerías externas
│   │   │   └── nucleo/   # Biblioteca de iconos Nucleo
│   │   └── scss/         # Código fuente SASS/SCSS
│   │       ├── argon-dashboard/ # Estilos del dashboard
│   │       │   ├── custom/      # Componentes personalizados
│   │       │   └── docs/        # Documentación de estilos
│   │       └── react/           # Estilos específicos de React
│   ├── components/        # Componentes reutilizables
│   │   ├── Footers/      # Componentes de pie de página
│   │   ├── Headers/      # Componentes de encabezado
│   │   ├── modals/       # Ventanas modales
│   │   ├── Navbars/      # Barras de navegación
│   │   ├── PDF/          # Generación de documentos PDF
│   │   ├── Sidebar/      # Barra lateral de navegación
│   │   └── tables/       # Componentes de tablas
│   ├── context/          # Context API de React
│   ├── layouts/          # Layouts principales
│   ├── variables/        # Variables globales
│   └── views/            # Páginas y vistas
│       └── examples/     # Páginas de ejemplo
├── package.json          # Dependencias y scripts
├── .env                 # Variables de entorno
├── .npmrc              # Configuración de npm
└── README.md           # Documentación principal
```

### 📂 Descripción detallada de módulos

| 📁 Carpeta / Archivo                | 📌 Descripción                                                                                       |
|------------------------------------|------------------------------------------------------------------------------------------------------|
| `.github/workflows/`              | Configuración de GitHub Actions para flujos CI/CD automatizados.                                   |
| `backend/`                         | Lógica del servidor y API backend.                                                                  |
| ├── `config/db.js`                | Configuración de conexión a base de datos MySQL mediante Sequelize.                                 |
| ├── `controllers/`                | Lógica de negocio y controladores de rutas API.                                                     |
| ├── `middlewares/`                | Middlewares de seguridad, autenticación y control de roles.                                         |
| ├── `models/`                     | Modelos de datos Sequelize para entidades del sistema.                                              |
| └── `routes/`                     | Definición de rutas del backend y asignación de controladores.                                      |
| `Documentation/`                  | Documentación técnica del proyecto, manuales o referencias.                                         |
| `public/`                         | Archivos públicos accesibles por el navegador (favicon, manifest, etc.).                            |
| `src/`                             | Código fuente del frontend (React + SCSS).                                                          |
| ├── `api/`                        | Servicios para interactuar con la API del backend.                                                  |
| ├── `assets/`                     | Recursos estáticos del frontend.                                                                    |
| │ ├── `css/`                      | Hojas de estilo compiladas (CSS final).                                                             |
| │ ├── `fonts/`                    | Fuentes tipográficas utilizadas en el diseño.                                                       |
| │ ├── `img/`                      | Imágenes y recursos gráficos.                                                                       |
| │ │ ├── `brand/`                 | Logos y elementos de identidad visual.                                                              |
| │ │ ├── `icons/`                 | Iconografía general del sistema.                                                                    |
| │ │ └── `theme/`                 | Imágenes temáticas decorativas.                                                                     |
| │ ├── `plugins/`                  | Librerías externas (como Nucleo Icons).                                                             |
| │ └── `scss/`                     | Código fuente de estilos SCSS.                                                                      |
| │   ├── `argon-dashboard/`       | Estilos base del dashboard Argon.                                                                   |
| │   │ ├── `custom/`              | Estilos personalizados del proyecto.                                                                |
| │   │ └── `docs/`                | Documentación interna del sistema de estilos.                                                       |
| │   └── `react/`                 | Estilos específicos para componentes React.                                                         |
| ├── `components/`                 | Componentes UI reutilizables del frontend.                                                          |
| │ ├── `Footers/`                 | Pies de página.                                                                                      |
| │ ├── `Headers/`                 | Encabezados superiores.                                                                             |
| │ ├── `modals/`                  | Ventanas emergentes (modales).                                                                      |
| │ ├── `Navbars/`                 | Barras de navegación principal.                                                                     |
| │ ├── `PDF/`                     | Componentes de generación y visualización de PDFs.                                                  |
| │ ├── `Sidebar/`                 | Barra lateral de navegación.                                                                        |
| │ └── `tables/`                  | Componentes para visualización de tablas.                                                           |
| ├── `context/`                    | Context API de React para manejo de estado global.                                                  |
| ├── `layouts/`                    | Estructuras de diseño general para páginas.                                                         |
| ├── `variables/`                  | Variables globales (temas, colores, constantes).                                                    |
| └── `views/`                      | Vistas o páginas completas.                                                                         |
| └── `examples/`                   | Páginas de ejemplo para referencia o pruebas.                                                       |
| `.env`                            | Variables de entorno para configuración local o despliegue.                                         |
| `.npmrc`                          | Configuración de comportamiento del gestor de paquetes npm.                                         |
| `package.json`                    | Lista de dependencias, scripts y configuración general del proyecto.                               |
| `README.md`                       | Documentación principal del proyecto.                                                               |

> 📝 **Nota:** Esta tabla describe de forma general cada módulo/carpeta. Algunas carpetas como `controllers/`, `routes/` o `components/` pueden contener múltiples archivos especializados según el alcance del proyecto.


---

## 🛠️ Requisitos Previos

- **Node.js** >= 14.x
- **MySQL Server** >= 5.7
- **npm** o **yarn**
- **Git** (opcional para clonar)

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/gradux.git
cd gradux
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear estructura de directorios adicional

```bash
mkdir -p input output logs
```

### 4. Configurar la base de datos

```sql
CREATE DATABASE agiles;
```

> ℹ️ **Nota:** *Las tablas se generan automáticamente con Sequelize al ejecutar el backend.*

---

## ⚙️ Configuración

### Archivo `.env`

```env
GENERATE_SOURCEMAP=false
```

### Archivo `.npmrc`

```ini
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false
```

### Configuración de Base de Datos

Editar `backend/config/db.js`:

```javascript
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu_password',
  database: 'agiles'
});
```

---

## 🚀 Uso

### Ejecutar el Frontend

```bash
npm start
```

La aplicación React estará disponible en `http://localhost:3000`

### Ejecutar el Backend

```bash
node backend/index.js
```

La API estará disponible en `http://localhost:5000`

### Modo de Desarrollo con Debug

```bash
node backend/index.js --debug
```

---

## 🔧 Sistema Backend

### Funcionalidades Principales

| Módulo | Funciones | Descripción |
|--------|-----------|-------------|
| **Autenticación** | `login()`, `createUser()` | Gestión de usuarios y sesiones |
| **Estudiantes** | `createStudent()`, `getAllStudents()` | Administración de estudiantes |
| **Informes** | `createInforme()`, `getInformesByTutor()` | Gestión de informes académicos |
| **Actividades** | `createActivity()`, `updateActivityById()` | Seguimiento de actividades |
| **Estadísticas** | `getEstudiantesCount()`, `getGraduadosCount()` | Métricas del dashboard |

### Seguridad Implementada

- **Hash de Contraseñas**: Utilizando bcrypt con 10 rondas de sal
- **Bloqueo de Cuentas**: Bloqueo automático después de 3 intentos fallidos
- **Control de Sesiones**: Gestión segura con express-session
- **Middleware de Autenticación**: Verificación de roles y permisos

### Estructura de Base de Datos

```sql
-- Tablas principales
usuarios      -- Gestión de usuarios del sistema
estudiantes   -- Información de estudiantes
informes      -- Informes académicos (Anexo 5, Anexo 11)
actividades   -- Actividades asociadas a informes
carreras      -- Programas académicos
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React** 18.x
- **Argon Dashboard** (Creative Tim)
- **Bootstrap** 4.6.0
- **Chart.js** - Visualización de datos
- **FontAwesome** - Iconografía
- **SASS/SCSS** - Preprocesador CSS

### Backend
- **Node.js** + **Express.js**
- **MySQL** + **Sequelize ORM**
- **bcrypt** - Seguridad de contraseñas
- **express-session** - Gestión de sesiones

### Herramientas de Desarrollo
- **Create React App** - Configuración base
- **GitHub Actions** - CI/CD
- **ESLint** - Linting de código

---

## 🎨 Personalización

### Modificar Estilos

Los estilos se encuentran en `src/assets/scss/argon-dashboard/`:

```scss
// Personalizar colores principales
$primary-color: #5e72e4;
$secondary-color: #f4f5f7;

// Modificar componentes específicos
@import './custom/buttons';
@import './custom/cards';
```

### Agregar Nuevos Componentes

1. Crear componente en `src/components/`
2. Agregar ruta en `src/layouts/`
3. Configurar API en `backend/controllers/`

### Configurar Nuevas Rutas API

```javascript
// backend/controllers/authController.js
exports.nuevaFuncion = async (req, res) => {
  try {
    // Lógica de negocio
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 🐛 Solución de Problemas

### Error de Autenticación

```bash
# Verificar configuración de base de datos
node backend/config/db.js

# Revisar logs de autenticación
tail -f logs/ejecucion_$(date +%Y-%m-%d).log
```

### Error de Conexión a Base de Datos

1. Verificar que MySQL esté ejecutándose
2. Comprobar credenciales en `backend/config/db.js`
3. Verificar que la base de datos `agiles` exista

### Problemas de Compilación React

```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar configuración
echo "GENERATE_SOURCEMAP=false" > .env
```

### Conflictos de Dependencias

```bash
# Usar configuración legacy
npm install --legacy-peer-deps

# O configurar .npmrc
echo "legacy-peer-deps=true" >> .npmrc
```

---

## 📊 Registro de Logs

El sistema genera logs automáticos en:

```
./logs/
└── ejecucion_2025-06-22.log
```

Los logs incluyen:
- Eventos de autenticación
- Operaciones de base de datos
- Errores del sistema
- Actividad de usuarios

---

## 🚧 Limitaciones Conocidas

- Requiere configuración manual inicial de la base de datos
- No incluye sistema de notificaciones por correo
- Falta implementación de pruebas unitarias automatizadas
- Sin soporte para múltiples idiomas

## 🔄 Próximas Funcionalidades

- [ ] Sistema de notificaciones
- [ ] Exportación de reportes en múltiples formatos
- [ ] Dashboard de métricas avanzadas
- [ ] Integración con sistemas de correo
- [ ] API REST documentada con Swagger

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el proyecto
2. Crea tu **feature branch** (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

### Reportar Issues

- Usa el template de issues de GitHub
- Incluye pasos para reproducir el problema
- Especifica versión del navegador y Node.js

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT** © Creative Tim 2021.

```
MIT License

Copyright (c) 2021 Creative Tim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

Ver el archivo [LICENSE](./LICENSE) para más detalles.

---


**Desarrollado como una solución integral para la gestión académica en instituciones educativas, combinando una interfaz moderna en React, un backend robusto en Node.js/Express y una arquitectura orientada a roles sobre MySQL.** 🎓🖥️

<div align="center">

**[⬆ Volver al inicio](#-sistema-de-gestión-académica---argon-dashboard-react)**

</div>
