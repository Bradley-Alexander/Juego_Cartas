Proyecto "Gamer Store" (Despliegue PaaS en Azure) ☁️

1. Resumen Técnico

Este repositorio contiene el código fuente del proyecto "Gamer Store". El propósito principal es demostrar el despliegue de un sitio web en un entorno PaaS (Plataforma como Servicio) gestionado en Microsoft Azure.

Autoría: Bradley Poma Vera

Plataforma: Microsoft Azure

Servicio: App Service (Web App)

Sistema Operativo: Linux

URL de Producción: El sitio está desplegado y accesible públicamente en:

https://gamer-btdeabe9e4aybcep.brazilsouth-01.azurewebsites.net/

2. Instrucciones de Despliegue (Integración Continua)

El despliegue de este proyecto está totalmente automatizado utilizando Integración Continua (CI/CD) a través de GitHub Actions.

No se requiere ningún paso manual para el despliegue.

Proceso de Despliegue Automático

Disparador (Trigger): El flujo de trabajo de despliegue se activa automáticamente cada vez que se realiza un push o un merge a la rama principal (main o master) de este repositorio.

Acción (Action): GitHub Actions toma el código fuente, (lo compila si es necesario) y lo empaqueta.

Despliegue (Deploy): Los archivos de la aplicación son desplegados de forma segura en el Azure App Service (gamer-btdeabe9e4aybcep).

Resultado: Los cambios se reflejan en la URL de producción en pocos minutos, sin necesidad de intervención manual.
