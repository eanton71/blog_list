const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
const favoriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    return blogs.find(blog => blog.likes === maxLikes)
}

const  mostBlogs = (blogs) => {
    const contador = blogs.reduce((acumulado, blog) => {
        const author = blog.author;
        if (!acumulado[author]) {
            acumulado[author] = 1;
        } else {
            acumulado[author]++;
        }
        return acumulado;
    }, {});

    const mostBlogs = Object.keys(contador).reduce((max, author) => {
        if (contador[author] > max.blogs) {
            return { author, blogs: contador[author] };
        }
        return max;
    }, { author: '', blogs: 0 });

    return mostBlogs;
}

function mostLikes(blogs) {
    const authors = blogs.reduce((acc, blog) => {
        const author = blog.author;
        if (!acc[author]) {
            acc[author] = 0;
        }
        acc[author] += blog.likes;
        return acc;
    }, {});

    const maxLikes = Math.max(...Object.values(authors));
    const favoriteAuthor = Object.keys(authors).find(author => authors[author] === maxLikes);

    return {
        author: favoriteAuthor,
        likes: maxLikes
    };
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}