const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/',async  (request, response) => {
    const blogs = await Blog.find({}) 
    const blog_ids = blogs.map(blog => blog._id)
    console.log(blog_ids)
    response.json(blogs)
    
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
    const body = request.body
  
    const note = new Blog({
        title: body.title,
        author: body.author || false,
        url: body.url,
        likes: body.likes || 0
    })

    note.save()
        .then(savedBlog => {
            response.json(savedBlog)
        })
        .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
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