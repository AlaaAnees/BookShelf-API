const express = require("express");
const router = express.Router();
const CartController = require("../Controllers/CartController");

router.get("", CartController.GetUserCart);
router.post("/add-book", CartController.AddBookToCart);
router.patch("/decrement-book", CartController.DecrementBookFromCart);
router.delete("/remove-book", CartController.RemoveBookFromCart);

router.patch("/check-out", CartController.CheckOut);

module.exports = router;
