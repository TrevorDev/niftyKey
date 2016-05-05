import express = require("express")
import bodyParser = require("body-parser")
import session = require("express-session")
import config from "../libs/config"

export default {
	createApp: function(){
		var app = express();
		app.set('views', __dirname + '/../views');
		app.set('view engine', 'jade');
		app.set('view options', { layout: false });

		//TODO make this secret and move to config.ts
		app.use(session({
		  secret: config.session.secret,
		  resave: false,
		  saveUninitialized: true
		}))
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());

		app.use("/public", express.static(__dirname + '/../public'))
		app.use("/bower_components", express.static(__dirname + '/../bower_components'));
		app.use("/views", function(req, res){
			//console.log(req.url)
				res.render('../views/'+req.url.substr(1), function(e, html){
					if(e){
						res.status(404)
						res.end()
						//res.send("Cannot GET /views" + req.url)
					}else{
						res.send(html)
					}
				})
		})

    //wrap express methods to display errors
    var handleAsyncErr = (parent, element) => {
        var prev = parent[element]
        var updated = function(route, func){
            var asyncFunc = arguments[1]
            if(asyncFunc){
              arguments[1] = async function(res, resp){
                try{
                  await asyncFunc.apply(app, arguments)
                }catch(err){
                  console.log(err.stack)
                }
              }
            }
            return prev.apply(app, arguments)
        }
        parent[element] = updated.bind(app)
    }
    handleAsyncErr(app, "get")
    handleAsyncErr(app, "put")
    handleAsyncErr(app, "post")
    handleAsyncErr(app, "delete")

		return app
	}
}
