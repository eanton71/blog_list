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
})
after(async () => {
    await mongoose.connection.close()
})