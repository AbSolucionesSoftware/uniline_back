const userCtrl = {};
const modelUser = require('../models/User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

userCtrl.createUser = async (req,res) => {
    try {
        const {name,email,password,resetPassword,acceptPolicies} = req.body;

        const newUser = new modelUser();

        if(acceptPolicies){
            if(!password || !resetPassword){
                res.status(404).json({message: "The password is required."});
            }else{
                if(password === resetPassword){
                    bcrypt.hash(password, null, null, function(err, hash) {
						if (err) {
							res.status(500).json({ message: 'Error encrypting the password.', err });
						} else {
                            newUser.name = name;
                            newUser.email = email;
                            newUser.policies = true;
                            newUser.type = 'Estudiante';
                            newUser.sessiontype = 'Firebase';
							newUser.password = hash;
							newUser.save((err, userStored) => {
								if (err) {
									res.status(500).json({ message: 'Ups, algo paso al registrar el usuario', err });
								} else {
									if (!userStored) {
										res.status(404).json({ message: 'Error al crear el usuario' });
									} else {
										const token = jwt.sign(
											{
												email: newUser.email,
												name: newUser.name,
												_id: newUser._id,
												sessiontype: newUser.sessiontype,
												rol: false
											},
											process.env.AUTH_KEY
										);
										console.log('Token: ' + token);
										res.json({ token });
									}
								}
							});
						}
					});
                }else{
                    res.status(500).json({message: "The passwords are not the same."});
                }
            }
        }else{
            res.status(500).json({message: "The policies is required."});
        }

    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
}

userCtrl.getUser = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
}

userCtrl.editUser = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
}

userCtrl.courseUser = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
}

userCtrl.signInUser = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
}

userCtrl.resetPassword = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
}

userCtrl.verifyResetPassword = async (res,req) => {
    try {
        
    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
}

userCtrl.userFirebaseSign = async (res,req) => {
    try {
        
    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
}


module.exports = userCtrl;

