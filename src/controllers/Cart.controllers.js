const cartCtrl = {};
const modelCart = require('../models/Cart');

cartCtrl.aggregateCourse = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

cartCtrl.deleteCourse = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

cartCtrl.getCartCourse = async (req, res) => {
    try {
        const cartUser = await modelCart.find({idUser: req.params.idUser}).populate('idUser').populate({ path: 'courses.course', model: "course" });
        console.log(cartUser);
        res.status(200).json(cartUser);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

module.exports = cartCtrl;