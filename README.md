# Curso FullstackOpen
Universidad de Helsinki

-
- Instalar [express-async-errors](https://github.com/davidbanham/express-async-errors) para evitar el suo de try catch
  - `npm install express-async-errors`
  - En `app.js` incluir antes e las rutas `require('express-async-errors')`

### 4.8: Pruebas de Lista de Blogs, paso 1
- Usar `superTest`para escribir una prueba  que realice una solicitud HTTP GET a la URL /api/blogs
  - `npm install --save-dev supertest`
  - Crear archivo `/tests/blog_api.test.js`
  - Modificar `/utils/logger.js` para que no interfiera en las pruebas. 
- Definir un entorno de prueba con una base de datos separada para `test`
  -  Modificar `package.json`, scripts:
     -  `"start": "cross-env NODE_ENV=production node index.js"`
       - `"dev": "cross-env NODE_ENV=development nodemon index.js"`
       - `"test": "cross-env NODE_ENV=test node --test"`
    - En Windows es necesario `cross-env`. En otros sistemas SSOO se puede omitir `?`
      - En modo depednencia de desarrollo `npm install --save-dev cross-env`
      - por si acaso da problemas `npm install cross-env`
    - Modificar el archivo `.env`para añadir una conexion a una base de datos para test. Cambiar el nombre de la BD en la cadena de conexion `test_blog_list`. Añadir la conexion a una variable `TEST_MONGODB_URI`
    - Modificar `/utils/config.js` para que tenga en cuenta el modo para coger una variable u otra :  
        ````js
        const MONGODB_URI = process.env.NODE_ENV === 'test'
            ? process.env.TEST_MONGODB_URI
            : process.env.MONGODB_URI
            
        ````
   - Crear un archivo `/test/test_helper.js` para inicializar BD (refactorizado)
- Verificar el numero  correcto de publicaciones
- Verificar que estan en JSON
- Refactorizar `GET /api/blogs` para usar `async/await`
### 4.9 : Pruebas de Lista de Blogs, paso 2
- Prueba que verifique que la propiedad de identificador único de las publicaciones del blog se llame id, (de manera predeterminada, la base de datos nombra la propiedad _id).
- Modificar el   método toJSON  que se encuentra en `/models/blog.js` 
### 4.10:  Pruebas de Lista de Blogs, paso 3
- test para creacion de nuevo blog HTTTP POST
  - verificar que el numero de blogs se incrementa en uno
  - verificar que el contenido del blog se ah gaurdaod corerectamete en la BD
### 4.11*: Pruebas de Lista de Blogs, paso 4
- Verificar  que si la propiedad likes falta en la solicitud, tendrá el valor 0 por defecto. 
- Hacer los cambios en la funcion POST
### 4.12: Pruebas de Lista de Blogs, paso 5
- Verificar , si faltan title o url retornar 400 bad request
- Hacer los cambios en la fucion POST
### 4.13 Expansiones de la Lista de Blogs, paso 1
- Implementar ELimiar un solo recurso de blog con async/await
- Impleamtar pruebas
### 4.14 Expansiones de Listas de Blogs, paso 2
- Implementar la actualización de un solo recurso de blog con async/await
- Implemenra pruebas

### 4.15: Expansión de la Lista de Blogs, paso 3
- Crear nuevos usuarios con  una solicitud POST HTTP a la dirección api/users. 
- Los usuarios tienen username, password y name.
  - Crear un archivo `/models/user.js`
  - Implementar el esquema para User
  - Modificar ele esquema `Blog`para incluir la referencia a `User`como autor del blog
  - CRear archivo  en `/controllers/users.js` para alojar la peticion de nuevo usuario
- Utilizar la librería bcrypt para cifrar las contraseñas- Si da problemas `bcrypt`en Windwows desinstalr, `npm uninstall bcrypt`, instalar `bcryptjs`.
  - Instalar bcrypt 

- Implementa una solicitud para  la lista  de todos los usuarios:
````json
[
  {
    "username": "root",
    "name": "Superuser", 
    "id": "66b524301357d9205feb9540"
  },
````
 
### 4.16*: Expansión de la Lista de Blogs, paso 4
- Agregar restricciones para la creación de   usuarios:   username y  password requeridos  y con  al menos 3 caracteres. El username debe ser único.

- Agreagar la validadion en el controladro de ruta `/controllers/users`
  - piude se rrsolo para el passowrod y las demas en el esquema para user  

- imprelemantr pruebas para suaurios no validos : username o apassword menosr de 3 caracrteres o no existentes

Cuando  las pruebas comparten la misma base de datos, la ejecución simultánea puede causar problemas, que pueden evitarse ejecutando las pruebas con la opción --test-concurrency=1 (para que se ejecuten secuencialmente).

### 4.17: Expansión de la Lista de Blogs, paso 5
- Cada blog debe contenr inforamcion sobre el creador de ese blog
- Al crear el blog `POST /api/blogs`, se debe añadir su creador
  - Importar el modelo de `User` en el controlador de blogs
  - buscar un usuario y usar su id
  - 
  - Test en REST Client de VSCode
    - crear un suaurio para obtener su id
    - crearun blog con el id


- Modificar funcion del controlador `GET /api/blogs` que nos retorna la lista de blogs
  - Debe mostrar la ingformacion completa del usuario en cada blog
  - usar la funcion populate
### 4.18: Expansión de la Lista de Blogs, paso 6
- Implementar la autenticación basada en token 
  - Crear ruta para login `POST /api/login` en `/controllers/login.js`
  - En arrchivo `.env`hay que añadir una variable SECRET

### 4.19: Expansión de la Lista de Blogs, paso 7
- En la  solicitud HTTP POST para crear blogs comprobar que el token sea valido. El usuario identificado por el token se designa como el creador del blog.

  - Imporatr en el mismo archivo la libreria para `jwt`
  - En la funcion para la ruta POST obtener el token y decodifcarlo con jwt
  - buscar el usuario por el id del tokken decodificado
  - Añadir en el middleware el codigo de estado 401 para `JsonWebTokenError`
### 4.20*: Expansión de la Lista de Blogs, paso 8
- Extraer el token desde una funcion middleware
- Refactorizar la funcion getTokenFrom y llevarla al archivo middleware.js
- Aqui se guarda el resultado en request.toekn
- Es recogido por la funcionm POST /api/blogs para guardar blogs, que necesita comprobar el token
- El  middleware debe estar en en el archivo app.js antes de   las rutas
````js
app.use(middleware.tokenExtractor)
````
- Desde los controladores de ruta se accede al token asi:
````js
blogsRouter.post('/', async (request, response) => {
  // ..
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ..
})
````
- La funcion middleware tiene esta estructura: 
````js
const tokenExtractor = (request, response, next) => {
  // código que extrae el token

  next()
}
````
### 4.21*: Expansión de la Lista de Blogs, paso 9
 - Modificar  la ruta eliminar blogs para que el blog solo pueda ser eliminado por el usuario que lo agregó: el token enviado con la solicitud es el mismo que el del creador del blog.

Si se intenta eliminar un blog sin un token o por un usuario incorrecto, la operación debe devolver un código de estado adecuado.

Ten en cuenta que si obtienes un blog de la base de datos,

const blog = await Blog.findById(...)copy
el campo blog.user no contiene una cadena, sino un objeto. Entonces, si deseas comparar el ID del objeto obtenido de la base de datos y un ID de cadena, la operación de comparación normal no funciona. El ID obtenido de la base de datos debe primero convertirse en una cadena.

if ( blog.user.toString() === userid.toString() ) ...copy
### 4.22*: Expansión de la Lista de Blogs, paso 10
- Crear  middleware userExtractor, que encuentre al usuario y lo guarde en el objeto de solicitud. Cuando registras el middleware en app.js

app.use(middleware.userExtractor)copy
el usuario se guardara en el campo request.user:

blogsRouter.post('/', async (request, response) => {
  // obtén usuario desde el objeto de solicitud
  const user = request.user
  // ..
})

blogsRouter.delete('/:id', async (request, response) => {
  // obtén usuario desde el objeto de solicitud
  const user = request.user
  // ..
})copy
Ten en cuenta que es posible registrar un middleware solo para un conjunto específico de rutas. Entonces, en lugar de usar userExtractor con todas las rutas,

const middleware = require('../utils/middleware');
// ...

// usa el middleware en todas las rutas
app.use(middleware.userExtractor)

app.use('/api/blogs', blogsRouter)  
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)copy
podríamos registrarlo para que solo se ejecute con las rutas de /api/blogs:

const middleware = require('../utils/middleware');
// ...

// usa el middleware solo en las rutas de api/blogs
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)copy
Como puede verse, esto sucede al encadenarse múltiples middlewares como argumentos de la función use. También sería posible registrar un middleware solo para una operación específica:

const middleware = require('../utils/middleware');
// ...

router.post('/', middleware.userExtractor, async (request, response) => {
  // ...
}copy
### 4.23*: Expansión de la Lista de Blogs, paso 11
- Hacer pruebas para agregar un nuevo blog con autenticación basada en tokense rompieron. Arréglalas.
-  También si falla cuando no se añade token con el código de estado adecuado 401 Unauthorized  

 https://github.com/visionmedia/supertest/issues/398