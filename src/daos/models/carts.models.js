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



const CartModel = mongoose.model(cartsCollection, cartSchema);

module.exports = CartModel;