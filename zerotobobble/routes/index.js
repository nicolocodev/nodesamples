var express = require('express');
var router = express.Router();
var fs = require('fs'),
    oxford = require('project-oxford'),
    Jimp = require('jimp'),
    pngFileStream = require('png-file-stream'),
    GIFEncoder = require('gifencoder');
    

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function (req,res, next) {
    var imgSrc = req.file ? req.file.path : '';
    Promise.resolve(imgSrc)
        .then(function detectFace(image) {
            var client = new oxford.Client(process.env.OXFORD_API);
            return client.face.detect({path: image});
        })
        .then(function generateBobblePermutations(response) {
            var promises = [];
            var degrees = [10, 0, -10];
            for (var i = 0; i < degrees.length; i++) {
                var outputName = req.file.path + '-' + i + '.png';
                promises.push(cropHeadAndPasteRotated(req.file.path,
                    response[0].faceRectangle, degrees[i], outputName))
            }
            return Promise.all(promises);
        })
        .then(function generateGif(dimensions) {
            return new Promise(function (resolve, reject) {
                var encoder = new GIFEncoder(dimensions[0][0], dimensions[0][1]);
                pngFileStream(req.file.path + '-?.png')
                    .pipe(encoder.createWriteStream({ repeat: 0, delay: 500 }))
                    .pipe(fs.createWriteStream(req.file.path + '.gif'))
                    .on('finish', function () {
                        resolve(req.file.path + '.gif');
                    });
            }) 
        })
        .then(function displayGif(gifLocation) {
            var imgUrl = gifLocation.replace(/\\/g,'/');
            console.log('La imagen esta ' + imgUrl);
            res.render('index',{title:'Done!', image:imgUrl});
        });
});

function cropHeadAndPasteRotated(inputFile, faceRectangle, degrees, outputName) {
    return new Promise (function (resolve, reject) {
        Jimp.read(inputFile).then(function (image) {
            // Face detection only captures a small portion of the face,
            // so compensate for this by expanding the area appropriately.
            var height = faceRectangle['height'];
            var top = faceRectangle['top'] - height * 0.5;
            height *= 1.6;
            var left = faceRectangle['left'];
            var width = faceRectangle['width'];
 
            // Crop head, scale up slightly, rotate, and paste on original image
            image.crop(left, top, width, height)
            .scale(1.05)
            .rotate(degrees, function(err, rotated) {
                Jimp.read(inputFile).then(function (original) {
                    original.composite(rotated, left-0.1*width, top-0.05*height)
                    .write(outputName, function () {
                        resolve([original.bitmap.width, original.bitmap.height]);
                    });
                });
            });
        });
    });
}

module.exports = router;
