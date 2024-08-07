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
 * Updates a blog post
 */
blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body

    // Validate request body
    if (!title || !author || !url) {
        return response.status(400).json({ error: 'title, author, and url are required' })
    }
    const blog = {
        title,
        author,
        url,
        likes: likes || 0
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    if (!updatedBlog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    response.json(updatedBlog)

})
module.exports = blogsRouter