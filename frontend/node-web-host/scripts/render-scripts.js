'use strict';
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const sh = require('shelljs');

// const { Client } = require('@elastic/elasticsearch');
// const client = new Client(
//     { 
//         node: 'https://127.0.0.1:9200',
//         auth: {
//             username: 'elastic',
//             password: '-G_xN=wVour71oOYJtVj'
//         },
//         ssl: {
//             rejectUnauthorized: false
//         }
//     }
// );

// =================================================================================================

// module.exports = async function fetchLocDetailsByIP() {
    
//     console.log("Initiated IP details fetch");
  
//     const ip = $('#inputIp').val();
//     console.log("Input IP => " + ip);
  
//     // Define the Elasticsearch index name:
//     const indexName = 'ip2loc';
  
//     // Define the document to index, including the IP address:
//     const document = {
//       ip: ip
//     };

//     try {
//       // Index the document in Elasticsearch:
//       const indexResponse = await client.index({
//         index: indexName,
//         body: document,
//         id: ip
//       });
//       console.log('Document indexed successfully');
  
//       // Search for the document in Elasticsearch using the GeoIP API:
//       const searchResponse = await client.search({
//         index: indexName,
//         body: {
//           query: {
//             bool: {
//               filter: [
//                 {
//                   geo_ip: {
//                     ip: ip
//                   }
//                 }
//               ]
//             }
//           }
//         }
//       });
//       const hits = searchResponse.body.hits.hits;
//       if (hits.length > 0) {
//         const location = hits[0]._source.geoip.location;
//         console.log(`Latitude: ${location.lat}, Longitude: ${location.lon}`);
//       } else {
//         console.log(`Document with IP address ${ip} not found`);
//       }
//     } catch (error) {
//       console.error(`Request failed. Error message: ${error.message}`);
//     }
// }

// ====================================================================================================

module.exports = function renderScripts() {
    
    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/js');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    
    sh.cp('-R', sourcePath, destPath)

    const sourcePathScriptsJS = upath.resolve(upath.dirname(__filename), '../src/js/scripts.js');
    const destPathScriptsJS = upath.resolve(upath.dirname(__filename), '../dist/js/scripts.js');
    
    const scriptsJS = fs.readFileSync(sourcePathScriptsJS);
    
    fs.writeFileSync(destPathScriptsJS, scriptsJS);
};