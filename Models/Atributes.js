const mongoose = require('mongoose');
const configConsts = require('../config/constants');
const Schema = mongoose.Schema;
const attributeSchema= new Schema({
    domain:{
        type:String,
        default:""
    },
    name:{
        type:String,
        default:""
    },
    status:{
        type:Number,
        default:configConsts.ATTRIBUTE_STATUS.ACTIVE
    }
},{timestamps:true});

attributeSchema.index({ name: 'text'});
attributeSchema.statics.addAttribute=async function(attri){
    let newattri=new Attributes(attri);
    return newattri.save(); 
}
attributeSchema.statics.addOrSaveAttribute=async function(attri){
    let newattri=await Attributes.findOne(attri)
    if((newattri))
    return newattri;
    newattri=new Attributes(attri);
    return newattri.save(); 
}
attributeSchema.statics.delAttribute=async function(id){
    return Attributes.updateOne({
        _id:id,
        status:configConsts.ATTRIBUTE_STATUS.ACTIVE
    },{
        status:configConsts.ATTRIBUTE_STATUS.DISABLED
    })
}
attributeSchema.statics.getDomains=function(){
    return Attributes.distinct("domain")
}

attributeSchema.statics.getAttributesByDomain=function(domain){
    return Attributes.find({
        domain:domain,
        status:configConsts.ATTRIBUTE_STATUS.ACTIVE
    })
}
attributeSchema.statics.getAttributes=function(){
    return Attributes.find({
        status:configConsts.ATTRIBUTE_STATUS.ACTIVE
    })
}
attributeSchema.statics.getById=function(id){
    return Attributes.find({
        _id:id,
        status:configConsts.ATTRIBUTE_STATUS.ACTIVE
    })
}
attributeSchema.statics.getByIds=function(ids){
    return Attributes.find({
        _id:{
            $in:ids
        },
        status:configConsts.ATTRIBUTE_STATUS.ACTIVE
    })
}
attributeSchema.statics.search = function(text){
    return Attributes.find({
        $text:{
            $search: text,
            $caseSensitive: false
        }
    })
}
attributeSchema.statics.searchWithDomains = function(text,domain){
    return Attributes.find({
        $text:{
            $search: text,
            $caseSensitive: false
        },
        domain:{
            $in:domain
        }
    })
}
const Attributes = module.exports = mongoose.model('attribute', attributeSchema);