const request=require('request-promise')
exports.getPlaylistSnippet=async(id)=>{
    let url='https://www.googleapis.com/youtube/v3/playlists?id='+id+'&key='+process.env.YOUTUBEkEY+'&part=snippet,contentDetails';
    let snippet= await request.get(url)
    snippet=JSON.parse(snippet)
    if(snippet.pageInfo.totalResults<1)
    throw "Playlist Not Found"
    snippet=snippet.items[0]
    return {
        youtubeId:id,
        videos:snippet.contentDetails.itemCount,
        description:snippet.snippet.description,
        thumbnail:snippet.snippet.thumbnails.default.url,
        title:snippet.snippet.title,
    }
}
exports.getVideosOfPlaylist=async(id)=>{
    let url='https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId='+id+'&key='+process.env.YOUTUBEkEY//&pageToken=CBQQAA'
    let pageToken=null;
    let videos=[]
    while(true){
        let newVideos=await request.get(pageToken?url+'&pageToken='+pageToken:url)
        newVideos=JSON.parse(newVideos)
        pageToken=newVideos.nextPageToken
        newVideos=newVideos.items.map(v=>{
            return {
                title:v.snippet.title,
                url:"https://www.youtube.com/watch?v="+v.snippet.resourceId.videoId,
                youtubeId:v.snippet.resourceId.videoId,
                description:v.snippet.description,
                thumbnail:v.snippet.thumbnails.default.url
            }
        })
        videos.push(...newVideos)
        if(!pageToken)
        break
    }
    let i=0;
    while(i<videos.length){
        let v=videos[i]
        i+=1;
        let l= await request.get('https://www.googleapis.com/youtube/v3/videos?id='+v.youtubeId+'&part=contentDetails&key='+process.env.YOUTUBEkEY)
        l=JSON.parse(l)
        v.length=l.items[0].contentDetails.duration;
    }
    return videos
}