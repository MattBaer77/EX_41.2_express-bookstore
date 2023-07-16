
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
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Sample Author 1",
            "language": "english",
            "pages": 264,
            "publisher": "Sample Publisher 1",
            "title": "Sample Title 1",
            "year": 2020
        };

        const sampleBook2 = {
            "isbn": "0691161519",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Sample Author 2",
            "language": "english",
            "pages": 265,
            "publisher": "Sample Publisher 2",
            "title": "Sample Title 2",
            "year": 2021
        };

        const sampleBook3 = {
            "isbn": "0691161520",
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

        test("can get all", async() => {

            let response = await request(app).get("/books")
            expect(response.body.books.length).toEqual(3)


        })

    })









});


afterAll(async function () {
    await db.end();
  });