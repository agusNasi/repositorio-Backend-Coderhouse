const { Router } = require('express')

const router = Router()

router.get('/', (req, res) =>{
    req.logger.fatal('Prueba fatal')
    req.logger.error('Prueba error')
    req.logger.warning('Prueba warning')
    req.logger.info('Prueba info')
    req.logger.http('Prueba http')
    req.logger.debug('Prueba debug')
    return res.send('Logger Test')
})

module.exports = router