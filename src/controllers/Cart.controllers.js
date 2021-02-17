const cartCtrl = {};
const modelCart = require('../models/Cart');

cartCtrl.aggregateCourse = async (req, res) => {
    try {
        const { idCourse } = req.body;
        console.log(req.body);
        const userBase = await modelCart.findOne({idUser: req.params.idUser});
        if(userBase){
            await modelCart.updateOne(
                {
                    _id: userBase._id
                },
                {
                    $addToSet: {
                        courses: [
                            {
                                course: idCourse
                            }
                        ]
                    }
                },
                async (err, response) => {
                    if(err){
                        res.status(500).json({ message: 'Ups, algo paso al agregar curso.', err });
                    } else {
                        if(!response){
                            res.status(404).json({ message: 'Error al agregar.' });
                        }else{
                            res.status(200).json({ message: 'Curso agregado.' });
                        }
                    }
                }
            );
        }else{
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }
       
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

cartCtrl.deleteCourse = async (req, res) => {
    try {
        const userBase = await modelCart.findOne({idUser: req.params.idUser});
        if(userBase){
            await modelCart.updateOne(
                {
                    _id: userBase._id
                },
                {
                    $pull: {
                        courses: {
                            course: req.params.idCurse
                        }
                    }
                },
                async (err, response) => {
                    if(err){
                        res.status(500).json({ message: 'Ups, algo paso al eliminar curso.', err });
                    } else {
                        if(!response){
                            res.status(404).json({ message: 'Error al eliminar.' });
                        }else{
                            res.status(200).json({ message: 'Curso eliminado.' });
                        }
                    }
                }
            )
        }else{
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

cartCtrl.getCartCourse = async (req, res) => {
    try {
        const cartUser = await modelCart.findOne({idUser: req.params.idUser}).populate('idUser').populate({ path: 'courses.course', model: "course" });
        console.log(cartUser);
        res.status(200).json(cartUser);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

cartCtrl.deleteCart = async (req,res) => {
    try {
        const userBase = await modelCart.findOne()
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

module.exports = cartCtrl;