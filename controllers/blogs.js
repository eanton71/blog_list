const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    const blog_ids = blogs.map(blog => blog._id)
    response.json(blogs)

})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    if (body.title && body.url) {
        const blog = new Blog({
            title: body.title,
            author: body.author || false,
            url: body.url,
            likes: body.likes || 0
        })
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    }
    else {
        response.status(400).json({ error: 'title and url are required' })
    }

})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

})
/**
 * TODO repasar que es lo que hay que actualiar
 */
blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author || false,
        url: body.url,
        likes: body.likes || 0
    })

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter