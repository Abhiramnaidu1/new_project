const { Client } = require('elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
var generator = require('generate-password');

 async function createTitle(userobj) {
   console.log("========================================================");
   console.log(userobj);
   let randomid = generator.generate({
   length: 10,
   numbers: true
   });
   console.log(randomid)
     return await client.create({
       index: 'data',
       id: randomid,
         body: {
            title: userobj.Title,
            contributor_author: userobj.author,
            publisher: userobj.publisher,
            contributor_department: userobj.department,
            date_issued: userobj.date_issued,
            description_provenance: userobj.advisor,
            degree_level: userobj.degree_level,
            description_abstract:userobj.abstract
        }
    });
 }
//
// // createTitle().catch(console.log);
  async function getTitle(id) {
    return await client.search({
       index: 'data',
       body: {
           query: {
               match: {
                   _id:  id


               }
           }
       }
   });
  }

  async function newcomment( userobj) {
  return await client.update({
    index: 'data',
    id: userobj.id,
    body :{
      doc:{
        Claims:[{
          claim :userobj.claim,
           reproduce: userobj.reproduce,
            name: userobj.name,
            datasets: userobj.dataset,
            experiments: userobj.experiments,
            sourcecode: userobj.sourcecode,
            like : ["1","2"],
            unlike : ["1","2"]

        }]
      }
    }
  });
}


async function like(userobj) {
  var liked =userobj.mailid;
  var k = userobj.claimid;
  return await client.update({
    index: 'data',
    id: userobj.id,
      body: {


        script: {

             lang:'painless',
             source:"if (ctx._source.Claims[params.k].unlike.contains(params['liked'])) { ctx._source.Claims[params.k].unlike.remove(ctx._source.Claims[params.k].unlike.indexOf(params['liked'])), ctx._source.Claims[params.k].like.add(params.liked) } else if(! ctx._source.Claims[params.k].like.contains(params['liked'])) {ctx._source.Claims[params.k].like+=params.liked};",

               params:{
                 liked:liked,
                 k :k

                 }
             }


}


    });

}


async function unlike(userobj) {
  var unliked =userobj.mailid;
  var k = userobj.claimid;
  return await client.update({
    index: 'data',
    id: userobj.id,
      body: {
         scripted_upsert: true,

        script: {

             lang:'painless',
             source:"if (ctx._source.Claims[params.k].like.contains(params['unliked'])) { ctx._source.Claims[params.k].like.remove(ctx._source.Claims[params.k].like.indexOf(params['unliked'])), ctx._source.Claims[params.k].unlike.add(params.unliked) } else{ctx._source.Claims[params.k].unlike.add(params.unliked)};",

               params:{
                 unliked:unliked,
                 k :k

                 }
             },
             upsert:{
               doc:{
                 Claims:[{
                   total
                 }]
               }
             }

}


    });

}


  async function comment( userobj) {
    console.log("========================================================");
    console.log(userobj);
//     var k =0;
//     var userclaim = claim[k] ;
// var obje = {
//    userclaim: {
//  reproduce: userobj.reproduce,
//  name: userobj.name,
//  datasets: userobj.dataset,
//  experiments: userobj.experiments,
//  sourcecode: userobj.sourcecode
// }
// };
var total = {
 claim :userobj.claim,
  reproduce: userobj.reproduce,
   name: userobj.name,
   datasets: userobj.dataset,
   experiments: userobj.experiments,
   sourcecode: userobj.sourcecode

};


      return await client.update({
        index: 'data',
        id: userobj.id,
          body: {
             scripted_upsert: true,

            script: {

                 lang:'painless',
                 source:'if(ctx._source.Claims != undefined){ (ctx._source.Claims.add(params.total))} else{ctx._source.Claims=[params.total]};',
               source:'ctx._source.Claims.add(params.total)',
                   params:{
                     total:total

                     }
                 },
                 upsert:{
                   doc:{
                     Claims:[{
                       total
                     }]
                   }
                 }

   }


        });

     }
  //           {
  // mappings: {
  //    book : {
  //      properties : {
  //        Claims : {
  //          properties : {
  //            1 : {
  //              properties : {
  //                claim : {
  //                  type :  text ,
  //                  fields : {
  //                    keyword : {
  //                      type :  keyword ,
  //                      ignore_above : 256
  //                   }
  //                 }
  //               },
  //                datasets : {
  //                  type :  text ,
  //                  fields : {
  //                    keyword : {
  //                      type :  keyword ,
  //                      ignore_above : 256
  //                   }
  //                 }
  //               },
  //                experiments : {
  //                  type :  text ,
  //                  fields : {
  //                    keyword : {
  //                      type :  keyword ,
  //                      ignore_above : 256
  //                   }
  //                 }
  //               },
  //                name : {
  //                  type :  text ,
  //                  fields : {
  //                    keyword : {
  //                      type :  keyword ,
  //                      ignore_above : 256
  //                   }
  //                 }
  //               },
  //                reproduce : {
  //                  type :  text ,
  //                  fields : {
  //                    keyword : {
  //                      type :  keyword ,
  //                      ignore_above : 256
  //                   }
  //                 }
  //               },
  //                sourcecode : {
  //                  type :  text ,
  //                 "fields": {
  //                   "keyword": {
  //                     "type": "keyword",
  //                     "ignore_above": 256
  //                   }
  //                 }
  //               }
  //             }
  //           },
  //           "claim": {
  //             "type": "text",
  //             "fields": {
  //               "keyword": {
  //                 "type": "keyword",
  //                 "ignore_above": 256
  //               }
  //             }
  //           },

//
//     console.log(body);
// }

// getTitle().catch(console.log);
//
//   async function updateTitle() {
//     const { response } = await client.update({
//         index: 'data',
//         id: 11,
//         body: {
//             doc: {
//                 title: 'Awsome title'
//             }
//         }
//     });
// }



// const body = titles.flatMap((doc, index) => [
//     { index: { _index: 'data', _id: index + 1 } },
//     doc
// ]);

//  async function createTitles() {
//     const { response } = await client.bulk({ body: body, refresh: true });
//
//     if (response) {
//         console.log(response.errors);
//     }
// }

// createTitles().catch(console.log);
//
//  async function countTitles() {
//     const { body } = await client.count({
//         index: 'data'
//     });
//
//     console.log(body);
// }

// countTitles().catch(console.log);
//const { body: response } =
 async function searchTitles(titlename) {

     return await client.search({
        index: 'data',
        body: {
            query: {
                match: {
                    title:{
                      query: titlename,
                    fuzziness:1
                  }
                }
            },
              size:"10000"
        }
    });


}

var service = {};
async function advsearch(userObj) {
  var searchQuery={
    index: 'data',
      body: {
        query: {
            bool: {
               must: []
                   }
                },

                size:"10000"
            }

};

var must=searchQuery.body.query.bool.must;
if (userObj.title != undefined && userObj.title != null&&userObj.title != "") {
  var obj = {
    match: {
      title: {query:userObj.title, fuzziness:1}
    }
  };
  must.push(obj);
}
if (userObj.Author != undefined && userObj.Author != null&&userObj.Author != "") {
  var obj = {
    match: {
      contributor_author: {query: userObj.Author, fuzziness:1}
    }
  };
  must.push(obj);
}
if (userObj.Department != undefined && userObj.Department != null&&userObj.Department != "") {
  var obj = {
    match: {
      contributor_department:{query: userObj.Department, fuzziness:1}
    }
  };
  must.push(obj);
}
if (userObj.Description != undefined && userObj.Description != null&&userObj.Description != "") {
  var obj = {
    match: {
      description_abstract: {query: userObj.Description, fuzziness:1}
    }
  };
  must.push(obj);
}
console.log("========================================================");
console.log(searchQuery);
console.log("========================================================");
    return await client.search(searchQuery);
}
service.newcomment = newcomment;
service.searchTitles = searchTitles;
service.getTitle = getTitle;
service.advsearch=advsearch;
service.createTitle = createTitle
service.comment = comment;
service.like = like;
service.unlike = unlike;
module.exports = service;
