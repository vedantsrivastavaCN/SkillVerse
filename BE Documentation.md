# StudyNotion Backend Documentation

This document provides an in-depth explanation of the backend architecture and workflow for the StudyNotion application. It is designed to help developers understand the structure, functionality, and flow of data throughout the backend system.

## Table of Contents

1.  [Project Structure](#project-structure)
2.  [Entry Point (`index.js`)](#entry-point-indexjs)
3.  [Configuration (`config/`)](#configuration-config)
4.  [Routes (`routes/`)](#routes-routes)
5.  [Controllers (`controllers/`)](#controllers-controllers)
6.  [Middlewares (`middlewares/`)](#middlewares-middlewares)
7.  [Models (`models/`)](#models-models)
8.  [Utilities (`utils/`)](#utilities-utils)
9. [Mail (`mail/`)](#mail-mail)
10. [Feature Walkthroughs](#feature-walkthroughs)
    - [User Authentication Flow](#user-authentication-flow)
    - [Course Creation Flow](#course-creation-flow)
    - [Course Content Management (for Instructors)](#course-content-management-for-instructors)
    - [User Profile Management](#user-profile-management)
    - [Course Progress Tracking](#course-progress-tracking)
    - [Payment Flow](#payment-flow)
    - [Rating and Review System](#rating-and-review-system)

---

## High-Level Overview

The StudyNotion backend is a Node.js application built with the Express.js framework. It follows a classic MVC (Model-View-Controller) pattern, although in the context of a modern API, it's more of a "Model-Route-Controller" structure.

-   **Database**: MongoDB is used as the database, with Mongoose as the ODM (Object Data Modeling) library to interact with it.
-   **Authentication**: User authentication is handled using JSON Web Tokens (JWT).
-   **API**: It exposes a RESTful API for the frontend to consume.
-   **Media Uploads**: Cloudinary is used for storing and managing media files like course thumbnails and user profile pictures.
-   **Payments**: Razorpay is integrated for processing payments for course enrollments.
-   **Email**: Nodemailer is used to send transactional emails, such as for OTP verification and course enrollment confirmations.

## Project Structure

The backend code is organized into several directories, each with a specific responsibility:

```
BACKEND/
├── config/         # Configuration files for database, Cloudinary, etc.
├── controllers/    # Business logic for handling API requests.
├── mail/           # Email templates and sending logic.
├── middlewares/    # Custom middleware for authentication, authorization, etc.
├── models/         # Mongoose schemas for database collections.
├── routes/         # API route definitions.
├── utils/          # Utility/helper functions.
├── index.js        # The main entry point of the application.
└── package.json    # Project dependencies and scripts.
```

---

## Entry Point (`index.js`)

This is the starting point of the application. Its main responsibilities are:

1.  **Initialize Express App**: Creates an instance of the Express application.
2.  **Connect to Database**: Calls the `connect` function from `config/database.js` to establish a connection with MongoDB.
3.  **Connect to Cloudinary**: Sets up the Cloudinary configuration for media uploads.
4.  **Middleware Setup**:
    -   `express.json()`: To parse incoming request bodies with JSON payloads.
    -   `cookie-parser`: To parse cookies attached to the client request.
    -   `cors`: To enable Cross-Origin Resource Sharing, allowing the frontend (on a different domain) to make requests to the backend.
    -   `express-fileupload`: To handle file uploads.
5.  **Mount Routes**: It mounts the different API route handlers (`User`, `Profile`, `Course`, `Payments`) to specific base paths (e.g., `/api/v1/auth`).
6.  **Start Server**: Starts the Express server to listen for incoming requests on a specified port.

---

## Configuration (`config/`)

This directory contains all the configuration files for external services.

-   `database.js`: Exports a `connect` function that uses Mongoose to connect to the MongoDB database using the connection string from the `.env` file.
-   `cloudinary.js`: Exports a `cloudnairyconnect` function that configures the Cloudinary SDK with the `cloud_name`, `api_key`, and `api_secret` from the `.env` file.
-   `razorpay.js`: Configures and exports an instance of the Razorpay SDK with the `key_id` and `key_secret` for processing payments.

---

## Routes (`routes/`)

This directory defines the API endpoints of the application. Each file maps to a specific resource or feature. The routes are responsible for mapping HTTP methods (GET, POST, PUT, DELETE) and URL paths to the corresponding controller functions.

-   `User.js`: Defines routes for user authentication, such as `/login`, `/signup`, `/sendotp`, and password reset routes.
-   `Profile.js`: Contains routes for user profile operations, like getting all user details, updating the profile picture, and getting enrolled courses.
-   `Course.js`: Defines all course-related routes, including creating a course, getting all courses, getting full course details, and managing sections and subsections.
-   `Payments.js`: Handles the payment-related routes, such as capturing the payment and verifying the signature from Razorpay.
-   `ContactUs.js`: Defines the route for the "Contact Us" form.

---

## Controllers (`controllers/`)

Controllers contain the core business logic of the application. When a request hits a route, the corresponding controller function is executed.

-   **Responsibilities**:
    -   Validating the request body and parameters.
    -   Interacting with the models to perform CRUD (Create, Read, Update, Delete) operations on the database.
    -   Calling utility functions for tasks like sending emails or uploading images.
    -   Handling errors and sending back an appropriate JSON response to the client.

-   **Example Files**:
    -   `Auth.js`: Contains logic for `login`, `signup`, `sendotp`, `changePassword`.
    -   `Profile.js`: Logic for `updateProfile`, `deleteAccount`, `getUserDetails`.
    -   `Course.js`: Logic for `createCourse`, `getCourseDetails`, `editCourse`.
    -   `Section.js` & `SubSection.js`: Logic for managing course content.
    -   `Payments.js`: Logic for `capturePayment` and `verifySignature`.
    -   `RatingAndReviews.js`: Logic for creating and fetching ratings.

---

## Middlewares (`middlewares/`)

Middlewares are functions that have access to the request (`req`), response (`res`), and the `next` function in the application’s request-response cycle. They can execute code, make changes to the request and response objects, and end the cycle or pass control to the next middleware.

-   `auth.js`: This is the most critical middleware.
    -   `auth`: It verifies the JWT token sent in the request headers or cookies. If the token is valid, it decodes it to get the user's information (like ID and role) and attaches it to the `req` object (`req.user`). If the token is missing or invalid, it returns an "unauthorized" error.
    -   `isStudent`, `isInstructor`, `isAdmin`: These are authorization middlewares. They check the role of the user (which was added to `req.user` by the `auth` middleware) to ensure they have the necessary permissions to access a particular route. For example, `createCourse` would be protected by `isInstructor`.

---

## Models (`models/`)

This directory contains the Mongoose schemas for all the data collections in MongoDB. A schema defines the structure of the documents within a collection, including the data types, default values, and validators.

-   `User.js`: Defines the schema for users, including fields like `firstName`, `lastName`, `email`, `password`, `role`, `courses` (courses they are enrolled in), and a reference to their `Profile`.
-   `Profile.js`: A separate schema for user profile details like `gender`, `dateOfBirth`, `about`, `contactNumber`. This is linked one-to-one with the `User` model.
-   `Course.js`: The schema for courses, including `courseName`, `courseDescription`, `instructor`, `price`, `thumbnail`, `category`, and references to `Section`s and `RatingAndReview`s.
-   `Section.js`: Schema for a course section (a module or chapter).
-   `SubSection.js`: Schema for a subsection within a section (e.g., a single video lecture). Contains the video URL.
-   `OTP.js`: A temporary collection to store One-Time Passwords for email verification.
-   `RatingAndReview.js`: Stores ratings and reviews given by students for a course.
-   `CourseProgress.js`: Tracks which videos a student has completed in a course.

---

## Utilities (`utils/`)

This directory holds reusable helper functions that can be used across different parts of the application.

-   `imageUploader.js`: A utility function that takes a file (e.g., an image) and uploads it to Cloudinary. It returns the secure URL of the uploaded file.
-   `mailSender.js`: A generic function for sending emails using Nodemailer. It takes the recipient's email, title, and body as arguments and sends the email.
-   `secToDuration.js`: A small helper to convert a duration in seconds into a more human-readable format (e.g., "1h 30m 5s").

---

## Mail (`mail/`)

This directory is responsible for email-related functionalities.

-   `templates/`: Contains JavaScript files that export functions to generate HTML email templates. These templates are used for various purposes:
    -   `emailVerificationTemplate.js`: The email template for sending an OTP for email verification.
    -   `courseEnrollmentEmail.js`: The confirmation email sent to a user after they successfully enroll in a course.
    -   `passwordUpdate.js`: The email confirming that a user's password has been updated.
    -   `paymentSuccess.js`: The email with payment confirmation details.

---

## Feature Walkthroughs

### User Authentication Flow

This section provides a deep dive into the authentication and authorization mechanisms in StudyNotion.

#### Models Involved

-   **`User.js`**: The primary model for storing user information. Key fields for authentication are `email`, `password`, and `role`. The password is not stored in plain text; it's hashed using `bcrypt`.
-   **`OTP.js`**: A temporary model used specifically for the signup process. It stores the user's email and the One-Time Password (OTP) sent to them. Each OTP document has a `createdAt` field with a TTL (Time-To-Live) index, which automatically deletes the OTP from the database after a short period (e.g., 5 minutes) to ensure it cannot be used later.

---

#### Signup and OTP Verification

The signup process is a two-step flow to ensure that the user provides a valid and accessible email address.

**Step 1: Sending the OTP**

1.  **API Call**: The frontend sends a `POST` request to `/api/v1/auth/sendotp` with the user's email.
2.  **Controller (`Auth.js` -> `sendotp`)**:
    -   **Validation**: It first checks if a user with the given email already exists in the `User` collection. If so, it returns an error.
    -   **OTP Generation**: A random 4-digit OTP is generated using a library like `otp-generator`.
    -   **Store OTP**: The generated OTP and the user's email are saved as a new document in the `OTP` collection.
    -   **Send Email**: The `mailSender` utility is called with the `emailVerificationTemplate`. This utility uses Nodemailer to send a formatted HTML email containing the OTP to the user.
    -   **Response**: A success response is sent to the frontend, indicating that the OTP has been sent.

**Step 2: Verifying OTP and Creating User**

1.  **API Call**: The frontend collects all user details (firstName, lastName, password, etc.) along with the OTP received via email and sends a `POST` request to `/api/v1/auth/signup`.
2.  **Controller (`Auth.js` -> `signup`)**:
    -   **OTP Verification**:
        -   It queries the `OTP` collection to find the most recent OTP sent to that email address.
        -   If no OTP is found, it means the OTP has expired (due to the TTL index) or was never sent, and it returns an error.
        -   It compares the OTP from the request body with the one found in the database. If they don't match, it's an invalid OTP, and an error is returned.
    -   **Password Hashing**: If the OTP is valid, the user's plain-text password is securely hashed using `bcrypt.hash()`. This is a one-way process, meaning the original password cannot be recovered from the hash.
    -   **User Creation**:
        -   A new `Profile` document is created with additional user details.
        -   A new `User` document is created, storing the hashed password and a reference to the newly created `Profile` document.
    -   **Response**: A success message is sent back to the frontend.

---

#### Login and JWT Explained

**How JWT (JSON Web Token) Works**

A JWT is a compact and self-contained way for securely transmitting information between parties as a JSON object. In StudyNotion, it's used to manage user sessions. A JWT consists of three parts separated by dots (`.`):

1.  **Header**: Contains the type of token (JWT) and the signing algorithm (e.g., HS256).
2.  **Payload**: Contains the "claims" or data. For StudyNotion, this includes the user's `_id`, `email`, and `role`. This is the information the backend will use to identify the user in subsequent requests. It also includes an expiration time (`exp`).
3.  **Signature**: This is created by taking the encoded header, the encoded payload, a secret key (stored in `.env` as `JWT_SECRET`), and signing it with the algorithm specified in the header.

The signature is crucial. Since the backend is the only one that knows the `JWT_SECRET`, it's the only one that can create a valid signature.

**Login Flow**

1.  **API Call**: The frontend sends a `POST` request to `/api/v1/auth/login` with the user's `email` and `password`.
2.  **Controller (`Auth.js` -> `login`)**:
    -   **Find User**: It looks for a user with the provided email in the `User` collection. If not found, it returns an error.
    -   **Password Comparison**: It uses `bcrypt.compare()` to compare the plain-text password from the request with the hashed password stored in the database.
    -   **JWT Generation**: If the passwords match, it generates a JWT.
        -   The payload is created with the user's ID, email, and role.
        -   The `jsonwebtoken.sign()` method is called with the payload, the `JWT_SECRET`, and an expiration time.
    -   **Response**: The generated JWT is sent back to the client inside an HTTP-only cookie. This is a security measure to prevent XSS attacks from accessing the token via JavaScript. The user's data is also sent in the JSON response.

**Authenticated Requests**

For any subsequent request to a protected route (e.g., `/api/v1/profile/updateProfile`):

1.  **Frontend**: The browser automatically sends the cookie containing the JWT with the request.
2.  **Backend Middleware (`auth.js` -> `auth`)**:
    -   This middleware runs before the controller. It extracts the JWT from the cookie.
    -   It uses `jsonwebtoken.verify()` with the token and the `JWT_SECRET`. This function does two things:
        1.  It checks if the token has expired.
        2.  It recalculates the signature using the header and payload from the token and compares it to the signature part of the token. If they don't match, it means the token has been tampered with.
    -   If verification is successful, the decoded payload (containing user ID, role, etc.) is attached to the `req` object (e.g., `req.user`).
    -   The `next()` function is called, passing control to the next middleware or the final controller.

---

#### Password Reset Flow

This flow allows users who have forgotten their password to reset it securely.

**Why do we need a token for this?**

We need a secure and temporary way to identify the user who is authorized to reset the password, without asking them for their old password (which they've forgotten). The token serves as a temporary, single-use "password" that proves the user has access to the email account associated with their StudyNotion profile.

**Step 1: Generating and Sending the Reset Token**

1.  **API Call**: The frontend sends a `POST` request to `/api/v1/auth/reset-password-token` with the user's email.
2.  **Controller (`ResetPassword.js` -> `resetPasswordToken`)**:
    -   **Find User**: It checks if a user with that email exists.
    -   **Token Generation**: It generates a unique, random token using `crypto.randomUUID()`. This is different from a JWT; it's just a random string that will be temporarily stored in the database.
    -   **Update User**: It updates the `User` document, setting two new fields:
        -   `token`: Stores the generated random string.
        -   `resetPasswordExpires`: Sets an expiration time for the token (e.g., 5 minutes from now).
    -   **Send Email**: It sends an email to the user. This email contains a link to the frontend's password reset page, with the token included as a URL parameter (e.g., `https://studynotion.com/update-password/a1b2-c3d4-e5f6`).

**Step 2: Resetting the Password**

1.  **Frontend**: The user clicks the link in their email, is taken to the reset password page, and enters their new password. The frontend then sends a `POST` request to `/api/v1/auth/reset-password`. The request body includes the `newPassword`, `confirmNewPassword`, and the `token` from the URL.
2.  **Controller (`ResetPassword.js` -> `resetPassword`)**:
    -   **Find User by Token**: It queries the `User` collection to find a user who has the matching `token` and whose `resetPasswordExpires` time is in the future (`$gt: Date.now()`). This ensures the token is valid and has not expired.
    -   **Hash New Password**: If a user is found, it hashes the new password with `bcrypt`.
    -   **Update User**: It updates the user's `password` field with the new hash. It also clears the `token` and `resetPasswordExpires` fields so the token cannot be used again.
    -   **Response**: A success message is sent, and the user can now log in with their new password.

### Course Creation Flow (Instructor)

1.  **Frontend**: An instructor fills out the form to create a new course.
2.  **Backend**: A `POST` request is sent to `/api/v1/course/createCourse`.
3.  **Middleware (`auth.js`)**: The `auth` and `isInstructor` middlewares are executed first. They verify the user's token and check if their role is "Instructor".
4.  **Controller (`Course.js`)**: The `createCourse` function is executed.
    -   It validates the incoming data (course name, description, etc.).
    -   It calls the `imageUploader` utility to upload the course thumbnail to Cloudinary.
    -   It creates a new `Course` document in the database with all the provided details and the thumbnail URL.
    -   It updates the instructor's `User` document to add the new course to their list of created courses.
5.  **Response**: The newly created course object is sent back to the frontend.

### Course Content Management (for Instructors)

Once a course is created, the instructor needs to add content to it, organized into sections and subsections.

#### Models Involved

-   **`Course.js`**: The parent document. It contains an array of `ObjectId`s referencing the `Section` documents that belong to it.
-   **`Section.js`**: Represents a module or chapter of a course. It contains an array of `ObjectId`s referencing its `SubSection` documents.
-   **`SubSection.js`**: Represents a single piece of content, like a video lecture. It contains the `title`, `description`, and `videoUrl`.

#### Creating a Section

1.  **API Call**: `POST /api/v1/course/addSection` with `courseId` and `sectionName` in the body.
2.  **Middleware**: `auth` and `isInstructor` are checked.
3.  **Controller (`Section.js` -> `createSection`)**:
    -   It creates a new `Section` document with the given name.
    -   It then updates the corresponding `Course` document by pushing the `_id` of the new section into its `courseContent` array.
    -   The populated course (showing the new section) is returned.

#### Creating a Sub-Section (Video Upload)

1.  **API Call**: `POST /api/v1/course/addSubSection` with `sectionId`, `title`, `description`, and the video file.
2.  **Middleware**: `auth` and `isInstructor` are checked.
3.  **Controller (`Subsection.js` -> `createSubSection`)**:
    -   The video file from the request is passed to the `imageUploader` utility (which handles both images and videos) to upload it to Cloudinary.
    -   A new `SubSection` document is created with the title, description, and the secure `videoUrl` returned from Cloudinary.
    -   The corresponding `Section` document is updated by pushing the `_id` of the new subsection into its `subSection` array.
    -   The updated section is returned as the response.

This nested structure allows for a well-organized course curriculum that is efficient to query and display on the frontend.

### Payment Flow

1.  **Frontend**: A student clicks "Buy Now" for a course.
2.  **Backend**: A `POST` request is sent to `/api/v1/payment/capturePayment`.
3.  **Middleware**: `auth` and `isStudent` middlewares protect this route.
4.  **Controller (`Payments.js`)**: The `capturePayment` function is called.
    -   It uses the `razorpay` instance to create an "order" with the course amount.
    -   It returns the `order_id` and other details to the frontend.
5.  **Frontend**: The Razorpay checkout modal opens with the order details. The user completes the payment.
6.  **Razorpay**: After a successful payment, Razorpay sends a webhook or the frontend sends a request to the backend to verify the payment.
7.  **Backend**: `POST /api/v1/payment/verifySignature` is called.
    -   **Controller (`Payments.js`)**: The `verifySignature` function uses a crypto utility to verify that the signature received from Razorpay is genuine.
    -   If the signature is valid, it finds the student and the course and updates the `User` model to enroll the student in the course and the `Course` model to add the student to its `studentsEnrolled` list.
    -   It sends a confirmation email using the `courseEnrollmentEmail` template.
8.  **Response**: A success message is sent back to the frontend.


### User Profile Management

This flow covers how users can view and manage their personal information and enrolled courses.

#### Models Involved

-   **`User.js`**: Contains the primary user data and a reference to the `Profile` document.
-   **`Profile.js`**: Stores extended user details like `dateOfBirth`, `about`, and `contactNumber`.
-   **`Course.js`**: Used to retrieve details about the courses a user is enrolled in.

#### Viewing and Updating Profile Details

1.  **API Call (Update)**: To update their profile, the frontend sends a `PUT` request to `/api/v1/profile/updateProfile` with the fields to be updated (e.g., `about`, `contactNumber`).
2.  **Middleware**: The `auth` middleware runs to verify the user's identity.
3.  **Controller (`Profile.js` -> `updateProfile`)**:
    -   It retrieves the user's ID from `req.user`.
    -   It finds the user's `Profile` document using the `profile` reference stored in the `User` document.
    -   It updates the fields in the `Profile` document with the new data from the request body.
    -   A success response with the updated profile is sent back.

#### Updating Profile Picture

1.  **API Call**: `PUT /api/v1/profile/updateDisplayPicture` with the image file sent as form-data.
2.  **Middleware**: `auth` middleware is executed.
3.  **Controller (`Profile.js` -> `updateDisplayPicture`)**:
    -   The image file is passed to the `imageUploader` utility to upload it to Cloudinary.
    -   The `image` field in the user's `User` document is updated with the new secure URL returned from Cloudinary.
    -   A success response with the new image URL is sent back.

#### Fetching Enrolled Courses

1.  **API Call**: `GET /api/v1/profile/getEnrolledCourses`.
2.  **Middleware**: `auth` middleware is executed.
3.  **Controller (`Profile.js` -> `getEnrolledCourses`)**:
    -   It retrieves the user's ID from `req.user`.
    -   It finds the `User` document and uses `.populate("courses")` to fetch the full details of all courses whose `_id`s are in the user's `courses` array.
    -   This populated list of courses is returned to the frontend to be displayed on the user's dashboard.

### Course Progress Tracking

This feature is essential for students to keep track of their learning journey.

#### Models Involved

-   **`CourseProgress.js`**: This is the central model for this feature. Each document maps a `userId` to a `courseId` and contains an array `completedVideos` which stores the `_id`s of the `SubSection` documents (videos) the user has completed.
-   **`User.js`**: Contains the `courseProgress` array which references the `CourseProgress` documents.
-   **`SubSection.js`**: The video content that is being marked as complete.

#### Marking a Video as Complete

1.  **API Call**: When a student finishes a video, the frontend sends a `POST` request to `/api/v1/course/updateCourseProgress` with the `courseId` and `subsectionId` (the video they just watched).
2.  **Middleware**: `auth` and `isStudent` middlewares are checked.
3.  **Controller (`Course.js` -> `updateCourseProgress`)**:
    -   It retrieves the user's ID from `req.user`.
    -   It uses `CourseProgress.findOne()` to find the document corresponding to the `userId` and `courseId`.
    -   It checks if the `subsectionId` is already in the `completedVideos` array. If it is, the function exits gracefully (as there's nothing to update).
    -   If not, it pushes the `subsectionId` into the `completedVideos` array.
    -   The updated `CourseProgress` document is saved.
    -   A success response is sent back.

This allows the frontend to fetch the `CourseProgress` for a user and course, compare the `completedVideos` with the course's total subsections, and display a progress bar or checkmarks next to completed lectures.


### Rating and Review System

This feature allows students to provide feedback on courses, which is vital for quality control and for other students to make informed decisions.

#### Models Involved

-   **`RatingAndReview.js`**: Stores the rating (1-5 stars), the review text, a reference to the `user` who wrote it, and a reference to the `course` it's for.
-   **`Course.js`**: Contains an array of references to all `RatingAndReview` documents associated with it. This allows for easy calculation of average ratings.
-   **`User.js`**: To verify that the user is enrolled in the course before they can leave a review.

#### Creating a Rating and Review

1.  **API Call**: A student who has purchased a course submits a `POST` request to `/api/v1/course/createRating` with `courseId`, `rating` (e.g., 4), and `review` text.
2.  **Middleware**: `auth` and `isStudent` middlewares are executed to ensure the user is a logged-in student.
3.  **Controller (`RatingAndReviews.js` -> `createRating`)**:
    -   **Validation**: The controller first checks if the student is actually enrolled in the course by looking for the `courseId` in the user's `courses` array.
    -   **Prevent Duplicate Reviews**: It then checks if this user has already submitted a review for this course to prevent spamming.
    -   **Create Review**: If the checks pass, it creates a new `RatingAndReview` document with the user's ID, course ID, rating, and review text.
    -   **Update Course**: It pushes the `_id` of the new review into the `ratingAndReviews` array of the corresponding `Course` document.
    -   **Response**: A success message is returned.

#### Fetching Ratings

-   **Get Average Rating**: The `getAverageRating` controller function takes a `courseId`, finds all associated reviews, and calculates the average rating. This can be called on a course page.
-   **Get All Ratings for a Course**: The `getReviews` function fetches and populates all review documents for a specific course, including the reviewer's profile details, to display on the course page.
