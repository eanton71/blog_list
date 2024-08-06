const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


describe('total likes', () => {
    const listWithOneBlog = [
        {
            "title": "la bala que doblo la esquina",
            "author": "Elon Muserterk",
            "url": "htttp:/sdfdsf",
            "likes": 1,
            "id": "66aaa538edf8bbbef7636a68"
        },
        {
            "title": "ororororooroorodsdf",
            "author": "Elon cucamona",
            "url": "htttp:/354325435",
            "likes": 12,
            "id": "66ab53f7b968ecbca16e822d"
        },
        {
            "title": "qwe wqqwr werewr",
            "author": "pprqw cucamona",
            "url": "htttp:/pqwerwerqwer",
            "likes": 2,
            "id": "66abbf2ee3a0b5586e73d057"
        },
        {
            "title": "React patterns",
            "author": "Michael Chan",
            "url": "https://reactpatterns.com/",
            "likes": 7,
            "id": "66abbf47e3a0b5586e73d05a"
        },
        {
            "title": "Go To Statement Considered Harmful",
            "author": "Edsger W. Dijkstra",
            "url": "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            "likes": 5,
            "id": "66abbf7be3a0b5586e73d05c"
        },
        {
            "title": "Canonical string reduction",
            "author": "Edsger W. Dijkstra",
            "url": "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            "likes": 12,
            "id": "66abbfb7e3a0b5586e73d05f"
        },
        {
            "title": "First class tests",
            "author": "Robert C. Martin",
            "url": "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            "likes": 10,
            "id": "66abc17630750d239d240dac"
        },
        {
            "title": "TDD harms architecture",
            "author": "Robert C. Martin",
            "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            "likes": 0,
            "id": "66abc18c30750d239d240dae"
        },
        {
            "title": "Type wars",
            "author": "Robert C. Martin",
            "url": "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            "likes": 2,
            "id": "66abc19f30750d239d240db0"
        }
    ]

    test('EX. 4.4. when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 51)
    })
})