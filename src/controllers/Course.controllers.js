const courseCtrl = {};

courseCtrl.getCourses = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(505).json({message: "Error del servidor",error});
        console.log(error);
    }
}

courseCtrl.getCourse = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(505).json({message: "Error del servidor",error});
        console.log(error);
    } 
}

courseCtrl.createCourse = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(505).json({message: "Error del servidor",error});
        console.log(error);
    }
}

module.exports = courseCtrl;