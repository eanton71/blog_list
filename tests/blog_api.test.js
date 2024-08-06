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
        console.log(response.body)

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    test('EX.4.9. the unique identifier of blog posts is called id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]

        assert.strictEqual(Object.keys(blog).includes('id'), true)
        assert.strictEqual(Object.keys(blog).includes('_id'), false)
    })
})

after(async () => {
    await mongoose.connection.close()
})