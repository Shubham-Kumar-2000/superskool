const express = require('express');
const router = express.Router();
const playlist = require('../controllers/playlist');
const multer=require('multer');
const path=require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../csv/'))
    },
    filename: function (req, file, cb) {
		let fragments=file.originalname.split('.');
		const extension=fragments.splice(-1)[0];

      	cb(null,  Date.now() + '.' + extension);
    }
  })

const upload =multer({
	limits: {
		fileSize: 5000000
	},
	fileFilter(req,file,cb){
		if(!file.originalname.endsWith('.csv')){
			return cb(new Error('File must be a csv'))
		}
		cb(undefined,true)
	},
	storage: storage
})


router.get('/list',playlist.getAll)
router.get('/list/:page',playlist.getAll)
router.post('/videoList/:page',playlist.getAllVideos)
router.post("/add", playlist.addPlaylist);
router.post("/addByCsv", upload.single('file'),playlist.make);
router.post("/updateAttributes", playlist.updateAttributes);
module.exports = router;