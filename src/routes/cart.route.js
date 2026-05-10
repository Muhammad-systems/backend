import express from 'express'
import { isUser } from '../middlewares/user.auth.middleware.js'
import { addToCart,removeCart,updateCart,viewCart } from '../controllers/cart.controller.js'

export const cartRouter = express.Router()


cartRouter.post('/add-to-cart/:id',isUser,addToCart)
cartRouter.post('/view-cart',isUser,viewCart)
cartRouter.post('/remove-cart/:id',isUser,removeCart)
cartRouter.post('/update-cart/:id',isUser,updateCart)





 
