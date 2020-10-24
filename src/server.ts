import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get( "/filteredimage", async ( req, res ) => {
      
   let imageurl=req.query.image_url;

    if(!imageurl)
      {
        
        return  res.status(400).send({ message: 'Please enter the image url' }); 
      }

    let filteredimage=filterImageFromURL(imageurl)
    

    let imgpathsarr:string []
    filteredimage.then(imgpath => {
      res.status(200).sendFile(imgpath , () =>
      deleteLocalFiles([imgpath ])
    );    }).catch(err => {
      res.status(500).send({
        message: err
      });
    });
      

  } );
  


  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();