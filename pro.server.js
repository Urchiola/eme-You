var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res, next){
    req.url = '/index.html';
    next();
});

app.use(router);

// 項目生成時 使用的數據
// 自定義的一些 讀取data.json 
var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

// 定義路由
var apiRoutes = express.Router();
apiRoutes.get('/seller',function(req,res){
	res.json({
		 errno:0,
		 data:seller
	});
});
apiRoutes.get('/goods',function(req,res){
	res.json({
		 errno:0,
		 data:goods
	});
});
apiRoutes.get('/ratings',function(req,res){
	res.json({
		 errno:0,
		 data:ratings
	});
});
app.use('/api',apiRoutes);

app.use(express.static('./dist'));

// var server = app.listen(port)
module.exports = app.listen(port, function(err){
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:' + port + '\n');
});
