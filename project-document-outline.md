API: https://sample-mern-blog-1.onrender.com

## TECH:
### Client:
 - ReactJS
 - Using:
	* react-router-dom (react router)
	* flowbite-react
	* react-icons
	* tailwindcss
	* @tanstack/react-query
	* axios
	* firebase
	* react-quill
	* react-circular-progressbar
	* yup (for form validation)
	* react-hook-form

### Server:
 - NodeJS
 - Express
 - MongoDB (with Mongoose)
 - JWT for authentication
 - bcryptjs for password hashing
 - Winston for logging

## Project Structure:

### Client:
1. Pages:
   - Home
   - About
   - SignIn
   - SignUp
   - Dashboard
   - CreatePost
   - UpdatePost
   - PostPage
   - Projects

2. Components:
   - Header
   - Footer
   - DashProfile
   - DashSidebar
   - ThemeProvider
   - PrivateRoute
   - OAuth
   - CommentSection
   - CallToAction

3. Utils:
   - api.jsx (axios instance)

4. Hooks:
   - useSignOut

5. Services:
   - Zustand stores (userStore, commonStore)

6. Constants:
   - status.constants
   - errorCode.constants

### Server:
1. Models:
   - User
   - Post
   - Comment

2. Controllers:
   - authController
   - userController
   - postController
   - commentController

3. Routes:
   - auth.route
   - user.route
   - post.route
   - comment.route

4. Middleware:
   - verifyToken
   - errorHandler

5. Utils:
   - logger.js (Winston configuration)

## Features:
1. User Authentication:
   - Sign Up
   - Sign In
   - Sign Out
   - OAuth with Google

2. User Profile:
   - View profile
   - Update profile information
   - Change password
   - Upload profile picture

3. Blog Posts:
   - Create new posts
   - Read posts
   - Update posts
   - Delete posts
   - Like/Unlike posts

4. Comments:
   - Add comments to posts
   - View comments
   - Delete comments (for admins and comment owners)

5. Admin Features:
   - Manage users
   - Manage all posts

6. UI/UX:
   - Responsive design
   - Dark/Light mode toggle
   - Rich text editor for post creation/editing

7. Security:
   - JWT for authentication
   - Password hashing
   - Protected routes

8. Performance:
   - React Query for efficient data fetching and caching
   - Zustand for lightweight state management

9. Logging:
   - Centralized logging system using Winston

## Deployment:
- Client: Deployed on GitHub Pages
- Server: Deployed on Render

## Future Enhancements:
1. Implement pagination for posts and comments
2. Add search functionality
3. Implement email verification
4. Add social sharing features
5. Implement a tagging system for posts
6. Add analytics dashboard for admins

## Development Workflow:
1. Use Git for version control
2. Follow a branching strategy (e.g., feature branches)
3. Implement continuous integration/continuous deployment (CI/CD)
4. Regular code reviews and testing

## Documentation:
1. Maintain this project outline
2. Keep a development log (dev_log.md)
3. Document API endpoints
4. Update README.md with setup instructions and project overview

### _______________________________________________________ ###

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

### 10. Create sign-up page using tailwindcss 
	- Add form with:
		1. Username input:
			- Label: Your username
			- Type: TextInput
		2. Email input:
			- Label: Your Email
			- Type: TextInput <type='email'>
		3. Password input:
			- Label: Your Password
			- Type: TextInput <type='password'>

### 11. Install react-hook-form, yup to handle form
### Install axios to call api
[react-hook-form](https://react-hook-form.com/get-started#Quickstart)

	=> npm i react-hook-form yup axios
	***- Why react-hook-form?
	react-hook-form is a React library designed for managing forms with high performance and ease of use. Here's a summary of its key advantages:

	* High Performance: It optimizes performance by minimizing re-renders. This is achieved through the use of uncontrolled components with Refs, making it efficient for large and complex forms.

	* Ease of Use: The library is built to simplify form building and management. It offers a clear and understandable API, reducing the need for boilerplate code.

	* Easy Integration with UI Libraries: react-hook-form can be easily integrated with popular UI libraries, facilitating smooth and quick UI development.

	* Simple and Powerful Validation: It provides strong validation mechanisms with high customization. Validating data inputs with simple to complex rules is straightforward, including the ability to use external validation libraries like Yup.

	* Automatic Data Collection: The library automates data collection from form fields upon submission, saving time and effort.

	* Effortless Form State Management: Managing form states, including errors, input values, and submit states, is easy and intuitive.

### 12. Install vite-jsconfig-paths to config alias when import module

### 13. Install redux-persist to store redux state into local storage

### 14. Install firebase to handle signIn and signUp with google

### 15. Use firebase storage to store images and install react-circular-progressbar to handle progressbar while uploading
[react-circular-progressbar](https://www.npmjs.com/package/react-circular-progressbar)

### 16. Change from using reduxThunk, reduxToolkit to handle API state and UI state to using react-query and zustand
	* Why? - Transitioning from Redux Thunk and Redux Toolkit to React Query and Zustand has been a strategic move to streamline state management within our project. React Query is employed for handling server state, providing efficient fetching, caching, and updating of data with minimal boilerplate. Zustand offers a simpler and more concise approach to managing UI state, enhancing code readability and maintainability. This shift aligns with my goal of simplifying state management processes, reducing code complexity, and improving overall project scalability and developer experience.

### 17. Install react-quill package (Quill editor React component)
	=> npm i react-quill --save


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

### Sample project structure
 ![alt text](image.png)
