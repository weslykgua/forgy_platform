# 🏋️ Forgy Platform

Plataforma completa de gestión de ejercicios y entrenamientos.

**Stack:** Node.js + TypeScript + Prisma + PostgreSQL + Ionic + Vue 3

---

## 🚀 Inicio Rápido

### Un solo comando (primera vez y siempre):

```bash
npm run dev
```

**Eso es TODO.** 

La primera vez detecta automáticamente que es nuevo y:
- ✅ Instala todas las dependencias
- ✅ Configura PostgreSQL en Docker
- ✅ Crea las tablas de la base de datos
- ✅ Migra los datos de ejemplo
- ✅ Inicia la aplicación

Las siguientes veces simplemente inicia la app.

**URLs:**
- 🚀 Backend API: http://localhost:3000
- 📱 Mobile App: http://localhost:5173

---

## 📋 Requisitos

- **Node.js** >= 18
- **Docker Desktop** (para PostgreSQL)

---

## 🎯 Comandos principales

```bash
npm run dev            # Iniciar (auto-configura primera vez)
npm start              # Alias de npm run dev
npm run db:studio      # Ver base de datos (GUI)
npm run db:stop        # Detener PostgreSQL
npm run reset          # Limpiar y empezar de cero
```

---

## 🛠️ Comandos avanzados

### Base de datos
```bash
npm run db:start       # Iniciar PostgreSQL
npm run db:stop        # Detener PostgreSQL  
npm run db:restart     # Reiniciar PostgreSQL
npm run db:logs        # Ver logs de PostgreSQL
npm run db:studio      # Abrir Prisma Studio
```

### Prisma
```bash
npm run prisma:generate    # Regenerar Prisma Client
npm run prisma:migrate     # Crear nueva migración
npm run prisma:studio      # Ver datos (GUI)
npm run migrate:data       # Re-migrar datos de ejemplo
```

### Desarrollo
```bash
npm run dev:api        # Solo backend
npm run dev:mobile     # Solo mobile app
npm run dev:admin      # Solo admin web
```

### Docker
```bash
npm run docker:all     # Todo en Docker
npm run docker:down    # Detener contenedores
npm run docker:logs    # Ver logs
```

### Calidad de código
```bash
npm run typecheck      # Verificar tipos TypeScript
npm run lint           # Ver problemas
npm run lint:fix       # Arreglar automáticamente
npm run format         # Formatear código
npm run check          # Verificar todo
```

### Mantenimiento
```bash
npm run clean          # Limpiar node_modules
npm run reset          # Limpiar + reinstalar
npm run install:all    # Reinstalar dependencias
```

---

## 📂 Estructura del proyecto

```
forgy-platform/
├── forgy_backend_api/     # Backend (Node.js + Prisma)
├── forgy_mobile_app/      # App móvil (Ionic + Vue)
├── forgy_admin_web/       # Panel admin (Vue)
├── scripts/               # Scripts de automatización
│   ├── start.js          # Script de inicio
│   └── wait-for-postgres.js
└── package.json           # Scripts globales
```

---

## 🔧 Solución de problemas

### "Can't reach database server"
```bash
npm run db:start
# Esperar 5 segundos
npm start
```

### "Port 3000 already in use"
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Prisma Client not found"
```bash
npm run prisma:generate
```

### Empezar de cero
```bash
npm run reset
npm run new
```

### PostgreSQL no inicia
1. Abre Docker Desktop
2. Espera a que esté listo (icono verde)
3. Ejecuta: `npm run db:start`

---

## 🌟 Características

- ✅ Backend API REST completo
- ✅ Base de datos PostgreSQL
- ✅ ORM type-safe con Prisma
- ✅ WebSocket para tiempo real
- ✅ App móvil con Ionic
- ✅ Hot-reload en desarrollo
- ✅ Docker para fácil deployment
- ✅ TypeScript en todo el proyecto

---

## 📚 Tecnologías

**Backend:**
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Socket.io
- Docker

**Frontend:**
- Ionic Framework
- Vue 3 + TypeScript
- Vite

---

## 🤝 Desarrollo

### Crear una nueva rama:
```bash
git checkout -b feature/nueva-funcionalidad
```

### Convenciones de commits:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `refactor:` Refactorización
- `style:` Formateo
- `test:` Tests

### Antes de hacer commit:
```bash
npm run check
npm run lint:fix
npm run format
```

---

## 📄 Licencia

ISC

---

## 🆘 Ayuda

Si algo no funciona:

1. Verifica que Docker Desktop esté corriendo
2. Ejecuta `npm run reset`
3. Ejecuta `npm run new`
4. Si el problema persiste, abre un issue

---

**Hecho con ❤️ por el equipo Forgy**