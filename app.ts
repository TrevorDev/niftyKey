import 'babel-polyfill';

import appFactory from "./libs/appFactory";

async function main(){
  var app = appFactory.createApp();

  app.get('/',async (req, res) => {
      res.render('index')
  });

  await app.listen(3000);
}

main().catch(function(err){
  console.log(err.stack)
})
