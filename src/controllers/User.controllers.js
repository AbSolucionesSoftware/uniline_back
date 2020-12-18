const userCtrl = {};

userCtrl.createUser = async (req,res) => {
    console.log("si llego");
    res.status(200).json({message: "si llego"})
}

module.exports = userCtrl;