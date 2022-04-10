# EnvisionIt

## Project URL

**Task:** Provide the link to your deployed application. Please make sure the link works. 
https://envisionit-app.herokuapp.com/

## Project Video URL 

**Task:** Provide the link to your youtube video. Please make sure the link works. 
https://www.youtube.com/watch?v=N_cfEx--Ksw

## Project Description

**Task:** Provide a detailed description of your app
Application Name:
Our app is called EnvisionIt.

User profile:
This application allows users to signup, signin and sign out.

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

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used.
Programming Languages:
HTML
CSS
Javascript

Framework:
ReactJs

Libraries:
Socket.io (Websocket Library)

Third-Party API:
MongoDB

## Deployment

**Task:** Explain how you have deployed your application. 
We used Heroku to host our application. 

## Maintenance

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.
To monitor our app, we use the logging services on Heroku to check for any errors that occurred. We can also check our MongoDB Atlas cloud account to check
that all the data in clean and log wrongful uses of the database.

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. Connecting users through websockets into specific rooms
2. Learning the GraphQL query language
3. Deploying onto Heroku

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).
Jadin Luong:
- Implemented the overall functionality of the canvas
- Implemented websockets to allow users to connect to a collaborative canvas and perform real-time operations
- Implemented functionality for the shared and local galleries (connected galleries to backend)

Johnson Zhong:
- Backend express api calls
- Backend graphql queries and framework
- Managing MongoDB
- Deployment onto Heroku, managing

# One more thing? 

**Task:** Any additional comment you want to share with the course staff? 
