const catchAsyncError = require('../middleware/catchAsyncError');
const ProductModel = require('../models/productModel');
const ApiFeatures = require('../utils/apifeatures');
const ErrorHandler = require('../utils/errorHandler');


// backend code to create product  -- admin
exports.createProduct =catchAsyncError(async(req,res,next)=>{
    // here assigning value id to createdBy 
    req.body.createdBy = req.user.id 
    
    const product =await ProductModel.create(req.body);
    res.status(201).json({
        success:true,
        message:"product created",
        product
    })
        
    
})


// backend code to get all product 
exports.getAllProducts= catchAsyncError(async (req,res)=>{
    const resultPerPage = 5;
    // for total product count 
    const productCount = await ProductModel.countDocuments();
    const apiFeatures = new ApiFeatures(ProductModel.find(),req.query)
    .search()
    .filter()
    .perPage(resultPerPage)
    const products = await apiFeatures.query;
    res.json({
        success:true,
        productCount,
        products })
})

// backend code to update product -- admin
exports.updateProducts = catchAsyncError(async (req,res,next)=>{
    let product = await ProductModel.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler('product not found ',404) )
    }
    product = await ProductModel.findByIdAndUpdate(req.params.id ,req.body , {new :true , runValidators:true, useFindAndModify:false})
    res.status(202).json({
        success:true,
        product 
    })
     
})
// backend code to delete product -- admin
exports.deleteProducts = catchAsyncError(async (req,res,next)=>{
    let product = await ProductModel.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("product not found" ,404 ))
    
    }
    product = await ProductModel.findByIdAndDelete(req.params.id ,req.body)
    res.status(500).json({
        success:true,
        message:'product deleted successfully ',
        product })
        
})