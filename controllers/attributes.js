const Attributes=require('../Models/Atributes')
exports.add=async function(req, res, next) {
    try{
        let attribute= await Attributes.addAttribute({
            domain:req.body.domain,
            name:req.body.name
        });
        res.status(200).json({
            err:false,
            attribute:attribute
        });
    }catch(err){
        console.log(err)
        res.status(200).json({
            err:true,
            msg:err
        });
    }
}
exports.del=async function(req, res, next) {
    try{
        let attribute= await Attributes.delAttribute(req.body.attributeId);
        res.status(200).json({
            err:false,
            deleted:true,
            attribute:attribute
        });
    }catch(err){
        console.log(err)
        res.status(200).json({
            err:true,
            msg:err
        });
    }
}
exports.domains=async function(req, res, next) {
    try{
        let domains= await Attributes.getDomains();
        res.status(200).json({
            err:false,
            domains:domains
        });
    }catch(err){
        console.log(err)
        res.status(200).json({
            err:true,
            msg:err
        });
    }
}
exports.getAttributesByDomain=async function(req, res, next) {
    try{
        let attribute= await Attributes.getAttributesByDomain(req.body.domain);
        res.status(200).json({
            err:false,
            attribute:attribute
        });
    }catch(err){
        console.log(err)
        res.status(200).json({
            err:true,
            msg:err
        });
    }
}
exports.getAll=async function(req, res, next) {
    try{
        let attribute= await Attributes.getAttributes();
        res.status(200).json({
            err:false,
            attribute:attribute
        });
    }catch(err){
        console.log(err)
        res.status(200).json({
            err:true,
            msg:err
        });
    }
}
