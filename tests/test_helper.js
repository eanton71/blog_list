const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs0 = [
    {
        "title": "la bala que doblo la esquina",
        "author": "Elon Muserterk",
        "url": "htttp:/sdfdsf",
        "likes": 1 
    },
    {
        "title": "ororororooroorodsdf",
        "author": "Elon cucamona",
        "url": "htttp:/354325435",
        "likes": 11 
    },
    {
        "title": "qwe wqqwr werewr",
        "author": "pprqw cucamona",
        "url": "htttp:/pqwerwerqwer",
        "likes": 2 
    },
    {
        "title": "React patterns",
        "author": "Michael Chan",
        "url": "https://reactpatterns.com/",
        "likes": 7 
    },
    {
        "title": "Go To Statement Considered Harmful",
        "author": "Edsger W. Dijkstra",
        "url": "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        "likes": 5 
    },
    {
        "title": "Canonical string reduction",
        "author": "Edsger W. Dijkstra",
        "url": "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        "likes": 12 
    },
    {
        "title": "First class tests",
        "author": "Robert C. Martin",
        "url": "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        "likes": 10 
    },
    {
        "title": "TDD harms architecture",
        "author": "Robert C. Martin",
        "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        "likes": 0 
    },
    {
        "title": "Type wars",
        "author": "Robert C. Martin",
        "url": "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        "likes": 2 
    }
]
const initialBlogs = [
    
]
/*
const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon' })
    await note.save()
    await note.deleteOne()

    return note._id.toString()
}
*/
const blogsInDb = async () => {
    const blogs = await Blog.find({})
        .populate('author', { username: 1, name: 1 })
    return blogs.map(blog => blog.toJSON())
}


const usersInDb = async () => {
    const users = await User.find({})
        
    return users.map(u => u.toJSON())
}

 
module.exports = {
    initialBlogs, blogsInDb,usersInDb
}