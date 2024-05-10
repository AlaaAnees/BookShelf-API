const AuthController=require("./AuthController")
const UserController=require("./UserController")
const BookModel=require("../Models/BookModel")


const GetAllBooks=async(req,res,next)=>{
    let books= await BookModel.find({})
    // for(let i=0;i<books.length;i++){
    //     books[i].review=[]
    //     await books[i].save()
    // }
    res.send(books)
}
const GetBookById=async(req,res,next)=>{
  let  bookId=req.params.id
  let book= await BookModel.findOne({_id:bookId})
  res.send(book)
}
const GetBookByTitle=async(req,res,next)=>{
    let  bookTitle=req.params.title
    let book= await BookModel.findOne({title:bookTitle})
    res.send(book)
  }
  const GetBooksByAuthor=async(req,res,next)=>{
    let  bookAuthor=req.params.author
    let books= await BookModel.find({authors:{ $elemMatch: { $eq: bookAuthor }}})
    res.send(books)
  }

  const GetBooksByGenre=async(req,res,next)=>{
    let  bookGenre=req.params.genre
    let books= await BookModel.find({categories:{ $elemMatch: { $eq: bookGenre }}})
    res.send(books)
  }


  const GetBooksCategories=async(req,res,next)=>{
    let categoriesArrays= await BookModel.find({},{categories:1,_id:0})
    let uniqueCategories=[]
    categoriesArrays.forEach((catObject)=>{
        catObject.categories.forEach((category)=>{
            if(!uniqueCategories.includes(category)){
                uniqueCategories.push(category)
            }
        })

    })

    res.send(uniqueCategories)
  }
  const GetBooksAuthors=async(req,res,next)=>{
    let authorArrays= await BookModel.find({},{authors:1,_id:0})
    let uniqueauthor=[]
    authorArrays.forEach((authObject)=>{
        authObject.authors.forEach((author)=>{
            if(!uniqueauthor.includes(author)){
                uniqueauthor.push(author)
            }
        })

    })

    res.send(uniqueauthor)
  }


  ///handling reviews
  
    const GetBookReviews=async(req,res,next)=>{
    let {bookId}=req.params
    let reviews= await BookModel.findOne({_id:bookId},{review:1,_id:0})
    res.send(reviews)
  }

  const PostReview=async(req,res,next)=>{
    let {stars,comment,bookId}=req.body
    let userId = await AuthController.decodeToken(req)
    let user = await UserController.GetUserById(userId)
    let book= await BookModel.findOne({_id:bookId})
    
    book.review.push({userName:user.name,stars,comment})
    await book.save()
    res.send(book.review)
  }

  const checkForUserReviews=async(req,res,next)=>{
    let {bookId}=req.params
    let userId = await AuthController.decodeToken(req)
    let user = await UserController.GetUserById(userId)
    let book= await BookModel.findOne({_id:bookId})

   let purchasedCheck= user.purchased.find((item)=>{
      return item.book._id==book._id
    })
    let found=book.review.find((review)=>{
    return  review.userName==user.name
    })
    if(purchasedCheck){
      if(found){
        return res.send({reviewed:true})
      }else{
        return res.send({reviewed:false})
  
      }
    }else{
      return res.send({purchased:false})

    }
 

  }

module.exports={
    GetAllBooks,
    GetBookById,
    GetBookByTitle,
    GetBooksByAuthor,
    GetBooksByGenre,
    GetBooksCategories,
   GetBooksAuthors,
   checkForUserReviews,
   PostReview,
   GetBookReviews
}