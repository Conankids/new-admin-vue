
var indexTpl
if( process.env.NODE_ENV !== 'production'){
	indexTpl = require('./index.html')
}else{
	indexTpl = require('!!ejs-loader!./index.php3')
}


module.exports = indexTpl




