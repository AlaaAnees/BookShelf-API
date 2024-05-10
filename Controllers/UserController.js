const AuthModel = require('../Models/AuthModel');

const AuthController = require("../Controllers/AuthController")
const { json } = require('express');
const BookModel = require('../Models/BookModel');



let GetUserById = async (userID) => {
    return await AuthModel.findOne({ _id: userID })
}

let GetUserData = async (req, res, next) => {

    let userID = await AuthController.decodeToken(req, res)

    let user = await GetUserById(userID)

    res.send({
        name: user.name,
        email: user.email,
        favourite: user.favourite,
        purchased: user.purchased
    })
}


let AddToFavourites = async (req, res, next) => {
    let bookId = req.body.bookId
    let userID = await AuthController.decodeToken(req, res)
    if (userID) {
        let user = await GetUserById(userID)
        let Book = await BookModel.findOne({ _id: bookId }, { title: 1, price: 1, authors: 1, pageCount: 1, thumbnailUrl: 1, _id: 0 })
        user.favourite.push(Book)
        await user.save()
        res.send({ message: "Added To Favourites" })
    } else {
        res.send({ message: "user not logged in" })

    }

}
let RemoveFromFavourites = async (req, res, next) => {
    let { bookId } = req.body

    let userID = await AuthController.decodeToken(req, res)
    if (userID) {

        let user = await GetUserById(userID)
        let Book = await BookModel.findOne({ _id: bookId }, { title: 1, price: 1, authors: 1, pageCount: 1, thumbnailUrl: 1, _id: 0 })

        for (let i = 0; i < user.favourite.length; i++) {
            if (JSON.stringify(user.favourite[i]) == JSON.stringify(Book)) {
                user.favourite.splice(i, 1)
                await user.save()
                return res.send({ message: "Removed From Favourites" })

            }
        }
    } else {
        return res.send({ message: "user not logged in" })
    }

}

let checkIfFavourite = async (req, res, next) => {
    let { bookId } = req.body
    let userID = await AuthController.decodeToken(req, res)
    if (userID) {
        let user = await GetUserById(userID)
        let Book = await BookModel.findOne({ _id: bookId }, { title: 1, price: 1, authors: 1, pageCount: 1, thumbnailUrl: 1, _id: 0 })


        let found = user.favourite.find((fav, i) => {
            return JSON.stringify(Book) === JSON.stringify(fav)
        })

        if (found) {
            res.send({ favourited: true })

        } else {
            res.send({ favourited: false })

        }
    } else {
        res.send({ message: "user not logged in" })

    }


}

module.exports = {

    GetUserData,
    GetUserById,

    AddToFavourites,
    RemoveFromFavourites,
    checkIfFavourite
}

