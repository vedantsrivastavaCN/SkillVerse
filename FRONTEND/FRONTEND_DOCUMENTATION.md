# StudyNotion Frontend Documentation

This document provides an in-depth explanation of the frontend architecture and workflow for the StudyNotion application. It is designed to help developers understand the structure, state management, component design, and data flow of the React application.

## Table of Contents

1.  [High-Level Overview](#high-level-overview)
2.  [Project Structure](#project-structure)
3.  [Core Concepts](#core-concepts)
    -   [State Management with Redux Toolkit](#state-management-with-redux-toolkit)
    -   [Routing with React Router](#routing-with-react-router)
    -   [API Layer](#api-layer)
    -   [Styling with Tailwind CSS](#styling-with-tailwind-css)
4.  [Directory Breakdown](#directory-breakdown)
5.  [Feature Walkthroughs (Frontend Perspective)](#feature-walkthroughs-frontend-perspective)
    -   [User Authentication Flow](#user-authentication-flow)
    -   [User Profile Management](#user-profile-management)
    -   [Instructor Course Management](#instructor-course-management)
    -   [Student Course Viewing & Progress Tracking](#student-course-viewing--progress-tracking)
    -   [Rating and Review System](#rating-and-review-system)
    -   [Payment and Enrollment Flow](#payment-and-enrollment-flow)

---

## High-Level Overview

The StudyNotion frontend is a modern Single Page Application (SPA) built with **React**. It provides a dynamic and responsive user interface for students, instructors, and administrators.

-   **Framework**: React.js
-   **State Management**: Redux Toolkit for a centralized, predictable state container.
-   **Routing**: React Router DOM for client-side navigation.
-   **API Communication**: `axios` is used for making HTTP requests to the backend.
-   **Styling**: Tailwind CSS for a utility-first CSS workflow, enabling rapid UI development.
-   **Form Handling**: React Hook Form for performant and easy-to-manage forms.
-   **Notifications**: React Hot Toast for displaying user-friendly notifications (toasts).

---

## Project Structure

The `src` directory is the heart of the application and is organized to separate concerns, making the codebase modular and maintainable.

```
src/
├── assets/         # Static assets like images, logos, and videos.
├── components/     # Reusable UI components.
│   ├── common/     # Very generic components (Button, Icon, etc.).
│   └── core/       # Components specific to a feature or page (e.g., Dashboard, Course).
├── data/           # Static data used across the app (e.g., navbar links, footer links).
├── hooks/          # Custom React hooks for shared logic.
├── pages/          # Top-level components that correspond to a page/route.
├── reducers/       # Combines all Redux slices into a single root reducer.
├── services/       # The API layer for communicating with the backend.
│   ├── apis.js     # A dictionary of all backend API endpoints.
│   ├── apiConnector.js # A generic axios-based function to make API calls.
│   └── operations/ # Functions that orchestrate API calls and state updates.
├── slices/         # Redux Toolkit "slices" for managing different parts of the state.
├── utils/          # Utility/helper functions.
├── App.js          # Main component, sets up routing.
├── index.js        # Entry point, renders App and sets up Redux store.
└── swDev.js        # Service Worker registration logic.
```

---

## Core Concepts

### State Management with Redux Toolkit

Redux is used to manage the global state of the application. This is crucial for sharing data between components without "prop drilling". Redux Toolkit simplifies this process.

-   **Store**: The single source of truth for the application's state. It's configured in `index.js`.
-   **Slices (`slices/`)**: The state is broken down into "slices". Each slice manages a specific piece of the state (e.g., `authSlice`, `cartSlice`, `profileSlice`). A slice defines:
    -   An initial state.
    -   "Reducers": Functions that handle state changes in response to actions.
-   **Actions**: Plain JavaScript objects that describe a state change. Components `dispatch` actions.
-   **Selectors**: Functions that allow components to read data from the Redux store. The `useSelector` hook from `react-redux` is used for this.

**Example Flow**:
1.  A user logs in.
2.  The `Login` component calls a function from `services/operations/authAPI.js`.
3.  This function makes an API call. On success, it dispatches a `setToken` action from `authSlice`.
4.  The reducer in `authSlice` updates the `token` in the Redux store.
5.  Any component subscribed to this part of the state (like the `Navbar`) will automatically re-render to reflect the change (e.g., showing a "Profile" button instead of "Log In").

### Routing with React Router

React Router handles all client-side navigation.

-   **`App.js`**: This file defines all the routes for the application using `<Routes>` and `<Route>`.
-   **Route Protection**: The application likely uses a custom component (e.g., `<PrivateRoute>`) to protect routes that require authentication. This component checks the `token` in the `authSlice` and redirects to the login page if the user is not authenticated.
-   **Role-Based Access**: The same `<PrivateRoute>` can be extended to check the user's `role` (also in `authSlice`) to restrict access to certain pages (e.g., only allowing "Instructor" roles to access the dashboard for creating courses).

### API Layer (`services/`)

All communication with the backend is centralized in the `services` directory. This is a critical pattern for keeping the UI components clean and separating concerns.

-   **`apis.js`**: This file acts as a dictionary, mapping human-readable names to the actual backend API endpoints (e.g., `LOGIN_API: "/api/v1/auth/login"`). This makes it easy to update endpoints in one place.
-   **`apiConnector.js`**: This is a generic function that takes an HTTP method, URL, body, headers, etc., and executes an `axios` call. It's the single point of contact for all outgoing requests.
-   **`operations/`**: This is the most important part of the API layer. Files here (e.g., `authAPI.js`, `courseAPI.js`) export functions that UI components can call. These functions encapsulate the entire logic of an operation:
    1.  Displaying a loading indicator/toast.
    2.  Calling the `apiConnector` to make the actual API request.
    3.  Handling the response (success or error).
    4.  Dispatching Redux actions to update the state.
    5.  Showing a final success/error toast.
    6.  Returning data to the component if needed.

### Styling with Tailwind CSS

Tailwind CSS is used for styling. Instead of writing traditional CSS files, styles are applied directly in the JSX using utility classes (e.g., `className="bg-blue-500 text-white p-4"`). This allows for rapid and consistent UI development. The configuration is in `tailwind.config.js`.

---

## Directory Breakdown

-   **`pages/`**: Each file here represents a full page view (e.g., `Home.jsx`, `Login.jsx`, `CourseDetails.jsx`). They are responsible for the layout of the page and composing components from the `components/` directory.
-   **`components/`**: Contains all the reusable UI building blocks.
    -   `common/`: Highly reusable, generic components like `Button.jsx`, `Modal.jsx`, `Spinner.jsx`. They know nothing about the application's business logic.
    -   `core/`: More complex components that are specific to a feature area but might be used on multiple pages. For example, `core/Dashboard/Sidebar.jsx` or `core/Course/CourseCard.jsx`.
-   **`hooks/`**: Custom hooks that encapsulate reusable logic, such as `useOnClickOutside.js` to detect clicks outside a component (useful for closing dropdowns or modals).

---

## Feature Walkthroughs (Frontend Perspective)

### User Authentication Flow

This section provides a deep dive into the authentication flow from the frontend perspective, including detailed Redux interactions.

#### Redux Slices Involved

-   **`authSlice`**: Manages authentication state including `token`, `user`, `loading`, and `signupData`.

#### Signup and OTP Verification

**Step 1: Sending the OTP**

1.  **Component**: User navigates to `/signup` route, which renders the `Signup.jsx` page component.
2.  **Form Component**: `Signup.jsx` renders a `SignupForm` component that uses `react-hook-form` for form management.
3.  **Form Submission**: When user submits the form with their email, the `onSubmit` handler calls `sendOtp(email, navigate)` from `services/operations/authAPI.js`.
4.  **Redux Action**: Inside `sendOtp`, the function first dispatches `setLoading(true)` action to `authSlice`.
5.  **API Call**: The function calls `apiConnector` with the `SENDOTP_API` endpoint and the user's email.
6.  **Response Handling**: 
    -   On success: Shows success toast, temporarily stores `signupData` in `authSlice` using `setSignupData()`, and navigates to `/verify-email`.
    -   On error: Shows error toast and dispatches `setLoading(false)`.
7.  **UI Update**: The `Navbar` and other components reading from `authSlice.loading` will show/hide loading indicators accordingly.

**Step 2: OTP Verification and Account Creation**

1.  **Component**: User is now on `/verify-email` page which renders `VerifyEmail.jsx`.
2.  **OTP Input**: Component uses `react-otp-input` to capture the 6-digit OTP.
3.  **Form Submission**: When user submits OTP, it calls `signUp(signupData, otp, navigate)` from `authAPI.js`.
4.  **Redux State**: The function reads `signupData` from `authSlice` (which contains firstName, lastName, email, password, etc.).
5.  **API Call**: Makes API call to `SIGNUP_API` with combined data.
6.  **Success Flow**:
    -   Dispatches `setToken(token)` to store JWT in Redux state.
    -   Dispatches `setUser(user)` to store user data.
    -   Stores token in `localStorage` for persistence.
    -   Clears `signupData` from Redux.
    -   Navigates to dashboard based on user role.
7.  **Component Re-render**: All components subscribed to `authSlice` (like `Navbar`) re-render to reflect logged-in state.

#### Login Flow

1.  **Component**: User visits `/login` which renders `Login.jsx` component.
2.  **Form Handling**: Uses `react-hook-form` for email/password form.
3.  **API Call**: On submission, calls `login(email, password, navigate)` from `authAPI.js`.
4.  **Redux Flow**:
    -   Dispatches `setLoading(true)`.
    -   Makes API call to `LOGIN_API`.
    -   On success: Dispatches `setToken()` and `setUser()`, stores token in localStorage.
    -   On error: Shows error toast.
5.  **Navigation**: Redirects to appropriate dashboard based on user role stored in Redux.

### User Profile Management

This covers how users view and update their profile information through the frontend.

#### Redux Slices Involved

-   **`profileSlice`**: Manages user profile data and loading states.
-   **`authSlice`**: Contains the current user data that gets updated.

#### Viewing Profile

1.  **Component**: User navigates to `/dashboard/my-profile` which renders `MyProfile.jsx`.
2.  **Data Fetching**: Component uses `useSelector` to read user data from `authSlice.user`.
3.  **Display**: Shows user's firstName, lastName, email, image, and additional profile fields.

#### Updating Profile Information

1.  **Component**: User clicks "Edit" which renders `EditProfile.jsx` modal/form.
2.  **Form Pre-population**: Form is pre-populated with current user data from Redux using `defaultValues` in `react-hook-form`.
3.  **Form Submission**: On submit, calls `updateProfile(formData, token)` from `services/operations/profileAPI.js`.
4.  **Redux Flow**:
    -   Dispatches `setLoading(true)` to `profileSlice`.
    -   Makes API call to `UPDATE_PROFILE_API`.
    -   On success: Dispatches `setUser()` to update user data in `authSlice`.
    -   Shows success toast and closes modal.
5.  **UI Update**: `MyProfile` component automatically re-renders with updated data due to Redux subscription.

#### Updating Profile Picture

1.  **Component**: User clicks on profile picture which opens file input or `ImageUpload.jsx` component.
2.  **File Selection**: Uses `react-dropzone` or native file input to select image.
3.  **Preview**: Shows image preview before upload.
4.  **Upload Process**:
    -   Creates `FormData` object with selected file.
    -   Calls `updateDisplayPicture(formData, token)` from `profileAPI.js`.
    -   Function makes API call to `UPDATE_DISPLAY_PICTURE_API`.
5.  **Redux Update**: On success, updates user image URL in `authSlice` which triggers re-render of all components showing user avatar (Navbar, Profile, etc.).

### Instructor Course Management

Detailed flow for instructors creating and managing courses.

#### Redux Slices Involved

-   **`courseSlice`**: Manages course creation state, current course being edited, and course lists.
-   **`authSlice`**: For instructor verification and token.

#### Creating a New Course

1.  **Navigation**: Instructor navigates to `/dashboard/add-course` which renders `AddCourse.jsx`.
2.  **Multi-Step Form**: Component manages step state using `useState` (steps: Course Info, Course Builder, Publish).
3.  **Step 1 - Course Information**:
    -   Renders `CourseInformationForm.jsx` component.
    -   Uses `react-hook-form` for form management.
    -   Includes fields: courseName, courseDescription, price, category, thumbnail.
    -   Uses `react-dropzone` for thumbnail upload.
4.  **Form Submission**: On submit, calls `addCourseDetails(formData, token)` from `services/operations/courseDetailsAPI.js`.
5.  **Redux Flow**:
    -   Creates `FormData` with course info and thumbnail file.
    -   Makes API call to `CREATE_COURSE_API`.
    -   On success: Dispatches `setCourse()` to store new course data in `courseSlice`.
    -   Advances to next step.

#### Course Builder (Adding Sections and Videos)

1.  **Step 2 - Course Builder**: Renders `CourseBuilderForm.jsx`.
2.  **Section Management**:
    -   Component displays existing sections from `courseSlice.course.courseContent`.
    -   "Add Section" button opens `CreateSection.jsx` modal.
3.  **Creating Section**:
    -   Modal form calls `createSection(sectionName, courseId, token)` from `courseDetailsAPI.js`.
    -   API call to `CREATE_SECTION_API`.
    -   On success: Updates course data in `courseSlice` with new section.
    -   Re-renders course builder to show new section.
4.  **Adding Subsection (Video)**:
    -   "Add Lecture" button opens `CreateSubsection.jsx` modal.
    -   Form includes title, description, and video file upload.
    -   Uses `react-dropzone` for video file handling.
    -   Calls `createSubSection(subsectionData, token)` from `courseDetailsAPI.js`.
    -   Makes API call to `CREATE_SUBSECTION_API` with `FormData`.
5.  **Redux Updates**: Each successful section/subsection creation updates the course structure in `courseSlice`, triggering UI re-renders to show the updated course outline.

#### Publishing Course

1.  **Step 3 - Publish**: Renders `PublishCourse.jsx` with final review and publish options.
2.  **Publish Action**: Calls `publishCourse(courseId, status, token)` from `courseDetailsAPI.js`.
3.  **Redux Cleanup**: On successful publish, clears course creation state and navigates to instructor dashboard.

### Student Course Viewing & Progress Tracking

How students interact with courses and track their progress.

#### Redux Slices Involved

-   **`viewCourseSlice`**: Manages current course being viewed, progress data, and video player state.
-   **`authSlice`**: For student verification and enrollment status.

#### Accessing Enrolled Course

1.  **Navigation**: Student clicks on enrolled course from dashboard, navigates to `/view-course/:courseId`.
2.  **Route Component**: Renders `ViewCourse.jsx` which acts as layout wrapper.
3.  **Data Fetching**: Uses `useEffect` to call `getFullDetailsOfCourse(courseId, token)` from `courseDetailsAPI.js`.
4.  **Redux Flow**:
    -   Dispatches `setLoading(true)` to `viewCourseSlice`.
    -   Makes API call to fetch complete course data and user's progress.
    -   Dispatches `setCourseData()` and `setProgress()` to store in Redux.

#### Course Sidebar Navigation

1.  **Component**: `VideoDetailsSidebar.jsx` component renders course outline.
2.  **Data Source**: Reads course sections and subsections from `viewCourseSlice.courseData`.
3.  **Progress Indication**: For each video, checks if subsection ID exists in `viewCourseSlice.completedVideos` array to show completion status.
4.  **Navigation**: Clicking on video calls navigation function that updates current video in Redux and URL.

#### Video Player and Progress Tracking

1.  **Component**: `VideoDetails.jsx` renders video player using `video-react` library.
2.  **Video Loading**: Reads current video URL from `viewCourseSlice.currentVideo`.
3.  **Progress Tracking**: 
    -   Video player has `onEnded` event handler.
    -   When video ends, calls `markVideoAsComplete(courseId, subsectionId, token)` from `courseDetailsAPI.js`.
4.  **API Call**: Makes call to `LECTURE_COMPLETION_API` endpoint.
5.  **Redux Update**: On success, adds subsection ID to `completedVideos` array in `viewCourseSlice`.
6.  **UI Update**: Sidebar re-renders to show newly completed video with checkmark or completion indicator.

#### Progress Calculation

1.  **Component**: Progress bar component calculates completion percentage.
2.  **Calculation**: Divides length of `completedVideos` array by total number of subsections.
3.  **Display**: Shows progress bar and percentage using `@ramonak/react-progress-bar`.

### Rating and Review System

How students can rate and review courses they've completed.

#### Redux Slices Involved

-   **`courseSlice`**: May store ratings data for courses.
-   **`authSlice`**: For user authentication and enrollment verification.

#### Submitting a Rating and Review

1.  **Trigger**: Student who has completed course sees "Rate this Course" button on course completion page or in course viewer.
2.  **Component**: Clicking opens `RatingModal.jsx` component.
3.  **Form Elements**:
    -   Uses `react-rating-stars-component` for star rating input.
    -   Text area for review comment.
    -   Uses `react-hook-form` for form management.
4.  **Form Submission**: Calls `createRating(ratingData, token)` from `courseDetailsAPI.js`.
5.  **API Flow**:
    -   Makes call to `CREATE_RATING_API`.
    -   Backend verifies user is enrolled and hasn't already reviewed.
    -   Returns success/error response.
6.  **UI Feedback**: Shows success toast and closes modal on successful submission.

#### Viewing Ratings and Reviews

1.  **Component**: `CourseReviews.jsx` component on course details page.
2.  **Data Fetching**: Calls `getCourseReviews(courseId)` from `courseDetailsAPI.js`.
3.  **Display**: Renders list of reviews with user avatars, names, ratings, and comments.
4.  **Average Rating**: Calculates and displays average rating from all reviews.

### Payment and Enrollment Flow

Complete flow for purchasing and enrolling in courses.

#### Redux Slices Involved

-   **`cartSlice`**: Manages shopping cart items.
-   **`authSlice`**: For user data and authentication.

#### Adding to Cart

1.  **Component**: `CourseCard.jsx` or `CourseDetails.jsx` has "Add to Cart" button.
2.  **Action**: Button click dispatches `addToCart(course)` action to `cartSlice`.
3.  **Redux Update**: Course is added to `cartSlice.items` array.
4.  **UI Update**: Cart icon in `Navbar` updates count by reading from `cartSlice.totalItems`.

#### Checkout Process

1.  **Navigation**: User clicks cart icon, navigates to `/dashboard/cart`.
2.  **Component**: Renders `Cart.jsx` component showing all cart items.
3.  **Purchase Trigger**: "Buy Now" button calls `buyCourse(courses, token, userDetails, navigate)` from `services/operations/studentFeaturesAPI.js`.

#### Payment Integration

1.  **Payment Initiation**: Function makes API call to `COURSE_PAYMENT_API`.
2.  **Razorpay Integration**:
    -   Backend returns Razorpay order details.
    -   Frontend creates Razorpay instance with order details.
    -   Opens Razorpay payment modal using `window.Razorpay()`.
3.  **Payment Handlers**:
    -   `onSuccess`: Calls `verifyPayment()` function with payment signature.
    -   `onFailure`: Shows error toast and handles failed payment.

#### Payment Verification

1.  **Verification**: `verifyPayment()` makes API call to `COURSE_VERIFY_API`.
2.  **Success Flow**:
    -   Backend enrolls user in courses.
    -   Frontend dispatches `resetCart()` to clear cart.
    -   Shows success toast.
    -   Navigates to enrolled courses page.
3.  **Redux Updates**: User's enrolled courses are updated in `authSlice.user.courses`.

#### Post-Purchase

1.  **Navigation**: User is redirected to `/dashboard/enrolled-courses`.
2.  **Component**: Renders `EnrolledCourses.jsx` showing newly purchased courses.
3.  **Data Refresh**: Component fetches updated user data to reflect new enrollments.
