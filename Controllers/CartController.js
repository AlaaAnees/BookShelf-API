const UserController = require("./UserController")
const AuthController = require("./AuthController")
const BookModel = require("../Models/BookModel")
const { checkout } = require("../Routes/AuthRoutes")


const GetUserCart = async (req, res, next) => {

    let userId = await AuthController.decodeToken(req)
  
        let user = await UserController.GetUserById(userId)
        totalPrice = 0;
        user.cart.forEach((object) => {
            totalPrice = totalPrice + (object.book.price * object.quantity)
        })
        res.send({ cart: user.cart, totalPrice })


}
const AddBookToCart = async (req, res, next) => {

    let { bookId } = req.body
    let date = new Date()

    let userId = await AuthController.decodeToken(req)

   
        let user = await UserController.GetUserById(userId)
        let book = await BookModel.findOne({ _id: bookId }, { quantity: 0, })


        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].book._id == bookId) {
                user.cart[i].quantity = user.cart[i].quantity + 1;
                user.markModified('cart');
                await user.save();
                return res.send(user.cart);
            }
        }

        user.cart.push({ book, date, quantity: 1 })
        await user.save()

        res.send(user.cart)
    
 
}
const DecrementBookFromCart = async (req, res, next) => {

    let { bookId } = req.body
    let userId = await AuthController.decodeToken(req)
    let user = await UserController.GetUserById(userId)

    for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].book._id == bookId) {
            user.cart[i].quantity = user.cart[i].quantity - 1;
            if (user.cart[i].quantity == 0) {
                user.cart.splice(i, 1)
            }
            user.markModified('cart');
            await user.save();
            return res.send(user.cart);
        }
    }



    res.send(user.cart)
}
const RemoveBookFromCart = async (req, res, next) => {

    let { bookId } = req.body
    let userId = await AuthController.decodeToken(req)
    let user = await UserController.GetUserById(userId)

    for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].book._id == bookId) {

            user.cart.splice(i, 1)

            user.markModified('cart');
            await user.save();
            return res.send(user.cart);
        }
    }



    res.send(user.cart)
}
const CheckOut = async (req, res, next) => {

    let userId = await AuthController.decodeToken(req)
    let user = await UserController.GetUserById(userId)


    for (let i = 0; i < user.cart.length; i++) {
        //add to purchased 
        user.purchased.push(user.cart[i])
        //decrement available book quantity
        let bookId = user.cart[i].book._id
        let book = await BookModel.findOne({ _id: bookId })
        book.quantity = book.quantity - user.cart[i].quantity
        book.markModified('quantity')
        await book.save()

    }
    //reset cart 
    user.cart = []
    await user.save()

    res.send(user.cart)
}

module.exports = {
    GetUserCart,
    AddBookToCart,
    DecrementBookFromCart,
    CheckOut,
    RemoveBookFromCart
}