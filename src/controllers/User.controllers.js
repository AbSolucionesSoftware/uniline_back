const userCtrl = {};
const modelUser = require("../models/User");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const uploadFile = require("../middleware/awsFile");

userCtrl.uploadFile = async (req, res, next) => {
  try {
    await uploadFile.upload(req, res, function (err) {
      if (err) {
        res.status(500).json({ message: err });
      }
      return next();
    });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

userCtrl.createUser = async (req, res) => {
  try {
    const { name, email, password, repeatPassword, acceptPolicies } = req.body;
    const newUser = new modelUser();

    if (acceptPolicies) {
      if (!password || !repeatPassword) {
        res.status(404).json({ message: "The password is required." });
      } else {
        if (password === repeatPassword) {
          bcrypt.hash(password, null, null, function (err, hash) {
            if (err) {
              res.status(500).json({ message: "Error encrypting the password.", err });
            } else {
              newUser.name = name;
              newUser.email = email;
              newUser.policies = true;
              newUser.type = "Estudiante";
              newUser.sessiontype = "ApiRest";
              newUser.password = hash;
              newUser.save((err, userStored) => {
                if (err) {
                  res
                    .status(500)
                    .json({
                      message: "Ups, algo paso al registrar el usuario",
                      err,
                    });
                } else {
                  if (!userStored) {
                    res
                      .status(404)
                      .json({ message: "Error al crear el usuario" });
                  } else {
                    const token = jwt.sign(
                      {
                        email: newUser.email,
                        name: newUser.name,
                        imagen: newUser.urlImage ? newUser.urlImage : null,
                        _id: newUser._id,
                        sessiontype: newUser.sessiontype,
                        rol: newUser.type,
                      },
                      process.env.AUTH_KEY
                    );
                    console.log("Token: " + token);
                    res.json({ token });
                  }
                }
              });
            }
          });
        } else {
          res.status(500).json({ message: "The passwords are not the same." });
        }
      }
    } else {
      res.status(500).json({ message: "The policies is required." });
    }
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

userCtrl.createTeacher = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    const userBase = await modelUser.findById(idUser);
    const newTeacher = userBase;

    newTeacher.type = "Maestro";
    await modelUser.findByIdAndUpdate(idUser, newTeacher);
    const userUpdate = await modelUser.findById(idUser);
    const token = jwt.sign(
      {
        email: userUpdate.email,
        name: userUpdate.name,
        imagen: userUpdate.urlImage ? userUpdate.urlImage : null,
        _id: userUpdate._id,
        sessiontype: userUpdate.sessiontype,
        rol: userUpdate.type,
      },
      process.env.AUTH_KEY
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

userCtrl.getUser = async (req, res) => {
  try {
    const userBase = await modelUser.findById(req.params.idUser);
    if (userBase) {
      res.status(200).json(userBase);
    } else {
      res.status(500).json({ messege: "Este usuario no existe" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

userCtrl.editUser = async (req, res) => {
  try {
    const userBase = await modelUser.findById(req.params.idUser);
    const updateUser = req.body;
    if (userBase) {
      if (req.file) {
        updateUser.keyImage = req.file.key;
        updateUser.urlImage = req.file.location;
        if (userBase.keyImage) {
          uploadFile.eliminarImagen(userBase.keyImage);
        }
      } else {
        if (userBase.keyImage) {
          updateUser.keyImage = userBase.keyImage;
          updateUser.urlImage = userBase.urlImage;
        }
      }
      await modelUser.findByIdAndUpdate(req.params.idUser, updateUser);

      const userUpdate = await modelUser.findById(req.params.idUser);
      const token = jwt.sign(
        {
          email: userUpdate.email,
          name: userUpdate.name,
          imagen: userUpdate.urlImage ? userUpdate.urlImage : null,
          _id: userUpdate._id,
          sessiontype: userUpdate.sessiontype,
          rol: userUpdate.type,
        },
        process.env.AUTH_KEY
      );
      res.status(200).json({ token });
    } else {
      res.status(500).json({ message: "Este usuario no existe" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

userCtrl.courseUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

userCtrl.signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const userBase = await modelUser.findOne({ email: email });

    if (userBase) {
      if (!bcrypt.compareSync(password, userBase.password)) {
        res.status(404).json({ message: "Contraseña incorrecta" });
      } else {
        const token = jwt.sign(
          {
            email: userBase.email,
            name: userBase.name,
            imagen: userBase.urlImage ? userBase.urlImage : null,
            _id: userBase._id,
            sessiontype: userBase.sessiontype,
            rol: userBase.type,
          },
          process.env.AUTH_KEY
        );
        //token
        res.json({ token });
      }
    } else {
      res.status(404).json({ message: "Este usuario no existe." });
    }
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

userCtrl.resetPassword = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

userCtrl.verifyResetPassword = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

userCtrl.userFirebaseSign = async (req, res) => {
  try {
    const { email, name } = req.body;
    console.log(req.body);
    const userBase = await modelUser.findOne({ email: email });
    if (userBase) {
      console.log("entro a existente");

      if (userBase.sessiontype === "Firebase") {
        if (!bcrypt.compareSync(email, userBase.password)) {
          res.status(500).json({ message: "Contraseña incorrecta" });
        } else {
          const token = jwt.sign(
            {
              email: userBase.email,
              name: userBase.name,
              imagen: userBase.urlImage,
              _id: userBase._id,
              sessiontype: userBase.sessiontype,
              rol: userBase.type,
            },
            process.env.AUTH_KEY
          );
          //token
          res.json({ token });
        }
      } else {
        res.status(500).json({ message: "Este usuario es invalido invalido." });
      }
    } else {
      console.log("Entro a registro");
      const newUser = new modelUser();
      bcrypt.hash(email, null, null, function (err, hash) {
        if (err) {
          res.status(500).json({ message: "Parece que paso un error.", err });
        } else {
          newUser.name = name;
          newUser.email = email;
          newUser.policies = true;
          newUser.type = "Estudiante";
          newUser.sessiontype = "Firebase";
          newUser.password = hash;
          newUser.save((err, userStored) => {
            if (err) {
              res
                .status(404)
                .json({
                  message: "Ups, algo paso al registrar el usuario",
                  err,
                });
            } else {
              if (!userStored) {
                res.status(404).json({ message: "Error al crear el usuario" });
              } else {
                const token = jwt.sign(
                  {
                    email: newUser.email,
                    name: newUser.name,
                    imagen: newUser.urlImage ? newUser.urlImage : null,
                    _id: newUser._id,
                    sessiontype: newUser.sessiontype,
                    rol: newUser.type,
                  },
                  process.env.AUTH_KEY
                );
                res.json({ token });
              }
            }
          });
        }
      });
    }

  } catch (error) {
    console.log(error);
  }
};

userCtrl.resetPasswordUserSession = async (req,res) => {
  try {
    const {currentPassword,password,repeatPassword} = req.body;
    const userBase = await modelUser.findById(req.params.idUser);
    const newUser = userBase;
    if(userBase){
      if(password === repeatPassword){
        bcrypt.hash(currentPassword, null, null, function (err, hash) {
          if (err) {
            res.status(500).json({ message: "Error al encriptar la contraseña", err });
          } else {
            newUser.contrasena = hash;
            newUser.save((err, userStored) => {
              if (err) {
                res.status(500).json({message: "Ups, algo paso al registrar el usuario",err,});
              } else {
                if (!userStored) {
                  res.status(404).json({ message: "Error al crear el usuario" });
                } else {
                  const userUpdate = await modelUser.findById(req.params.idUser);
                  const token = jwt.sign(
                    {
                      email: userUpdate.email,
                      name: userUpdate.name,
                      imagen: userUpdate.urlImage ? userUpdate.urlImage : null,
                      _id: userUpdate._id,
                      sessiontype: userUpdate.sessiontype,
                      rol: userUpdate.type,
                    },
                    process.env.AUTH_KEY
                  );
                  res.json({ token });
                }
              }
            });
          }
        });
      }else{
        res.status(504).json({message: "Las contraseñas no son iguales."});
      }
    }else{
      res.status(504).json({message: "Este usuario no existe."});
    }
  } catch (error) {
    
  }
}

module.exports = userCtrl;
