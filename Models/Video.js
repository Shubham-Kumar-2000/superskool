const mongoose = require('mongoose');
const configConsts = require('../config/constants');
const Schema = mongoose.Schema;
const playlistSchema = new mongoose.Schema({
	thumbnail:{type:String,require:true},
    title:{type:String,require:true},
    youtubeId:{type:String,default:''}
 });
const videoSchema= new Schema({
    title:{type:String,default:''},
    url:{type:String,default:''},
    youtubeId:{type:String,default:''},
    length:{type:String,default:''},
    description:{type:String,default:''},
    thumbnail:{type:String,default:''},
    playlist:{type: [playlistSchema], default: []}
},{timestamps:true});
videoSchema.index({ title: 'text',description:'text'});
videoSchema.statics.getByYoutubeId=(youtube)=>{
    return Video.findOne({
        youtubeId:youtube
    })
}

videoSchema.statics.getByPlaylist=(playlistId,page=1)=>{
    const skip = (page - 1) * configConsts.VIDEOS_PAGINATION_PER_PAGE_LIMIT;
    return Video.find({
        playlist:{
            $elemMatch:{
                youtubeId:playlistId
            }
        }
    }).skip(skip>0?skip:0).limit(configConsts.VIDEOS_PAGINATION_PER_PAGE_LIMIT)
}

const Video = module.exports = mongoose.model('video', videoSchema);