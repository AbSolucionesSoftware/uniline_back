const payCtrl = {};
const { model } = require("../models/Pay");
const modelPay = require("../models/Pay");

payCtrl.createPay = async (req,res) => {
    try {
        console.log(req.body);
        const {idStripe,courses,username,idUser,total, typePay} = req.body;
        const newPay = new modelPay({
            stripeObject: idStripe._id,
            idUser: idUser,
            nameUser: username,
            typePay:typePay,
            statusPay: false,
            total: total,
            amount: Math.round(100 * parseFloat(total)),
            courses: courses
        });
        await newPay.save((err, userStored) => {
			if (err) {
				res.status(500).json({ message: 'Ups, algo paso', err });
			} else {
				if (!userStored) {
					res.status(404).json({ message: 'Error' });
				} else {
					res.status(200).json({ message: 'Todo correcto', userStored: userStored._id });
				}
			}
		});
    } catch (error) {
        res.status(505).json({ message: "Error del servidor", error });
        console.log(error);
    }
}

module.exports = payCtrl;