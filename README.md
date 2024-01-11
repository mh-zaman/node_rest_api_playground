A Node.js RESTful API Project (Building simple shop)

Commands: 

$ mkdir node-rest-shop
$ cd node-rest-shop
$ npm init
$ code .
$ npm install --save express
$ npm install --save-dev nodemon (For automatically restart the server when changes are made)

- package.json
"start": "nodemon server.js" (Add this line in the script)

$ npm install --save morgan (HTTP request logger middleware for node.js)
$ npm install --save body-parser (Parses incoming request bodies in a middleware before passing to handlers, available under the req.body property)
$ npm install --save mongoose (Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks)
$ npm install --save multer (Handles multipart/form-data, which is primarily used for uploading files)
$ npm install --save bcrypt (A library to help hash the passwords)
$ npm install --save jsonwebtoken (An implementation of JWT)

- Unistall package
$ npm uninstall --save
