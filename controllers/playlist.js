let Playlist=require('../Models/Playlist')
let Video= require('../Models/Video')
let youtubeHelper=require('../helpers/youtubeHelper')
let Attributes=require('../Models/Atributes')
const csv = require('csv-parser')
const fs = require('fs')
const path=require('path');
const request=require('request-promise')
exports.addPlaylist=async(req,res)=>{
    try{
        let playlistId=req.body.playlistId
        if(!playlistId)
            throw "Bad Request"
        let existingPlaylist=await Playlist.getByYoutubeId(playlistId)
        if(existingPlaylist)
            throw "Playlist already exist"
        let playlist=await youtubeHelper.getPlaylistSnippet(playlistId)
        playlist=await Playlist.add(playlist)
        let videos=await youtubeHelper.getVideosOfPlaylist(playlistId)
        videos=videos.map(v=>{
            v.playlist=[{
                thumbnail:playlist.thumbnail,
                title:playlist.title,
                youtubeId:playlist.youtubeId
            }]
            return v
        })
        videos=await Video.insertMany(videos)
        res.status(200).json({
            err:false,
            playlist,
            videos
        })
    }catch(e){
        console.log(e)
        res.status(200).json({
            err:true,
            msg:String(e)
        })
    }
}
function matchAttributtes(arr,idd){
	let index=-1;
	for(let i=0;i<arr.length;i++){
		if(String(arr[i]._id)==String(idd))
		return i
	}
	return index
}
exports.updateAttributes=async(req, res) =>{
    let playlistId=req.body.playlistId;
    let topicId=playlistId;
    let attributeIds = req.body.attributeIds;
    let nonFoundAttributes=req.body.newAttributes
	try{
        if(attributeIds == null||(!(attributeIds instanceof Array)))
        attributeIds=[];
		if(attributeIds == null||nonFoundAttributes == null||(!(nonFoundAttributes instanceof Array))|| (!(attributeIds instanceof Array))){
			throw "Bad Request";
		}
        let attributes = await Attributes.getByIds(attributeIds);
        for(let i=0;i<nonFoundAttributes.length;i++)
		{
			let attri=nonFoundAttributes[i]
			let att= await Attributes.addOrSaveAttribute({
				domain:attri.domain.toLowerCase(),
				name:attri.name.toLowerCase()
			})
			attributes.push(att);
		}
		attributes=attributes.filter((at,i)=>{
			return matchAttributtes(attributes,at._id)==i
		});
		if(attributeIds.length>attributes.length){
				throw 'Attributes Not Found'
        }
        let result;
        if(req.body.add){
            let topic=await Playlist.getByYoutubeId(playlistId)
            topic.attributes.push(...attributes)
            topic.attributes=topic.attributes.filter((at,i)=>{
                return matchAttributtes(topic.attributes,at._id)==i
            });
            result = await Topic.updateTopicAttributes(topicId, topic.attributes)
        }
        else
		result = await Playlist.updateTopicAttributes(topicId, attributes)
		res.status(200).json({
			err:false,
			attributes: result.attributes
		});
	}
	catch(err){
		console.log(err)
		res.status(200).json({
			err:true,
			msg:String(err)
		})
    }
}
exports.make = async(req,res)=>{
	try{
        let results=[]
			fs.createReadStream(path.join(__dirname,'../csv/') + req.file.filename)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async() => {
                try{
                    let i=0;
                    res.status(200).json({err:false,msg:"Playlists are being Created"})
                    while(i<(results.length-1))
                    {
                        await request.post(process.env.BASEURL+"/playlist/add",{json: true, body: {
                            "playlistId":results[i]["Playlist ID"]
                        }})
                        await request.post(process.env.BASEURL+"/playlist/updateAttributes",{json: true, body: {
                            "playlistId":results[i]["Playlist ID"],
                            "attributeIds":[],
                            "newAttributes":[{
                                "domain":"Title",
                                "name":results[i]["Title"]
                            },{
                                "domain":"Level",
                                "name":results[i]["Level"]
                            },{
                                "domain":"Language",
                                "name":results[i]["Language"]
                            },
                            {
                                "domain":"Instructor",
                                "name":results[i]["Instructor"]
                            },
                            {
                                "domain":"Quality",
                                "name":results[i]["Quality"]
                            },
                            {
                                "domain":"Category",
                                "name":results[i]["Category"]
                            },
                            {
                                "domain":"Subcategory",
                                "name":results[i]["Subcategory"]
                            },
                            {
                                "domain":"Subject",
                                "name":results[i]["Subject"]
                            }
                        ]
                        }})
                        i+=1
                    }
                    
                }
                catch(e){
                    console.log(e)
                }
            });
	} catch(e){
		console.log(e)
	}
}
exports.getAll=async(req,res)=>{
    try{
        let playlists=await Playlist.getAll(req.params.page)
        res.status(200).json({
            err:false,
            playlists
        })
    }catch(e){
        console.log(e)
        res.status(200).json({
			err:true,
			msg:String(e)
		})
    }
}
exports.getAllVideos=async(req,res)=>{
    try{
        let videos=await Video.getByPlaylist(req.body.playlistId,req.params.page)
        res.status(200).json({
            err:false,
            videos
        })
    }catch(e){
        console.log(e)
        res.status(200).json({
			err:true,
			msg:String(e)
		})
    }
}