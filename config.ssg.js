module.exports = {
    options: {
        ignoreReadme: true,
    },
    site: {
        title: 'SSG',
    },
    collections: [
        {
            name: 'employees',
            output: true, //when output is true, collection will be rendered to HTML
        },
        // {
        //     name: 'posts',
        //     output: true, //when output is true, collection will be rendered to HTML
        // }
    ]
}