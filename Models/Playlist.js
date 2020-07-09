const mongoose = require('mongoose');
const configConsts = require('../config/constants');
const Schema = mongoose.Schema;
const TopicAttributesSchema = new mongoose.Schema({
	name:{type:String,require:true},
	domain:{type:String,require:true}
 });
const playlistSchema= new Schema({
    youtubeId:{
        type:String,
        default:''
    },
    videos:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        default:''
    },
    thumbnail:{
        type:String,
        default:''
    },
    title:{
        type:String,
        default:''
    },
    attributes:{type: [TopicAttributesSchema], default: []}
},{timestamps:true});
playlistSchema.index({ title: 'text',description:'text'});
playlistSchema.statics.add=(playlist)=>{
    playlist=new Playlist(playlist)
    return playlist.save()
}

playlistSchema.statics.getAll=(page=1)=>{
    const skip = (page - 1) * configConsts.PLAYLISTS_PAGINATION_PER_PAGE_LIMIT;
    return Playlist.find().skip(skip>0?skip:0).limit(configConsts.PLAYLISTS_PAGINATION_PER_PAGE_LIMIT)
}

playlistSchema.statics.getByYoutubeId=(youtube)=>{
    return Playlist.findOne({
        youtubeId:youtube
    })
}

playlistSchema.statics.updateTopicAttributes = (id, AttributesArray) =>{
	return Playlist
	.findOneAndUpdate(
		{ youtubeId:id},
		{
			$set: {
				attributes: AttributesArray
			}
		},
		{ new:true }
	)
}

const Playlist = module.exports = mongoose.model('playlist', playlistSchema);