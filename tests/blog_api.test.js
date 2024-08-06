const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

//Inicializar base de datos de blog para test
const helper = require('./test_helper')
const Blog = require('../models/blog')

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
describe('POST Blog list', () => {
    test('EX 4.10. a valid blog can be added ', async () => {
        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://test.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)


        const titles = blogsAtEnd.map(n => n.title)
        assert(titles.includes('Test Blog'))
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
after(async () => {
    await mongoose.connection.close()
})