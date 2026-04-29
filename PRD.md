# Documento de Requerimientos de Producto (PRD)
## Bitácora CEA

**Versión:** 1.0  
**Estado:** Borrador  
**Repositorio:** `next-bitacora-cea`

---

## 1. Resumen Ejecutivo

**Bitácora CEA** es una aplicación web interna para gestionar y dar seguimiento a temas de trabajo dentro de la organización. Permite registrar temas por departamento, asignar responsables y visualizadores, y llevar un historial de avances con evidencias adjuntas. El objetivo es centralizar la trazabilidad de compromisos y acuerdos institucionales, eliminando el seguimiento manual por correo o hojas de cálculo.

---

## 2. Problema que Resuelve

Las organizaciones con múltiples departamentos enfrentan dificultad para dar seguimiento a temas abiertos, compromisos y avances. Actualmente, estos registros se manejan de forma dispersa (correo electrónico, Excel, reuniones verbales), lo que genera:

- Falta de visibilidad del estado de los temas.
- Pérdida de historial de avances.
- Sin rendición de cuentas por usuario o departamento.
- Incumplimiento de fechas límite no detectado a tiempo.

**Bitácora CEA** centraliza este proceso en una sola plataforma con roles diferenciados.

---

## 3. Usuarios Objetivo

| Rol | Descripción | Acceso |
|---|---|---|
| **Administrador** | Gestiona toda la plataforma: temas, usuarios, asignaciones | Acceso total |
| **Responsable** | Empleado con responsabilidad sobre uno o más temas | Gestión de temas de su departamento, captura de avances |
| **Visualizador** | Empleado asignado a un tema para consulta | Solo lectura de temas asignados y sus bitácoras |

---

## 4. Alcance del Producto

### 4.1 Incluido en el alcance

- Autenticación con credenciales corporativas (usuario / contraseña).
- Dashboard con indicadores de estado de temas.
- Gestión completa de temas (CRUD) por departamento.
- Registro de avances en bitácora por tema.
- Carga de archivos adjuntos como evidencias.
- Asignación de usuarios (Responsable / Visualizador) a temas.
- Control de acceso basado en roles (RBAC).
- Vista personalizada de temas asignados por usuario ("Mis Temas").
- Listado de usuarios del sistema.
- Alertas visuales por fechas límite vencidas o próximas a vencer.

### 4.2 Fuera del alcance (versión 1.0)

- Notificaciones automáticas por correo electrónico.
- Reportes exportables (PDF / Excel).
- Gestión de departamentos desde la interfaz.
- Creación y edición de usuarios desde la interfaz.
- Histórico de cambios de estado por tema (auditoría).
- Integración con sistemas externos distintos a la API CEA.

---

## 5. Requerimientos Funcionales

### 5.1 Autenticación y Sesión

| ID | Requerimiento |
|---|---|
| RF-01 | El sistema debe autenticar al usuario mediante usuario y contraseña contra la API CEA. |
| RF-02 | La sesión debe persistir hasta 12 horas mediante JWT con cookie HttpOnly. |
| RF-03 | Cualquier ruta dentro de `/bitacora/*` debe requerir sesión activa. |
| RF-04 | Al cerrar sesión, la cookie debe invalidarse y redirigir al login. |
| RF-05 | Si el usuario no tiene sesión, debe redirigirse al login conservando la URL de retorno. |

### 5.2 Dashboard

| ID | Requerimiento |
|---|---|
| RF-06 | Mostrar tarjetas de resumen con conteo de temas por estado: Total, Pendiente, Activo, Pausado, Completado. |
| RF-07 | Mostrar los 10 temas más recientes con título, departamento, estado, conteo de avances y fecha límite. |
| RF-08 | Indicar visualmente si un tema está vencido (fecha límite pasada) o próximo a vencer (menos de 7 días). |
| RF-09 | El Responsable debe ver los temas de su departamento más los que le fueron asignados directamente. |
| RF-10 | El Visualizador debe ver únicamente los temas en los que fue asignado. |

### 5.3 Gestión de Temas

| ID | Requerimiento |
|---|---|
| RF-11 | El sistema debe permitir crear un nuevo tema con: título, descripción, estado inicial, fecha límite (opcional) y departamento de origen. |
| RF-12 | Permitir editar el título, descripción y fecha límite de un tema existente. |
| RF-13 | Permitir eliminar un tema (con confirmación del usuario). |
| RF-14 | Permitir cambiar el estado de un tema directamente desde la tabla (Pendiente, Activo, Pausado, Completado). |
| RF-15 | Filtrar temas por estado y/o búsqueda por texto en el título. |
| RF-16 | Mostrar el conteo de avances y la fecha límite en la tabla de temas. |
| RF-17 | Restringir la vista de temas al departamento del usuario Responsable. |

### 5.4 Asignación de Usuarios a Temas

| ID | Requerimiento |
|---|---|
| RF-18 | Permitir asignar uno o más usuarios a un tema con rol de Responsable o Visualizador. |
| RF-19 | Mostrar la lista de empleados disponibles para asignar (proveniente de la API CEA). |
| RF-20 | Permitir remover la asignación de un usuario en un tema. |

### 5.5 Bitácora (Avances)

| ID | Requerimiento |
|---|---|
| RF-21 | Mostrar el historial de entradas de bitácora de un tema ordenadas cronológicamente. |
| RF-22 | Permitir al Administrador y al Responsable crear nuevas entradas de bitácora con texto de observaciones. |
| RF-23 | Permitir adjuntar uno o varios archivos como evidencias al registrar una entrada. |
| RF-24 | Mostrar las iniciales del usuario que registró la entrada, su nombre, fecha y hora. |
| RF-25 | Indicar visualmente si una entrada fue editada después de su registro. |
| RF-26 | Permitir al propio usuario editar el texto de su entrada de bitácora. |
| RF-27 | El Visualizador (rol 3) no puede crear ni editar entradas de bitácora. |

### 5.6 Administración de Usuarios

| ID | Requerimiento |
|---|---|
| RF-28 | Mostrar el listado de todos los usuarios del sistema con nombre, correo, rol y estado (activo/inactivo). |
| RF-29 | Identificar visualmente el rol de cada usuario con etiquetas de color (Administrador, Responsable, Visualizador). |

---

## 6. Requerimientos No Funcionales

| ID | Requerimiento |
|---|---|
| RNF-01 | La autenticación debe usar JWT con expiración máxima de 12 horas. |
| RNF-02 | Las cookies de sesión deben ser HttpOnly y Secure en producción. |
| RNF-03 | La aplicación debe ser responsive y funcionar en dispositivos de escritorio y tablet. |
| RNF-04 | El tiempo de carga inicial de cada página no debe superar los 3 segundos en red corporativa. |
| RNF-05 | El código debe seguir arquitectura limpia (Dominio / Aplicación / Infraestructura). |
| RNF-06 | El control de acceso por rol debe validarse en el middleware del servidor, no solo en el cliente. |
| RNF-07 | Los archivos adjuntos se almacenan en el servidor API CEA, no localmente en la app. |
| RNF-08 | La aplicación debe desplegarse en un servidor compatible con Node.js (Next.js standalone). |

---

## 7. Flujos Principales

### Flujo 1 — Inicio de Sesión
```
Usuario ingresa credenciales
  → API CEA valida credenciales y devuelve token + datos
  → Sistema verifica si el usuario es Empleado Responsable
  → Se genera sesión JWT con: token, idUsuario, idDepartamento, rol, esEmpleadoResponsable
  → Redirección al Dashboard
```

### Flujo 2 — Registro de Avance
```
Usuario selecciona un tema
  → Accede a la Bitácora del tema
  → Presiona "Nueva Entrada"
  → Completa observaciones (requerido) y evidencias (opcional)
  → Sistema guarda el avance via API CEA
  → La entrada aparece en el historial con fecha/hora y nombre del usuario
```

### Flujo 3 — Cambio de Estado de Tema
```
Responsable o Administrador en la tabla de temas
  → Selecciona nuevo estado en el selector inline
  → Sistema actualiza el estado via API CEA inmediatamente
  → La fila refleja el nuevo estado con color correspondiente
```

---

## 8. Control de Acceso por Ruta

| Ruta | Administrador | Responsable | Visualizador |
|---|---|---|---|
| `/bitacora/Dashboard` | ✅ | ✅ | ✅ |
| `/bitacora/mis-temas` | ✅ | ✅ | ✅ |
| `/bitacora/temas` | ✅ | ✅ | ❌ → Dashboard |
| `/bitacora/temas/[id]` | ✅ | ✅ | ✅ |
| `/bitacora/administracion/usuarios` | ✅ | ❌ → Dashboard | ❌ → Dashboard |

> La redirección de usuarios no autorizados se gestiona en el middleware de Next.js (`middleware.ts`).

---

## 9. Modelo de Datos (Entidades Principales)

```
Tema
├── id
├── titulo
├── descripcion
├── estado: Pendiente | Activo | Pausado | Completado
├── fechaCreacion
├── fechaLimite (opcional)
├── idDepartamentoOrigen
├── involucrados[]  → TemaInvolucrado
└── avances[]       → Avance

TemaInvolucrado
├── idAsignacion
├── idTema
├── idUsuario
└── tipoInvolucrado: Responsable | Visualizador

Avance (entrada de bitácora)
├── idAvance
├── idTema
├── idUsuario
├── observaciones
├── fechaHora
├── fechaEdicion (opcional)
└── adjuntos[]  → Adjunto

Adjunto
├── idAdjunto
├── idAvance
├── nombre
├── url
└── tipoMime (opcional)

Usuario
├── id
├── nombre, paterno, materno, nombreCompleto
├── email
├── rol: 1=Admin | 2=Responsable | 3=Visualizador
└── activo
```

---

## 10. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| Lenguaje | TypeScript 5 |
| UI | React 19 + Tailwind CSS v4 |
| Autenticación | NextAuth v5 (Credentials Provider + JWT) |
| ORM | Prisma 7 |
| Estado global | Zustand 5 |
| Formularios | Formik + Yup |
| Íconos | Lucide React + React Icons (Ionicons 5) |
| HTTP Client | Axios |
| API Backend | API REST CEA (externa) |

---

## 11. Indicadores de Éxito

| Indicador | Meta |
|---|---|
| Adopción | 100% de los responsables de departamento usan el sistema en las primeras 4 semanas |
| Temas con bitácora activa | ≥ 80% de los temas activos tienen al menos un avance registrado por semana |
| Tiempo de respuesta | Páginas cargan en menos de 3 segundos en red interna |
| Reducción de seguimiento manual | Reducción del 70% en uso de correo para seguimiento de compromisos |

---

## 12. Glosario

| Término | Definición |
|---|---|
| **Tema** | Unidad de trabajo o compromiso que requiere seguimiento |
| **Avance** | Entrada en la bitácora que describe el progreso de un tema |
| **Bitácora** | Historial cronológico de avances de un tema |
| **Responsable** | Usuario con capacidad de gestión sobre temas |
| **Visualizador** | Usuario con acceso de lectura a temas asignados |
| **Involucrado** | Cualquier usuario asignado a un tema (Responsable o Visualizador) |
| **Evidencia / Adjunto** | Archivo adjunto como soporte de un avance |
| **CEA** | Nombre de la organización dueña del sistema |

---

*Documento generado automáticamente con base en el análisis del código fuente del repositorio `next-bitacora-cea`.*
