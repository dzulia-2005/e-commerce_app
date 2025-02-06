const express = require('express');
const router = express.Router();
const { createCard,deleteCard,
    editCard,getAllCard,
    getUserCard,favoriteCard,unfavoriteCard,
    getoneCard,searchCard
} = require("../controllers/cardcontroller");

//create card
router.post("/create",createCard );

//delete card
router.delete("/delete/:postId", deleteCard);

//edit card
router.put('/update/:postId',editCard);

//get all card
router.get("/getallcards/:userId",getAllCard);

//get user cards
router.get("/getusercards/:userId",getUserCard);

//favorite card
router.post("/favorite/:postId",favoriteCard);

//Unfavorite card
router.post("/unfavorite/:postId",unfavoriteCard);

//search card
router.get("/search/:query", searchCard);
 
//get one post
router.get("/getonepost/:postId", getoneCard);

module.exports = router;