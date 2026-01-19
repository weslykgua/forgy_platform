# 🏋️ Forgy Platform

Plataforma completa de gestión de ejercicios y entrenamientos con backend en Node.js + Prisma + PostgreSQL, app móvil en Ionic/Vue, y panel de administración web.

---

## 📁 Estructura del Proyecto

```
forgy-platform/
├── forgy_backend_api/      # Backend API (Node.js + TypeScript + Prisma + PostgreSQL)
├── forgy_mobile_app/       # App móvil (Ionic + Vue + TypeScript)
├── forgy_admin_web/        # Panel admin web
└── package.json            # Scripts para ejecutar todo el proyecto
```

---

## 🚀 Inicio Rápido

### 1️⃣ **Primera vez - Setup completo**

```bash
# Instalar dependencias de todos los proyectos + configurar base de datos
npm run setup
```

Esto hará:
- ✅ Instalar dependencias en API, Mobile y Admin
- ✅ Levantar PostgreSQL en Docker
- ✅ Generar Prisma Client
- ✅ Crear las tablas en la base de datos

### 2️⃣ **Migrar datos existentes** (opcional)

```bash
npm run migrate:data
```

### 3️⃣ **Ejecutar todo el proyecto**

```bash
npm run dev
```

Esto levanta:
- 🗄️ **PostgreSQL** (Docker en puerto 5432)
- 🚀 **Backend API** (http://localhost:3000)
- 📱 **Mobile App** (http://localhost:8100)
- 💻 **Admin Web** (http://localhost:5173 o configurado)

---

## 📦 Scripts Disponibles

### **Desarrollo**

```bash
npm run dev              # Ejecuta TODO (DB + API + Mobile + Admin)
npm run dev:api          # Solo backend API
npm run dev:mobile       # Solo app móvil
npm run dev:admin        # Solo admin web
```

### **Base de Datos**

```bash
npm run db:start         # Levantar PostgreSQL (Docker)
npm run db:stop          # Detener PostgreSQL
npm run db:studio        # Abrir Prisma Studio (GUI de base de datos)
```

### **Prisma**

```bash
npm run prisma:generate  # Generar Prisma Client
npm run prisma:migrate   # Crear nueva migración
npm run prisma:studio    # Abrir Prisma Studio
npm run migrate:data     # Migrar datos de archivos TS a PostgreSQL
```

### **Docker**

```bash
npm run docker:up        # Levantar todo en Docker
npm run docker:down      # Detener contenedores
npm run docker:logs      # Ver logs
npm run docker:rebuild   # Rebuild completo
```

### **Build**

```bash
npm run build:api        # Build del backend
npm run build:mobile     # Build de la app móvil
npm run build:admin      # Build del admin web
```

### **Mantenimiento**

```bash
npm run clean            # Limpiar node_modules y locks
npm run install:all      # Instalar todas las dependencias
npm run reset            # Limpiar + reinstalar todo
npm run setup            # Setup inicial completo
```

---

## 🛠️ Requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** (para PostgreSQL)
- **Git**

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL esté corriendo
docker ps

# Si no está, levantarlo
npm run db:start

# Esperar 5 segundos y reintentar
```

### ❌ Error: "Prisma Client not found"

```bash
npm run prisma:generate
```

### ❌ Error: "Port 3000 already in use"

```bash
# Encontrar y matar el proceso
lsof -ti:3000 | xargs kill -9

# O cambiar el puerto en forgy_backend_api/.env
PORT=3001
```

### ❌ Error: "Module not found"

```bash
# Reinstalar todo
npm run reset
```

---

## 📚 URLs de Desarrollo

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Backend API** | http://localhost:3000 | REST API + WebSocket |
| **Mobile App** | http://localhost:8100 | Aplicación móvil Ionic |
| **Admin Web** | http://localhost:5173 | Panel de administración |
| **Prisma Studio** | http://localhost:5555 | GUI de base de datos |
| **Adminer** | http://localhost:8080 | Gestor de PostgreSQL |

---

## 🗄️ Base de Datos

### Credenciales (desarrollo)

```
Host: localhost
Port: 5432
Database: forgy_db
User: forgy_user
Password: forgy_password
```

### Ver datos

```bash
# Opción 1: Prisma Studio (recomendado)
npm run db:studio

# Opción 2: Adminer (navegador)
# http://localhost:8080
```

---

## 📖 Documentación

- [Backend API](./forgy_backend_api/SETUP.md)
- [Prisma ORM](https://www.prisma.io/docs)
- [Ionic Framework](https://ionicframework.com/docs)

---

## 🤝 Contribuir

1. Crear una rama feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. Hacer commits:
   ```bash
   git commit -m "feat: descripción del cambio"
   ```

3. Push y crear PR:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

---

## 📝 Convenciones de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formateo, punto y coma, etc.
- `refactor:` Refactorización de código
- `test:` Agregar tests
- `chore:` Tareas de mantenimiento

---

## 📄 Licencia

ISC

---

## 👥 Equipo

- Backend: Node.js + TypeScript + Prisma + PostgreSQL
- Mobile: Ionic + Vue 3 + TypeScript
- Admin: Vue 3 + TypeScript

---

**¿Problemas?** Abre un issue en GitHub o contacta al equipo.