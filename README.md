# FrontEnd_Lineal

## Despliegue inicial del proyecto
Vamos a hacer un proyecto que va a usar Vite y busca resolver matrices por método de Gauss Jordan.

Las versiones que se están usando de npm es 11.6.2

Es importante que si vas a correr por primera vez npm, le des permisos desde la consola de PowerShell siendo ejecutada como administrador con el comando...<br>

`Set-ExecutionPolicy RemoteSigned`

Ahora, ya habiendo descargando el proyecto en la terminal donde está situado el proyecto ejecuta el siguiente comando para descargar las librerias iniciales de npm.<br>

`npm i`

## Commits
La estructura para llevar un mínimo orden va a ser APELLIDOPA APELLIDOMA NOMBRE(S) / Pequeña descripción como título
Igualmente, véase el primer commit que se hizo para ver el ejemplo

## Ramas (brench)
Cada usuario va a tener que trabajar en su rama, por lo que desde Git o Github Desktop tienen que crear su rama y asegurarse que están en ella para que no se borren las cosas que los demás suban. Solo se subirán los cambios a la rama main cuando se revisen los cambios.

De igual manera, cada vez que empieces a trabajar debes de hacer un pull request para no sobreescribir las cosas a la hora de hacer la mezcla de las ramas

Aquí se escribirán los pasos para hacer las ramas y los comandos que se pueden usar. De igual manera se recomienda usar mejor Github Desktop si es que nunca han usado Git ni han trabajado en un proyecto de código de manera colaborativa.

Si usarás el uso de la terminal de Git, la manera de hacerlo es la siguiente:

1. Cambia a la rama principal (si aún no lo has hecho)<br>
`git checkout main`

2. Sincroniza (Pull) para obtener los últimos cambios del repositorio remoto<br>
`git pull`

3. Ahora crea la rama y cámbiate a ella<br>
`git checkout -b Cerna`
*git checkout -b: Crea una nueva rama (opción -b) y automáticamente te posiciona en ella.
Cerna: El nombre de tu nueva rama.*

4. Sube la nueva rama al repositorio remoto (GitHub)<br>
`git push -u origin Cerna`
*git push: Sube tus commits al repositorio remoto.
-u origin Cerna: Establece la rama remota (origin/Cerna) como rama de seguimiento (upstream), lo que simplifica futuros comandos git push y git pull.*
