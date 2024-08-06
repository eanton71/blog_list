# Curso FullstackOpen
Universidad de Helsinki


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
    - Modificar el archivo `.env`para añadir una conexion a una base de datos para test. Cambiar el nombre de la BD en la cadena de conexion `test_blog_list`
    - Modificar `/utils/config.js` para que tenga en cuenta el modo para coger una variable u otra :  
        ````js
        const MONGODB_URI = process.env.NODE_ENV === 'test'
            ? process.env.TEST_MONGODB_URI
            : process.env.MONGODB_URI
            
        ````
   - Crear un archivo `/test/test_helper.js` para inicializar BD (refactorizado)
- Verificar el numero  correcto de publicaciones en JSON
- Refactorizar `GET /api/blogs` para usar `async/await`
### 4.9 : Pruebas de Lista de Blogs, paso 2
- Prueba que verifique que la propiedad de identificador único de las publicaciones del blog se llame id, (de manera predeterminada, la base de datos nombra la propiedad _id).
- Modificar el   método toJSON  que se encuentra en `/models/blog.js`
- 