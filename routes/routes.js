const express = require("express");
const router  = express.Router();
const User = require('../models/users');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, '/uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+ file_originalname);
    }
});

var upload = multer({
    storage: storage,
}).single('image');

router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            company: req.body.company,
            jobtitle: req.body.jobtitle,
        });

        await user.save(); 

        req.session.message = {
            type: 'success',
            message: 'User added successfully!',
        };

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.json({ message: err.message, type: 'danger' });
    }
});

//Get all users

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    } catch (err) {
        console.error(err);
        res.json({ message: err.message });
    }
});


router.get('/add', (req,res) => {
    res.render('add_users', {title: "Add users"})
})
module.exports = router;
