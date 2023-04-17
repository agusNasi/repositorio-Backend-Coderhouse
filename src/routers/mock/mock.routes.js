const { Router } = require('express')
const generateProduct = require('../../mocks/mock.js')
const { apiSuccessResponse } = require('../../utils/api.utils.js')
const HTTP_STATUS = require('../../constants/api.constants.js')

const router = Router()

router.get('/', (req, res) =>{
    const products = Array.from({ length: 100}, () => generateProduct())
    const response = apiSuccessResponse(products)
    return res.status(HTTP_STATUS.OK).json(response)
})

module.exports = router