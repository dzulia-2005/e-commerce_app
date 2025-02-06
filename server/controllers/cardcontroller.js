const User = require("../models/user");
const Card =require("../models/card")
const {CustomError} = require("../middlewares/errors");

const generateFileUrl = (filename) => {
    return process.env.URL+`/uploads/${filename}`
}

const createCard = async(req,res,next)=> {
    const {userId} = req.params;
    const { caption ,price,location,HouseSize,HouseSquart,postalCode,TransactionType} = req.body;
    const files = req.files;
    try {
        const user = await User.findById(userId);
        if(!user) throw new CustomError("user not found",404);
        const imageurl = files && files.length > 0
            ? files.map((file)=> generateFileUrl(file.filename))
            : [];
        const newCard = new Card({
            user:userId,
            caption,
            price,
            location,
            HouseSize,
            HouseSquart,
            postalCode,
            TransactionType,
            image:imageurl,
        });
        await newCard.save()
        res.status(201).json({
            message : "post created successfully",
        })
    } catch (error) {
        next(error)
    }
}

const deleteCard = async(req,res,next)=>{
    const {postId} = req.params;
    try {
        const deleteCard = await Card.findById(postId);
        if(!deleteCard) return next(new CustomError("post not found",404));
        const user = await User.findById(deleteCard.user);
        if(!user) return next(new CustomError("user not found",404));
        user.card = user.card.filter(
            (id)=>id.toString() !== deleteCard._id.toString()
        )
        await user.save();
        await deleteCard.deleteOne();
        res.status(200).json({message:"post deleted successfully"});
    } catch (error) {
        next(error);
    }
}

const editCard = async(req,res,next) => {
    const {postId} =req.params;
    const {caption,price,location,HouseSize,HouseSquart,postalCode,TransactionType} = req.body;
    const image = req.files || [];
    try {
        const updateToPost = await Card.findById(postId);
        if(!updateToPost) return next(new CustomError("post not found", 404))

        const updatedFields = {};

        if(caption) updatedFields.caption = caption;
        if(price) updatedFields.price = price;
        if(location) updatedFields.HouseSize=HouseSize;
        if(HouseSquart) updatedFields.HouseSquart=HouseSquart;
        if(postalCode) updatedFields.postalCode=postalCode;
        if(TransactionType) updatedFields.TransactionType=TransactionType;

        if(image.length > 0){
            const newImages = image.map((file)=>generateFileUrl(file.filename))
            updatedFields.image = newImages;
        }

        const updateCard = await Card.findByIdAndUpdate(
            postId,
            { $set : updatedFields },
            {new:true}
        )

        res.status(201).json({message:"card updated successfully",card:updateCard});
    } catch (error) {
        next(error);
    }
}

const getAllCard = async(req,res,next)=> {
    try {
        const card = await Card.find()
            .populate("user", "profilePicture username")
        if(!card || card.length === 0) return res.status(200).json({message:"no card found",card:[]});
        res.status(200).json({message:"post fetched successfully",card})  
    } catch (error) {
        next(error);
    }
}

const getUserCard = async(req,res,next) => {
    const {userId} = req.params;
    try {
        const post = await Card.find({user:userId})
            .populate("user","profilePicture username")
        if(!post || post.length === 0) return res.status(200).json({message:"no post found for the user",post:[]});
        res.status(200).json({
            message:"user post fetched successfully",
            post,
        })
    } catch (error) {
        next(error);
    }
}

const favoriteCard = async(req,res,next) => {
    const {userId} = req.body;
    const {postId} = req.params;
    try {
        const card = await Card.findById(postId);
        if(!card) throw new CustomError("post not found",404);
        
        const user = await User.findById(userId);
        if(!user) throw new CustomError("user not found",404);
        if(card.likes.includes(userId)) throw new CustomError("u have already liked this post",404);
        card.likes.push(userId);
        await card.save();
        res.status(200).json({message:"post liked successfully"});
    } catch (error) {
        next(error);
    }
}

const unfavoriteCard = async(req,res,next) => {
    const {userId} = req.body;
    const {postId} = req.params;
    try {
        const card = await Card.findById(postId);
        if(!card) throw new CustomError("post not found",404);
        const user = await User.findById(userId);
        if(!user) throw new CustomError("User not found",404);
        if(!user.likes.includes(userId)) throw new CustomError("you have not liked this card yet",400);
        card.likes = card.likes.filter((id)=>id.toString() !== userId.toString());
        await card.save();
        res.status(200).json({message:"card unliked successfully"});
    } catch (error) {
        next(error);
    }
}

const getoneCard = async(req,res,next) => {
    try {
        const {postId}=req.params;
        const card = await Card.findById(postId)
        if(!card) return res.status(404).json({message:"post not found"});
        res.status(200).json(card);
       } catch (error) {
        next(error)
       }
}

const searchCard =async(req,res,next)=>{
    const {query} = req.params;
    try {
     
     const User = Card.find({
         $or: [
             { location: { $regex: new RegExp(query, "i") } },
             { HouseSquart: { $regex: new RegExp(query, "i") } },
             { HouseSize: { $regex: new RegExp(query, "i") } },
             { price: { $regex:new RegExp(query,"i") } },
         ]
     }) 
     res.status(200).json({User});
    } catch (error) {
     next(error);
    }
}


module.exports = {
    createCard,deleteCard,
    editCard,getAllCard,
    getUserCard,favoriteCard,unfavoriteCard,
    searchCard,getoneCard
}

