const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//QUITAR ?
//const User = require('../models/user')
//const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    .populate('author', { username: 1, name: 1 })
    // const blog_ids = blogs.map(blog => blog._id)
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

    /*
    //descifrar el token enviado
    const decodedToken = jwt.verify(request.token, process.env.SECRET) 
    
    //si no tiene id es invalido
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    //buscar el usuario por el id del token
    const user = await User.findById(decodedToken.id)     
        */
    const user = request.user
    if (body.title && body.url) {
        const blog = new Blog({
            title: body.title,
            author: user._id,
            url: body.url,
            likes: body.likes || 0
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        response.status(201).json(savedBlog)
        await user.save()
    }
    else {
        response.status(400).json({ error: 'title and url are required' })
    }

})

blogsRouter.delete('/:id', async (request, response) => {
    /*
    //descifrar el token enviado (el usuarioi debe estar logeado)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    //si no tiene id es invalido
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    //buscar el usuario por el id del token
    const user = await User.findById(decodedToken.id)
    */
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(400).json({ error: 'Blog not exists' })
    if (blog.author.toString() !== user._id.toString()) {
        return response.status(401).json({ error: 'Unauthorized user for delete blog' })
    }
    // Remove blog
    await blog.deleteOne()


    //el  blog de la lista blogs de user se ha borrado ?
    //console.log(user.blogs[0].toString())
    //console.log('PID ', request.params.id)
    //console.log('userBLOGS ', user)
    let blogs = user.blogs.filter(b => b)
    //console.log('BLOGS ', blogs)
   
   
    blogs = blogs.filter((b) =>  b.toString()!== request.params.id)  
    user.blogs = blogs
    await user.save() 
    //user.blogs = user.blogs.map(b => console.log(b))

    
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