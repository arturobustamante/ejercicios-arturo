# Prueba Técnica: Implementación de JWT en Node.js con Express

## Objetivo
Desarrollar una aplicación API REST simple en Node.js utilizando Express, que implemente autenticación y autorización usando JWT (JSON Web Tokens).

## Requisitos Funcionales

1. **Configuración Inicial:**
   - Crear un proyecto básico de Node.js con Express.
   - Instalar y configurar todas las dependencias necesarias, incluyendo `jsonwebtoken` para manejar JWT.

2. **Autenticación de Usuario:**
   - Implementar una ruta `/login` que acepte credenciales de usuario (como nombre de usuario y contraseña).
   - En esta ruta, generar y devolver un JWT si las credenciales son válidas.
   - El JWT debe incluir información relevante del usuario (por ejemplo, nombre de usuario y roles).

3. **Rutas Protegidas:**
   - Crear rutas que solo sean accesibles si el usuario proporciona un JWT válido.
   - Ejemplos de rutas protegidas: POST: `/users` (crea un nuevo usuario).

4. **Middleware de Verificación de JWT:**
   - Implementar un middleware que verifique el JWT en cada solicitud a las rutas protegidas.
   - El middleware debe validar la firma del JWT y la expiración.
   
## Requisitos No Funcionales

- **Seguridad:** Asegurarse de que las claves secretas para JWT no estén expuestas y sean manejadas de manera segura.
- **Código Limpio:** El código debe ser claro, bien estructurado y fácil de entender.
- **Documentación:** Incluir comentarios explicativos y documentación básica del proyecto.

## Entregables

- Código fuente completo del proyecto.
- Instrucciones para instalar y ejecutar la aplicación.
- Documentación breve describiendo la implementación y las decisiones tomadas.
