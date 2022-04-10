# EnvisionIt

## Project URL
https://envisionit-app.herokuapp.com/

## Project Video URL 
https://www.youtube.com/watch?v=N_cfEx--Ksw

## Project Description
Application Name: Our app is called EnvisionIt.

User system:

Users can signup, signin, signout and edit user profile in the application.

Galleries

Once users are signed into the application they are able to go into their own personal gallery which consists of two 
different gallery sections, the "Local" gallery and the "Shared" gallery. The 
Local gallery consists of only the canvases that the user themselves can see, these canvases can not be shared with other users.
This can be considered as a "private" canvas/project. 
The Shared gallery consists of only the canvases that can be shared with users. At first, only the users created it can see the canvas 
but the creators of the canvases in the shared gallery can actually obtain a link inside the canvas itself and send it to their peers.
Their peers can then submit the link and will be redirected to the canvas, the canvas will then be added to the peer's shared gallery.

Canvas

The canvas is very straight forward, this allows the user to draw on a blank canvas with several tools to choose from on the left side of the 
canvas. The link mentioned in the Galleries section above can be found within the canvas page. This page also contains an exit button which 
allows the user to exit out of the canvas page and back into their galleries. The unique feature about the canvas is that, if the canvas is 
"shared" then users can connect with one another and collaborate on the canvas real-time. In other words, as long as users are connected into 
the same "shared" canvas they can see eachother's brush strokes and other actions. The canvases have an auto-save mechanism where everytime a user 
creates a new brush stroke onto the canvas, the current state of the canvas will be saved so users can always come back to the canvas and start where 
they left off. This works for both shared and local canvases.

## Development

Overall, we used very standard promgramming languages and tools for example we used HTML, CSS, Javascript and mostly implemented our frontend using ReactJS framework. We also used plenty of NodeJs/ReactJS libraries to frontend, design and routing purposes. We used several backend libraries to allow for collaboration such as Socket.io and GraphQL.

Programming Languages:
HTML,
CSS,
Javascript

Framework:
ReactJs,
Express

Libraries:
Socket.io (Websocket Library),
GraphQL,
bcrypt,
cookie

Third-Party API:
MongoDB

## Deployment
We used Heroku to host our application. 

## Maintenance
To monitor our app, we use the logging services on Heroku to check for any errors that occurred. We can also check our MongoDB Atlas cloud account to check
that all the data in clean and log wrongful uses of the database.

## Challenges
1. Connecting users through websockets into specific rooms
2. Learning the GraphQL query language
3. Deploying onto Heroku

## Contributions
Jadin Luong:
- Implemented the overall functionality of the canvas
- Implemented websockets to allow users to connect to a collaborative canvas and perform real-time operations
- Implemented functionality for the shared and local galleries (connected galleries to backend)

Johnson Zhong:
- Implemented backend express api calls
- Implemented backend graphql queries and framework
- Managed MongoDB database and structure
- Deployment onto Heroku, managing host and https

Mengqi Zhao:
- Implemented the functionality of the user. (connected user-related functionalities to backend)
- Implemented the overall design of the frontend.
- Implemented the routing/navigation logic of the frontend.
