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
            title: 'CMS Application',
            users: users,
        });
    } catch (err) {
        console.error(err);
        res.json({ message: err.message });
    }
});


router.get('/add', (req,res) => {
    res.render('add_users', {title: "CMS- Add User"})
})

// Edit user
router.get('/edit/:id', async (req, res) => {
    const id = req.params.id; 
    try {
        const user = await User.findById(id); 
        if (!user) {
            return res.redirect('/'); 
        }
        res.render('edit_users', {
            title: "CMS- Edit User",
            user: user, 
        });
    } catch (err) {
        console.error(err); 
        res.redirect('/'); 
    }
});

// Update user Post request
router.post('/update/:id', upload, async (req, res) => {
    const id = req.params.id.trim(); 
    try {
        await User.findByIdAndUpdate(id, {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            company: req.body.company,
            jobtitle: req.body.jobtitle,
        });
        req.session.message = {
            type: 'success',
            message: 'User updated successfully!',
        };

        res.redirect('/'); 
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Delete user route
router.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id.trim(); 
        const result = await User.findByIdAndDelete(id); 
        if (!result) {
            req.session.message = {
                type: 'danger',
                message: 'User not found!',
            };
        } else {
            req.session.message = {
                type: 'info',
                message: 'User deleted successfully!',
            };
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.json({ message: err.message, type: 'danger' });
    }
});

module.exports = router;
