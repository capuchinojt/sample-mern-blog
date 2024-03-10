## TECH:
### Client:
 - ReactJS
 - Using:
	* react-router-dom (react router)
	* flowbite-react
	* react-icons
	* tailwindcss
 
### Server:
 - NodeJS 

##### ___________________________________________________________ #####

## INIT CLIENT REACTJS:
### 1. Create [pages] folder:
	src
		|_pages
			|_About.jsx
			|_Dashboard.jsx
			|_Home.jsx
			|_Projects.jsx
			|_SignIn.jsx
			|_SignUp.jsx

### 2. Install react-router-dom, tailwindcss

### 3. Create route for each page

### 4. Create Header Component
	- Create folder components
	- Create Header.jsx component then add into App.jsx
	
### 5. Install flowbite-react, react-icons to build Header
	- Using Link from 'react-router-dom' to handle link to homepage
	- Using TextInput component from 'Flowbite-react' and AiOutlineSearch from 'react-icons' to handle text input search 

### 6. Using Mongoose to connect to MongoDB
#### Install Mongoose, dotEnv (to get env variables)
	=> npm i mongoose
	=> npm i dotenv

### 7. Create User model by using mongoose.Schema
#### User model
			|_username:
								- type: String
								- required: true
								- unique: true
			|_email
								- type: String
								- required: true
								- unique: true
			|_password
								- type: String
								- required: true

### 8. Create User controller to handle logic + handle sign up requests - install bcryptjs
 Route: api/auth/signup
 Controller: 
  - Get request body { username, email, password: passwordHash }
	-> Create new User by using User model -> save new user to mongodb
	* Hash password before save to db by using bcryptjs

### 9. Add middleware and function to handle error
	src
		|_utils
			|_error.handler.js (return error with (statusCode, message))
		|_controllers
			|_error.controller.js (Handle handleError = (err, req, res, next) then return res with statusCode {success: false, statusCode, message})



### HEADER
 - Web Title to back Homepage
 - Text input to search
 - NavLink for each page
### _______________________________________________________ ###

## INIT SERVER NODEJS
### 1. Init package.json
	=> npm init -y

### 2. create folder [api] at the same root folder like [client]
	=> install express: [npm install express]
 
 