Proyecto "Gamer Store" (Despliegue PaaS en Azure)

1. Propósito del Sistema

Este proyecto es un sitio web funcional (demo de e-commerce "Gamer Store") desplegado en un entorno PaaS de Microsoft Azure. El objetivo principal es demostrar la migración de una aplicación web a un servicio gestionado (App Service) y la configuración de un flujo de Integración Continua y Despliegue Continuo (CI/CD).

Autoría: [Tu Nombre Completo]

2. Entorno de Ejecución y Dependencias

La aplicación se ejecuta en la siguiente infraestructura de nube:

Plataforma: Microsoft Azure (PaaS)

Servicio: Azure App Service

Sistema Operativo: Linux

Stack de Ejecución: Node.js 18 LTS [Ajustar si es otro, ej: .NET, Python, etc.]

Dependencias del Proyecto:

HTML5

CSS3

JavaScript (Frontend)

[Si usaste Node.js, añade: npm (para el servidor web, ej: express)]

3. Instrucciones de Despliegue (CI/CD)

El despliegue de este proyecto está totalmente automatizado mediante Integración Continua.

Disparador (Trigger): El despliegue se inicia automáticamente cada vez que se realiza un push o merge a la rama main (o master) de este repositorio.

Proceso: GitHub Actions se encarga de:

Detectar el cambio.

(Opcional: Construir el proyecto, ej: npm install && npm run build si fuera necesario).

Desplegar los artefactos resultantes en el Azure App Service vinculado.

Acceso: Una vez completado el flujo de trabajo (tarda 1-2 minutos), los cambios están disponibles públicamente en la URL de producción:

URL: httpss://gamer-btdeabe9e4aybcep.brazilsouth-01.azurewebsites.net/

No se requiere ninguna intervención manual para actualizar el sitio en producción.
