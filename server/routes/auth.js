const express = require('express');
const router = express.Router();
const {
    SignUpController,SignInController,
    LogoutController,meController,refreshController
} = require("../controllers/authcontroller");


//register user
router.post('"/signup',SignUpController);

//login user
router.post("/signin",SignInController);

//logout
router.get("/logout",LogoutController);

//me
router.get("/me",meController);

//refreshTOken
router.post("/refresh",refreshController);

module.exports = router;