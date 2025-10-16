exports.logger = async (req,res,next)=>{
    const path = req.path
    console.log(path)
    next();
}