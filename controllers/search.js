const DBConnection = require("../database/DBConnection");
const getSearch = async (req,res,next)=>{
    const db = await DBConnection.getDB(req.params.base);
    const query = req.query;
    const modelId  = req.params.model;
    const searchCollection = await db.collection(`${modelId}`);
    
    //searchCollection.dropIndexes();
    await searchCollection.createIndex({ name: "text", label: "text", title:"text" });
    
    let agg = await searchCollection.aggregate([
   // {$match:{ $text: { $search: `\"${decodeURI(String(query.sys_text_search))}\"`}}}
   {$match:{label:{'$regex' : `^${decodeURI(String(query.sys_text_search))}`, '$options' : 'i'}}}
    ]);

    let arr = await agg.toArray();
    /*for(let item of arr){
            const mainDB = await DBConnection.getDB(process.env.MAIN_DB);
            let user = await mainDB.collection("sys_user").findOne({_id:item.sys_created_by});
            item.sys_created_by = user;
    }*/

    console.log(arr);
    res.status(200).send({results:arr})
    
  

}

module.exports = {
    getSearch
  };