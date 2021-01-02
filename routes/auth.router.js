const { Router } = require('express')
const User = require('../models/User')
const config = require('config')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const router = Router()
const jwt = require('jsonwebtoken');
router.post(
    '/register', 
    [
        check('email', 'Email is not correct!').isEmail()
    ]
    ,
async (req, res) => {
    try {
        const errors = validationResult(req)
       
        if(!errors.isEmpty()){
            res.status(400).json({message: 'Data is not correct', errors: errors.array()})
        }

        const {email, password} = req.body;

        const candidat = await User.findOne({email})
        
        if(candidat){
            return res.status(400).json({ message: 'MAIL is using'})
        }

        const dePassword = await bcrypt.hash(password, 10)
        const user = new User({ email, password: dePassword })
       
        await user.save()
        res.status(201).json({message: 'User create' })

    } catch (error) {
         res.status(500).json({ message: 'Server error 500' })
    }
})


router.post(
    '/login', 
    [
        check('email', 'Email is not correct!').isEmail().normalizeEmail(),
        check('password', 'Password is not correct!').exists()
    ],
async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
           return res.status(400).json({message: 'Data is not correct', errors: errors.array()})
        }
       
        const {email, password} = req.body

        const user = await User.findOne({ email })

        if (!user){
           return res.status(400).json({message: 'User not faund'})
        }

        const isMath = await bcrypt.compare(password, user.password)

        if (!isMath){
            return(res.status(400).json({message: 'Password is not correct'}))
        }
        const token = jwt.sign({
            userId: user.id
          }, config.get('jwtSecret'), { expiresIn: '1h' });
         
        res.json({ token, userId: user.id })
    } catch (error) {
         res.status(500).json({ message: 'Server error 500' })
    }
})


module.exports = router