# SEN-project

Setup
  install the server dependencies 
    npm install
  install the client dependencies
    cd client
    npm install

Run
  npm run dev (sets up the server using nodemon so server restarts automatically if changes are made)
  cd client
  npm start (sets up the frontend and launches the frontend on the default browser, requires the server to be online)
  

You will need 2 extra files:
admin-key.json (contains the admin authentication for firebase)
smapgmail.js (contains the credentials for the project gmail account)
You can find where to place the files based on the .gitignore file.
