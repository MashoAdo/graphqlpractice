const express = require("express")
const  {graphqlHTTP} = require("express-graphql")
const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull} = require("graphql")


const app = express()



const authors = [
    {id: 2, name: "Cal Newport"},
    {id: 1, name: "freddie Gibbs"},
    {id: 3, name: "Mac Miller-b"},
    {id: 4, name: "Mac Miller-s"},
    {id: 5, name: "Mac Miller-c"}
]

const books = [
    {id:1, name: "Deep Work", authorId:2},
    {id:2, name: "Cool kids", authorId: 1},
    {id:4, name: "Blue World", authorId: 3},
    {id:5, name: "Surf", authorId: 4},
    {id:3, name: "circles", authorId: 5}
]

// author type query
const AuthorType = new GraphQLObjectType({
    name:"Author",
    description: "list of authors",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: { type: BookType,
            // get the book that matches author id
            resolve: (author) => { 
             return   books.find(book => book.authorId === author.id)
            }}
    })
})


// book type query
const BookType = new GraphQLObjectType({
    name: "Book",
    description: "Represents a book written by an author",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt) },
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author : {
            type: AuthorType,
            // get the book that matches author id
            resolve: (book) => { 
             return   authors.find(author => author.id === book.authorId)
            }
        }

    })
})


// Root query ... all queries are made here
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Description",
    fields : () =>({
        book:{
            type: BookType,
            description: "a single book",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book =>book.id === args.id),
         
        },
        books: {
            type : new GraphQLList(BookType),
            description:"List of books",
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "Author",
            resolve : () => authors
        }
    })
})

// Root mutation type
const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root mutation",
    fields: () =>({
        addBook:{
            type: BookType,
            description:"add book",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => { 
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }
                // add book to list of books
                books.push(book)

                return book
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use("/graphql", graphqlHTTP({
    graphiql : true,
    schema: schema
}))
app.listen(5000, () =>{
    console.log("server is up and running")
})