import { Request, Response, Application } from 'express';
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

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    // extract image url from req.query 
    const { image_url } : any =  req.query;
    // check if image url is invalid
    if(!image_url){
    // if image url is not valid respond with status 400
      return res.status(400).send("invalid image url")
    }
    // create filtered image path from url function 
    try {
      const imagePath=await filterImageFromURL(image_url)
      res.sendFile(imagePath, (err) => {
        // if there's no error respond with the result and then delete local files
          if (!err) {
            deleteLocalFiles([imagePath]).then();
          }
        });
      
    } catch (error) {
      // if there's an error respond with status 422
      res.status(422).send("image url cannot be processed")
    }
    
    
  
  } );
  
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();