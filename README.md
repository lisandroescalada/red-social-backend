# red-social-backend

Backend de una red social desarrollado con **NestJS** y **MongoDB**, que incluye autenticación, gestión de usuarios, publicaciones, comentarios, estadísticas y almacenamiento de imágenes en la nube.

---

## 🚀 Tecnologías utilizadas

- [NestJS](https://nestjs.com/) - Framework de Node.js
- [MongoDB](https://www.mongodb.com/) + Mongoose - Base de datos NoSQL
- [Cloudinary](https://cloudinary.com/) - Almacenamiento de imágenes en la nube
- [JWT](https://jwt.io/) - Autenticación mediante tokens
- [TypeScript](https://www.typescriptlang.org/)
- [Passport.js](https://www.passportjs.org/) - Estrategias de autenticación

---

## 📁 Estructura del proyecto
```
src/
├── autenticacion/
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── autenticacion.controller.ts
│   ├── autenticacion.module.ts
│   └── autenticacion.service.ts
├── cloudinary/
│   ├── cloudinary.module.ts
│   └── cloudinary.service.ts
├── comentarios/
│   ├── dto/
│   ├── schemas/
│   ├── comentarios.controller.ts
│   ├── comentarios.module.ts
│   └── comentarios.service.ts
├── estadisticas/
│   ├── estadisticas.controller.ts
│   ├── estadisticas.module.ts
│   └── estadisticas.service.ts
├── publicaciones/
│   ├── dto/
│   ├── schemas/
│   ├── publicaciones.controller.ts
│   ├── publicaciones.module.ts
│   └── publicaciones.service.ts
├── usuarios/
│   ├── schemas/
│   ├── usuarios.controller.ts
│   ├── usuarios.module.ts
│   └── usuarios.service.ts
├── app.module.ts
└── main.ts
```

---

## 📦 Módulos

### 🔐 Autenticación
Gestión del registro e inicio de sesión de usuarios. Implementa guards y estrategias con Passport.js y JWT.

### ☁️ Cloudinary
Servicio de integración con Cloudinary para la carga y eliminación de imágenes en la nube.

### 💬 Comentarios
CRUD de comentarios asociados a publicaciones, con sus respectivos DTOs y esquemas de Mongoose.

### 📊 Estadísticas
Endpoints para consultar métricas e información estadística de la red social.

### 📝 Publicaciones
Gestión completa de publicaciones, incluyendo soporte para imágenes almacenadas en Cloudinary.

### 👤 Usuarios
Administración de perfiles de usuario, con esquemas y endpoints dedicados.

---

## ⚙️ Instalación
```bash
# Clonar el repositorio
git clone https://github.com/lisandroescalada/red-social-backend.git
cd red-social-backend

# Instalar dependencias
npm install
```

---

## 🔧 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
# MongoDB
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/<db>

# JWT
JWT_SECRET=tu_secreto_jwt

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## ▶️ Ejecución
```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Tests
npm run test
```

---

## 🧪 Tests

El proyecto incluye tests unitarios para los principales controladores y servicios:

- `autenticacion.controller.spec.ts`
- `autenticacion.service.spec.ts`
- `cloudinary.service.spec.ts`
- `comentarios.controller.spec.ts`
- `comentarios.service.spec.ts`
```bash
npm run test
```

---

## 👤 Autor

**Lisandro Escalada** – [@lisandroescalada](https://github.com/lisandroescalada)
