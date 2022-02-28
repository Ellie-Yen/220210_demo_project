const path = require('path');
/**
 * RequestHandler
 * @param req Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>
 * @param res Response<any, Record<string, any>, number>
 */
function apiRouter(req, res){
  const file_name = req.url.replace('/api/v1/rest/datastore/', '');
  const file_path = path.join(__dirname, `../datastore/api/${file_name}.json`);
  try {
    const data = require(file_path);
    res.status(200).send(JSON.stringify(data));
  }
  catch (error){
    res.status(403);
  }
}

module.exports = apiRouter;