const payCtrl = {};
const modelPay = require("../models/Pay");

payCtrl.createPay = async (req,res) => {
    try {
        console.log(req.body);
    } catch (error) {
        res.status(505).json({ message: "Error del servidor", error });
        console.log(error);
    }
}

module.exports = payCtrl;