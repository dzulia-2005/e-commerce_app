const multer = require("multer");

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,"uploads/");
    },
    filename : (req,file,cb) => {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null , uniquesuffix + "-" + file.originalname)
    }   
}) 

const upload = multer({storage:storage});

module.exports = upload;