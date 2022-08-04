

module.exports = AsynErrors => (req,res,next) =>{
    Promise.resolve(AsynErrors(req,res,next)).catch(next);
}