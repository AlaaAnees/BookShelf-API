const express = require("express");
const router = express.Router();
const UsersController= require("../Controllers/UserController")


router.get("/profile",UsersController.GetUserData)
router.post("/add-favourite",UsersController.AddToFavourites)
router.post("/delete-favourite",UsersController.RemoveFromFavourites)
router.post("/check-favourite",UsersController.checkIfFavourite)




module.exports = router;
