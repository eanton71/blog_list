const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

//Inicializar base de datos de blog para test
const helper = require('./test_helper')
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})
    
//Fin inicilizar BD test


describe('GET Blog list', () => {
    test('EX.4.8. blog list are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('EX.4.8. all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    test('EX.4.9. the unique identifier of blog posts is called id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        assert.strictEqual(Object.keys(blog).includes('id'), true)
        assert.strictEqual(Object.keys(blog).includes('_id'), false)
    })
    test('get specific blog ', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultBlog.body, blogToView)
    })
})
describe.only('POST Blog list', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('password', 10)
        const user = new User({ username: 'testuser', name: 'testuser', passwordHash })
//console.log(user)
        await user.save()
    })
    test.only('EX 4.23. a valid blog can be added, token ', async () => {

        const author = {
            'username': 'testuser',
            'password': 'password'
        }
        const response = await api
            .post('/api/login')
            .send(author)
            .expect(200)
            .expect('Content-Type', /application\/json/) 
        
        
       // console.log(response._body.token)
        const newBlog = {
            title: 'Test Blog',
            author: author._id,
            url: 'http://test.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set("Authorization", `Bearer ${response.body.token}`) 
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)


        const titles = blogsAtEnd.map(n => n.title)
        assert(titles.includes('Test Blog'))
    })
    test.only('EX 4.23. a valid blog can be added, NOT token  ', async () => {

        const author = {
            'username': 'testuser',
            'password': 'password'
        }
        const response = await api
            .post('/api/login')
            .send(author)
            .expect(200)
            .expect('Content-Type', /application\/json/)


        // console.log(response._body.token)
        const newBlog = {
            title: 'Test Blog',
            author: author._id,
            url: 'http://test.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            //.set("Authorization", `Bearer ${response.body.token}`)
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)


        //const blogsAtEnd = await helper.blogsInDb()
        //assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)


       // const titles = blogsAtEnd.map(n => n.title)
       // assert(titles.includes('Test Blog'))
    })

    test('EX 4.11. likes is missing => likes : 0  ', async () => {
        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://test.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const blogsAtEnd = await helper.blogsInDb()
        const blog = blogsAtEnd.find(blog => blog.title === 'Test Blog')

        assert.strictEqual(blog.likes, 0)
    })
    test('EX 4.12. title is missing -> 400 bad request  ', async () => {
        const newBlog = {
            author: 'Test Author',
            url: 'http://test.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)


        const blogsAtEnd = await helper.blogsInDb()
        const blog = blogsAtEnd.find(blog => blog.title === 'Test Blog')

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('EX 4.12. url is missing -> 400 bad request  ', async () => {
        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)


        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    })
})
describe('DELETE Blog ', () => {
    test('EX 4.13. delete blog -> 204 no content', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
})
describe('EX 4.14 Update blog', () => {
    test('Update likes', async () => {
        const blogs = await helper.blogsInDb()
        const update = blogs[0]
        await api
            .put(`/api/blogs/${update.id}`)
            .send({ ...update, likes: 10 })
            .expect(200);

        const updatedBlog = await helper.blogsInDb()
        const blog = updatedBlog.find(blog => blog.id === blogs[0].id)
        assert.strictEqual(blog.likes, 10)
    });
    test('Update  blog not exists', async () => {
        const update = {
            title: "title",
            author: "author",
            url: "url",
            likes: 10
        }
        await api
            .put('/api/blogs/66a7b7a607716d0009d3c249')
            .send(update)
            .expect(404);
    });
    test('Update blog   incorrect id', async () => {
        await api
            .put('/api/blogs/1234567890')
            .send({ likes: 10 })
            .expect(400);
    });
});

describe('EX 4.15. inicializacion db usuarios', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creacion de nuevo usuario con nuevo username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })



})
describe('EX 4.16. users , errores', () => {
    test('username existe, retorna codigo de estado 400', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('username menor 3 caracteres, retorna 400 status code', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ro',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username is required and must be at least 3 characters'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('password menor 3 caracteres, retorna 400 status code', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'otromas',
            name: 'Superuser',
            password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Password is required and must be at least 3 characters'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})
describe('EX 4.17. users , populate', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', name: "superuser", passwordHash })

        await user.save()
    })

    test('create blog, add to author', async () => {
        const users = await helper.usersInDb()
        let initialBlogs = []
        const newBlog = {
            title: 'Test Blog',
            author: users[0]._id,
            url: 'http://test.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const blogsAtEnd = await helper.blogsInDb()
        const users_add_blog = await helper.usersInDb()
        //console.log(users_add_blog[0].blogs.includes())
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)
        assert(titles.includes('Test Blog'))

    })
})
after(async () => {
    await mongoose.connection.close()
})