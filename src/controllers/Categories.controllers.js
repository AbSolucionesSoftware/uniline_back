const categoriesCtrl = {};
const modelCategories = require('../models/Categories');

categoriesCtrl.getCategories = async (req,res) => {
    try {
        const categories = await modelCategories.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

categoriesCtrl.agregateCategorie = async (req,res) => {
    try {
        const newCategories = new modelCategories(req.body);
        await newCategories.save();
        res.status(200).json({message: "Categoria agregada."})
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

categoriesCtrl.editCategories = async (req,res) => {
    try {
        await modelCategories.findByIdAndUpdate(req.params.idCategorie,req.body);
        res.status(200).json({message: 'Categoria editada.'});
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

categoriesCtrl.deleteCategories = async (req,res) => {
    try {
        const categorie = await modelCategories.findById(req.params.idCategorie);
        if(categorie){
            await modelCategories.findByIdAndDelete(req.params.idCategorie);
            res.status(200).json({messege: "Categoria eliminada"});
        }else{
            res.status(404).json({messege: "Categoria no existe"});
        }

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

module.exports = categoriesCtrl;