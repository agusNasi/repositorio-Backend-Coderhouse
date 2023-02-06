const mongoose = require('mongoose');
const { productsCollection } = require('./products.models');

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: productsCollection,
                },
                quantity:{
                    type: Number,
                    default: 1,
                    required: true
                }
            }

        ],
        default: [],
        required: true
    }
});

cartSchema.pre('find', function(){
    this.populate('products.product')
})

cartSchema.pre('findOne', function(){
    this.populate('products.product')
})



const CartModel = mongoose.model(cartsCollection, cartSchema);

module.exports = CartModel;