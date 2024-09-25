const express=require('express')
const router=express.Router()
const {
    createOrder,
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder
}=require('../controllers/orderController')


//get all the orders
router.get('/',getOrders)

//get a order
router.get('/:id',getOrder)

//add a order
router.post('/',createOrder)

//delete a order
router.delete('/:id',deleteOrder)

//update a order
router.patch('/:id',updateOrder)

module.exports=router
