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

function mostBlogs(blogs) {
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
module.exports = {
    dummy,totalLikes,favoriteBlog,mostBlogs
}