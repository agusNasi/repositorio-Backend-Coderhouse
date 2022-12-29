const { Router } = require('express');
const ProductManager = require('../../script');
const products = new ProductManager('./data/cart.json');

const router = Router();

router.post('/', (req, res) => {
    const ProductManager = async () => {
        const addCart = await products.addCart();

        res.send({
            status: 'successfully',
            payload: addCart
        });
    }

    ProductManager();
})

router.get('/:cid', (req, res) => {
    const ProductManager = async () => {
        let consulta = req.params.cid;
        const selectedCart = await products.getProductById(+consulta);

        if (selectedCart) {
            res.send({
                status: 'successfully',
                payload: selectedCart
            })
        } else {
            res.status(404).send({ status: 'error', error: 'ese id no existe' });
        }


    }

    ProductManager();
})

router.post('/:cid/products/:pid', (req, res) => {
    const ProductManager = async () => {
        const cid = Number(req.params.cid);
        const pid = Number(req.params.pid);
        const data = await products.updateCart(cid, pid);

        if (isNaN(cid) || isNaN(pid)) {
            res.status(400).send("ambos parametros deben ser numeros");
        } else {
            res.json({
                status: "success",
                data: data
            });
        }
    }

    ProductManager();
})



module.exports = router;



