
/**
 * Part Two - Add Tests
Add integration tests for each of your routes to make sure that the response expected is sent.

Think about certain edge cases for each of these routes and add tests for things like invalid input to make sure your schema validation is correct.

Also make sure to set process.env.NODE_ENV = “test” inside of your test file.
 */


const request = require("supertest")


const app = require("../app");
const db =  require("../db")

const Book = require("../models/book")

describe("Book Routes Test", function() {

    beforeEach(async function () {

        await db.query("DELETE FROM books")

        const sampleBook1 = {
            "isbn": "000000001",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Sample Author 1",
            "language": "english",
            "pages": 264,
            "publisher": "Sample Publisher 1",
            "title": "Sample Title 1",
            "year": 2020
        };

        const sampleBook2 = {
            "isbn": "000000002",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Sample Author 2",
            "language": "english",
            "pages": 265,
            "publisher": "Sample Publisher 2",
            "title": "Sample Title 2",
            "year": 2021
        };

        const sampleBook3 = {
            "isbn": "000000003",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Sample Author 3",
            "language": "english",
            "pages": 266,
            "publisher": "Sample Publisher 3",
            "title": "Sample Title 3",
            "year": 2022
        };

        let b1 = await Book.create(sampleBook1)
        let b2 = await Book.create(sampleBook2)
        let b3 = await Book.create(sampleBook3)

    })

    /** GET / => {books: [book, ...]}  */

    describe("GET /books/", function () {

        test("can get all - SUCCESS", async() => {

            let response = await request(app).get("/books");
            expect(response.statusCode).toEqual(200)
            expect(response.body.books.length).toEqual(3);
            expect(response.body.books[0].title).toEqual("Sample Title 1");
            expect(response.body.books[1].title).toEqual("Sample Title 2");
            expect(response.body.books[2].title).toEqual("Sample Title 3");

        })

    })

    describe("GET /books/:id", function () {

        test("can get single book by id - SUCCESS", async() => {

            let response = await request(app).get("/books/000000001");
            expect(response.statusCode).toEqual(200)
            expect(response.body.book.isbn).toEqual("000000001")
            expect(response.body.book.title).toEqual("Sample Title 1")

        })

        test("can get single book by id - SUCCESS 3rd", async() => {

            let response = await request(app).get("/books/000000003");
            expect(response.statusCode).toEqual(200)
            expect(response.body.book.isbn).toEqual("000000003")
            expect(response.body.book.title).toEqual("Sample Title 3")

        })

        test("can get single book by id - FAIL 4th", async() => {

            let response = await request(app).get("/books/000000004");
            expect(response.statusCode).toEqual(404)
            expect(response.body).toHaveProperty("error")
            expect(response.body).toMatchObject({"error": {"message": "There is no book with an isbn '000000004", "status": 404}})

        })

        test("can get single book by id - FAIL FEW DIGITS", async() => {

            let response = await request(app).get("/books/00000000");
            expect(response.statusCode).toEqual(404)
            expect(response.body).toHaveProperty("error")
            expect(response.body).toMatchObject({"error": {"message": "There is no book with an isbn '00000000", "status": 404}})

        })

    })

    describe("POST /books", function () {

        test("can post a book - SUCCESS", async() => {

            const successBook = {

                "isbn": "000000004",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Sample Author 4",
                "language": "english",
                "pages": 267,
                "publisher": "Sample Publisher 4",
                "title": "Sample Title 4",
                "year": 2020

            }

            let response = await request(app).post("/books").send(successBook);
            expect(response.statusCode).toEqual(201)
            expect(response.body).toHaveProperty("book")
            expect(response.body.book.title).toEqual("Sample Title 4")


        })

        test("can post a book - FAIL - DUPLICATE", async() => {

            const duplicateBook = {

                "isbn": "000000001",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Sample Author 1",
                "language": "english",
                "pages": 267,
                "publisher": "Sample Publisher 1",
                "title": "Sample Title 1",
                "year": 2020

            }

            let response = await request(app).post("/books").send(duplicateBook);
            expect(response.statusCode).toEqual(500)
            expect(response.body).toHaveProperty("error")
            expect(response.body).toMatchObject({error: {message: 'duplicate key value violates unique constraint "books_pkey"'}})

        })

        test("can post a book - FAIL - DUPLICATE - JUST ISBN", async() => {

            const duplicateBookISBN = {

                "isbn": "000000001",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Sample Author 4",
                "language": "english",
                "pages": 267,
                "publisher": "Sample Publisher 4",
                "title": "Sample Title 4",
                "year": 2020

            }

            let response = await request(app).post("/books").send(duplicateBookISBN);
            expect(response.statusCode).toEqual(500)
            expect(response.body).toHaveProperty("error")
            expect(response.body).toMatchObject({error: {message: 'duplicate key value violates unique constraint "books_pkey"'}})

        })

        test("can post a book - FAIL - NO YEAR", async() => {

            const failBookYEAR = {

                "isbn": "000000004",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Sample Author 4",
                "language": "english",
                "pages": 267,
                "publisher": "Sample Publisher 4",
                "title": "Sample Title 4",

            }

            let response = await request(app).post("/books").send(failBookYEAR);
            expect(response.statusCode).toEqual(400)
            console.log(response.body)
            expect(response.body).toHaveProperty("error")
            expect(response.body.error).toHaveProperty("schemaErrors")
            expect(response.body.error.schemaErrors.length).toEqual(1)
            expect(response.body.error.schemaErrors[0]).toContain("year")

        })


    })









});


afterAll(async function () {
    await db.end();
  });