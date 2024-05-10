const express = require("express");
const router = express.Router();
const BookController= require("../Controllers/BookController")

router.get("/all",BookController.GetAllBooks)

//search
router.get("/id/:id",BookController.GetBookById)
router.get("/title/:title",BookController.GetBookByTitle)

router.get("/author/all",BookController.GetBooksAuthors)
router.get("/author/:author",BookController.GetBooksByAuthor)

//filter
router.get("/genre/all",BookController.GetBooksCategories)
router.get("/genre/:genre",BookController.GetBooksByGenre)

router.get("/review-check/:bookId",BookController.checkForUserReviews)
router.post("/add-review",BookController.PostReview)
router.get("/reviews/:bookId",BookController.GetBookReviews)





module.exports = router;
