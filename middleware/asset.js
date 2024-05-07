const multer = require("multer");

const multerFunction =  () => {

    const multer_function = multer().single("file");
    return multer_function;
  
};

module.exports = {
    multerFunction,
};
