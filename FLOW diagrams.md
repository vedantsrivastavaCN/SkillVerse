# SkillVerse Flow Diagrams

This document contains comprehensive flow diagrams for the StudyNotion application, showing system architecture and detailed feature flows with API routes and data flow.

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Authentication Flows](#authentication-flows)
   - [Signup with OTP Verification](#signup-with-otp-verification)
   - [Login Flow](#login-flow)
   - [Password Reset Flow](#password-reset-flow)
3. [Course Management Flows](#course-management-flows)
   - [Course Creation Flow](#course-creation-flow)
   - [Course Content Management](#course-content-management)
4. [Student Features](#student-features)
   - [Course Viewing and Progress Tracking](#course-viewing-and-progress-tracking)
   - [Course Enrollment and Payment](#course-enrollment-and-payment)
5. [Profile Management](#profile-management)
6. [Rating and Review System](#rating-and-review-system)

---

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend (React SPA)"
        A[User Interface]
        B[Redux Store]
        C[API Layer]
        D[Components]
        E[Pages]
        F[React Router]
    end
    
    subgraph "Backend (Node.js/Express)"
        G[Express Server]
        H[Routes]
        I[Controllers]
        J[Middlewares]
        K[Models]
        L[Utils]
    end
    
    subgraph "External Services"
        M[MongoDB Database]
        N[Cloudinary Media Storage]
        O[Razorpay Payment Gateway]
        P[Email Service SMTP]
    end
    
    subgraph "Authentication & Authorization"
        Q[JWT Tokens]
        R[bcrypt Password Hashing]
        S[Role-based Access Control]
    end
    
    A --> B
    A --> D
    A --> E
    D --> C
    E --> C
    F --> E
    B --> C
    
    C -->|HTTP Requests| G
    G --> H
    H --> J
    J --> I
    I --> K
    I --> L
    
    K -->|CRUD Operations| M
    L -->|File Uploads| N
    I -->|Payment Processing| O
    L -->|Email Sending| P
    
    J --> Q
    I --> R
    J --> S
    
    G -->|JSON Responses| C
    
    style A fill:#1e3a8a
    style B fill:#1e40af
    style G fill:#7c3aed
    style M fill:#9333ea
    style N fill:#7c2d12
    style O fill:#1e40af
    style P fill:#7c3aed
```

This architecture shows the complete data flow from frontend to backend and external services. The system follows a layered architecture with clear separation of concerns.

---

## Authentication Flows

### Signup with OTP Verification

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (React)
    participant RS as Redux Store
    participant BE as Backend (Express)
    participant DB as MongoDB
    participant ES as Email Service
    
    Note over U,ES: Step 1: Send OTP
    U->>FE: Enter email in signup form
    FE->>BE: POST /api/v1/auth/sendotp<br/>{email}
    BE->>DB: Check if user exists
    alt User already exists
        DB-->>BE: User found
        BE-->>FE: Error: User already exists
        FE-->>U: Show error message
    else User doesn't exist
        DB-->>BE: User not found
        BE->>BE: Generate 4-digit OTP
        BE->>DB: Store OTP in OTP collection<br/>(with TTL expiry)
        BE->>ES: Send OTP email using<br/>emailVerificationTemplate
        ES-->>U: OTP email delivered
        BE-->>FE: Success: OTP sent
        FE->>RS: setSignupData(email, formData)
        FE-->>U: Navigate to verify-email page
    end
    
    Note over U,ES: Step 2: Verify OTP and Create Account
    U->>FE: Enter OTP + complete signup form
    FE->>BE: POST /api/v1/auth/signup<br/>{firstName, lastName, email, password, otp}
    BE->>DB: Find latest OTP for email
    alt OTP not found or expired
        DB-->>BE: No valid OTP
        BE-->>FE: Error: Invalid or expired OTP
        FE-->>U: Show error message
    else Valid OTP found
        DB-->>BE: OTP retrieved
        BE->>BE: Compare OTP from request<br/>with stored OTP
        alt OTP doesn't match
            BE-->>FE: Error: Invalid OTP
            FE-->>U: Show error message
        else OTP matches
            BE->>BE: Hash password using bcrypt
            BE->>DB: Create Profile document
            BE->>DB: Create User document<br/>(with hashed password + profile ref)
            BE->>DB: Delete used OTP
            BE-->>FE: Success: Account created
            FE->>RS: Clear signupData
            FE-->>U: Navigate to login page
        end
    end
```

### Login Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (React)
    participant RS as Redux Store
    participant BE as Backend (Express)
    participant DB as MongoDB
    participant LS as LocalStorage
    
    U->>FE: Enter email and password
    FE->>BE: POST /api/v1/auth/login<br/>{email, password}
    BE->>DB: Find user by email
    alt User not found
        DB-->>BE: User not found
        BE-->>FE: Error: Invalid credentials
        FE-->>U: Show error message
    else User found
        DB-->>BE: User data retrieved
        BE->>BE: Compare password using<br/>bcrypt.compare()
        alt Password doesn't match
            BE-->>FE: Error: Invalid credentials
            FE-->>U: Show error message
        else Password matches
            BE->>BE: Generate JWT token<br/>Payload: {id, email, role}
            BE-->>FE: Success: {token, user}<br/>(HTTP-only cookie + JSON)
            FE->>RS: setToken(token)
            FE->>RS: setUser(user)
            FE->>LS: Store token in localStorage
            FE-->>U: Navigate to dashboard<br/>(based on user role)
            
            Note over FE,RS: All subsequent requests
            FE->>BE: Include JWT in cookie/header
            BE->>BE: Verify JWT in auth middleware
            BE->>BE: Decode user info from token
            BE->>BE: Attach user to req.user
        end
    end
```

### Password Reset Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant DB as MongoDB
    participant ES as Email Service
    
    Note over U,ES: Step 1: Request Password Reset
    U->>FE: Enter email for password reset
    FE->>BE: POST /api/v1/auth/reset-password-token<br/>{email}
    BE->>DB: Find user by email
    alt User not found
        DB-->>BE: User not found
        BE-->>FE: Error: Email not registered
        FE-->>U: Show error message
    else User found
        DB-->>BE: User data retrieved
        BE->>BE: Generate unique reset token<br/>using crypto.randomUUID()
        BE->>DB: Update user with:<br/>- token<br/>- resetPasswordExpires (5 min)
        BE->>ES: Send reset email with<br/>link containing token
        ES-->>U: Reset email delivered
        BE-->>FE: Success: Reset email sent
        FE-->>U: Show success message
    end
    
    Note over U,ES: Step 2: Reset Password
    U->>FE: Click reset link in email
    FE-->>U: Navigate to reset-password page<br/>(token in URL params)
    U->>FE: Enter new password
    FE->>BE: POST /api/v1/auth/reset-password<br/>{token, newPassword, confirmNewPassword}
    BE->>DB: Find user with matching token<br/>and resetPasswordExpires > now
    alt Token invalid or expired
        DB-->>BE: No matching user
        BE-->>FE: Error: Invalid or expired token
        FE-->>U: Show error message
    else Valid token found
        DB-->>BE: User retrieved
        BE->>BE: Hash new password using bcrypt
        BE->>DB: Update user:<br/>- password (hashed)<br/>- clear token<br/>- clear resetPasswordExpires
        BE-->>FE: Success: Password updated
        FE-->>U: Navigate to login page<br/>Show success message
    end
```

---

## Course Management Flows

### Course Creation Flow

```mermaid
sequenceDiagram
    participant I as Instructor
    participant FE as Frontend (React)
    participant RS as Redux Store (courseSlice)
    participant BE as Backend (Express)
    participant MW as Middleware (auth, isInstructor)
    participant DB as MongoDB
    participant CL as Cloudinary
    
    Note over I,CL: Step 1: Course Information
    I->>FE: Navigate to /dashboard/add-course
    FE-->>I: Render CourseInformationForm
    I->>FE: Fill course details + upload thumbnail
    FE->>FE: Create FormData with:<br/>- courseName, courseDescription<br/>- price, category, thumbnail file
    FE->>BE: POST /api/v1/course/createCourse<br/>(multipart/form-data)
    
    BE->>MW: Check auth middleware
    MW->>MW: Verify JWT token
    MW->>MW: Check isInstructor role
    MW-->>BE: User authorized
    
    BE->>CL: Upload thumbnail using imageUploader
    CL-->>BE: Return secure_url
    BE->>DB: Create Course document:<br/>- courseName, courseDescription<br/>- instructor: userId<br/>- price, category<br/>- thumbnail: secure_url
    BE->>DB: Update User document<br/>Add courseId to instructor's courses array
    BE-->>FE: Success: {course}
    FE->>RS: setCourse(course)
    FE-->>I: Navigate to Course Builder step
    
    Note over I,CL: Step 2: Course Builder (Add Sections)
    I->>FE: Click "Add Section"
    FE-->>I: Render CreateSection modal
    I->>FE: Enter section name
    FE->>BE: POST /api/v1/course/addSection<br/>{courseId, sectionName}
    
    BE->>MW: Check auth + isInstructor
    MW-->>BE: Authorized
    BE->>DB: Create Section document
    BE->>DB: Update Course.courseContent<br/>Push sectionId to array
    BE-->>FE: Success: {updatedCourse}
    FE->>RS: setCourse(updatedCourse)
    FE-->>I: Update course builder UI
    
    Note over I,CL: Step 3: Add SubSections (Videos)
    I->>FE: Click "Add Lecture" for section
    FE-->>I: Render CreateSubsection modal
    I->>FE: Enter title, description + upload video
    FE->>FE: Create FormData with:<br/>- sectionId, title, description<br/>- video file
    FE->>BE: POST /api/v1/course/addSubSection<br/>(multipart/form-data)
    
    BE->>MW: Check auth + isInstructor
    MW-->>BE: Authorized
    BE->>CL: Upload video using imageUploader
    CL-->>BE: Return video secure_url
    BE->>DB: Create SubSection document:<br/>- title, description<br/>- videoUrl: secure_url
    BE->>DB: Update Section.subSection<br/>Push subsectionId to array
    BE-->>FE: Success: {updatedSection}
    FE->>RS: Update course in store
    FE-->>I: Update course builder UI
    
    Note over I,CL: Step 4: Publish Course
    I->>FE: Click "Publish Course"
    FE->>BE: PUT /api/v1/course/publishCourse<br/>{courseId, status: "Published"}
    BE->>MW: Check auth + isInstructor
    MW-->>BE: Authorized
    BE->>DB: Update Course.status = "Published"
    BE-->>FE: Success: Course published
    FE->>RS: Clear course creation state
    FE-->>I: Navigate to instructor dashboard
```

### Course Content Management

```mermaid
flowchart TD
    A[Instructor Dashboard] --> B{Choose Action}
    
    B -->|Create New| C[Course Creation Flow]
    B -->|Edit Existing| D[Select Course to Edit]
    B -->|Manage Content| E[Course Builder]
    
    C --> F[Step 1: Course Info]
    F --> G[Step 2: Course Builder]
    G --> H[Step 3: Publish]
    
    D --> I[Load Course Data]
    I --> J{Edit What?}
    
    J -->|Course Info| K[Edit Course Details]
    J -->|Add Section| L[Create Section]
    J -->|Edit Section| M[Update Section]
    J -->|Add Lecture| N[Create SubSection]
    J -->|Edit Lecture| O[Update SubSection]
    J -->|Delete Content| P[Delete Section/SubSection]
    
    E --> Q[View Course Outline]
    Q --> R{Content Management}
    
    R -->|Reorder| S[Drag & Drop Sections/Lectures]
    R -->|Bulk Edit| T[Multiple Section Operations]
    R -->|Preview| U[Preview Course as Student]
    
    K --> V[API: PUT /course/editCourse]
    L --> W[API: POST /course/addSection]
    M --> X[API: PUT /course/updateSection]
    N --> Y[API: POST /course/addSubSection]
    O --> Z[API: PUT /course/updateSubSection]
    P --> AA[API: DELETE /course/deleteSection<br/>DELETE /course/deleteSubSection]
    
    V --> AB[Update Course Model]
    W --> AC[Create Section Model]
    X --> AD[Update Section Model]
    Y --> AE[Create SubSection Model + Upload Video]
    Z --> AF[Update SubSection Model]
    AA --> AG[Remove from Models + Cleanup]
    
    AB --> AH[Redux: Update courseSlice]
    AC --> AH
    AD --> AH
    AE --> AH
    AF --> AH
    AG --> AH
    
    AH --> AI[Re-render Course Builder]
    
    style A fill:#1e3a8a
    style C fill:#7c3aed
    style E fill:#1e40af
    style Q fill:#9333ea
    style V fill:#7c2d12
    style W fill:#7c2d12
    style X fill:#7c2d12
    style Y fill:#7c2d12
    style Z fill:#7c2d12
    style AA fill:#dc2626
```

---

## Student Features

### Course Viewing and Progress Tracking

```mermaid
sequenceDiagram
    participant S as Student
    participant FE as Frontend (React)
    participant RS as Redux Store (viewCourseSlice)
    participant BE as Backend (Express)
    participant MW as Middleware (auth, isStudent)
    participant DB as MongoDB
    
    Note over S,DB: Access Enrolled Course
    S->>FE: Click enrolled course from dashboard
    FE-->>S: Navigate to /view-course/:courseId
    FE->>BE: GET /api/v1/course/getFullDetailsOfCourse/:courseId
    
    BE->>MW: Check auth middleware
    MW->>MW: Verify JWT token
    MW-->>BE: User authenticated
    
    BE->>DB: Find Course by courseId<br/>Populate sections and subsections
    BE->>DB: Find CourseProgress for<br/>userId + courseId
    BE-->>FE: Success: {courseData, progressData}
    
    FE->>RS: setCourseData(courseData)
    FE->>RS: setProgress(progressData)
    FE->>RS: setCompletedVideos(progressData.completedVideos)
    FE-->>S: Render ViewCourse layout with sidebar
    
    Note over S,DB: Course Navigation
    FE-->>S: Render VideoDetailsSidebar<br/>Show course outline with progress
    S->>FE: Click on specific video/lecture
    FE->>RS: setCurrentVideo(subsectionId)
    FE-->>S: Update URL and render VideoDetails
    
    Note over S,DB: Video Watching and Progress
    S->>FE: Watch video in VideoDetails component
    FE->>FE: Video player onEnded event triggered
    FE->>BE: POST /api/v1/course/updateCourseProgress<br/>{courseId, subsectionId}
    
    BE->>MW: Check auth + isStudent
    MW-->>BE: Authorized
    BE->>DB: Find CourseProgress document<br/>for userId + courseId
    alt Progress document doesn't exist
        BE->>DB: Create new CourseProgress<br/>{userId, courseId, completedVideos: [subsectionId]}
    else Progress document exists
        BE->>DB: Check if subsectionId already<br/>in completedVideos array
        alt Not already completed
            BE->>DB: Push subsectionId to<br/>completedVideos array
        else Already completed
            BE-->>FE: No action needed
        end
    end
    
    BE-->>FE: Success: Video marked complete
    FE->>RS: addToCompletedVideos(subsectionId)
    FE-->>S: Update sidebar UI<br/>Show checkmark for completed video
    
    Note over S,DB: Progress Calculation
    FE->>FE: Calculate progress percentage:<br/>completedVideos.length / totalSubsections
    FE-->>S: Update progress bar display
```

### Course Discovery and Enrollment Process

```mermaid
flowchart TD
    A[Student Dashboard] --> B[Browse Courses]
    B --> C{Course Discovery}
    
    C -->|Browse All| D[GET /api/v1/course/getAllCourses]
    C -->|Search| E[GET /api/v1/course/searchCourses]
    C -->|Filter by Category| F[GET /api/v1/course/getCoursesByCategory]
    
    D --> G[Display Course Cards]
    E --> G
    F --> G
    
    G --> H[Student clicks course]
    H --> I[GET /api/v1/course/getCourseDetails]
    I --> J[Course Details Page]
    
    J --> K{Student Action}
    
    K -->|Enroll in Course| L[Check Course Price]
    K -->|Read Reviews| N[GET /api/v1/course/getReviews]
    
    L -->|Free Course| M[Add to Cart with Rs 0]
    L -->|Paid Course| O[Add to Cart with Price]
    N --> Q[Display Reviews]
    
    M --> P[Redux addToCart action]
    O --> P
    P --> R[Cart Badge Update]
    Q --> J
    
    R --> S[Navigate to Cart]
    S --> T{Checkout Process}
    
    T -->|Free Course| U[Direct Enrollment - POST capturePayment with amount 0]
    T -->|Paid Course| V[Payment Gateway - POST capturePayment with coursePrice]
    
    U --> W[Skip Payment Gateway]
    V --> X[Razorpay Payment Modal]
    
    W --> Y[POST verifySignature - Auto verify for free courses]
    X --> Z[Payment Success or Failure]
    Z --> AA{Payment Status}
    
    AA -->|Success| Y
    AA -->|Failed| BB[Return to Cart]
    
    Y --> CC[Update User courses array and Create CourseProgress and Send enrollment email]
    BB --> S
    
    CC --> DD[Success Navigate to Course Viewer and Clear Cart]
    
    style A fill:#1e3a8a
    style J fill:#7c3aed
    style L fill:#1e40af
    style M fill:#059669
    style O fill:#9333ea
    style T fill:#7c2d12
    style V fill:#dc2626
    style CC fill:#0d9488
```

---

## Course Enrollment and Payment

### Payment and Enrollment Flow

```mermaid
sequenceDiagram
    participant S as Student
    participant FE as Frontend (React)
    participant RS as Redux Store (cartSlice)
    participant BE as Backend (Express)
    participant MW as Middleware (auth, isStudent)
    participant DB as MongoDB
    participant RZ as Razorpay Gateway
    participant ES as Email Service
    
    Note over S,ES: Add to Cart Process
    S->>FE: Click "Add to Cart" on course
    FE->>RS: addToCart(course)
    RS-->>FE: Update cart state
    FE-->>S: Update cart badge count
    
    Note over S,ES: Checkout Initiation
    S->>FE: Navigate to /dashboard/cart
    FE-->>S: Display cart items
    S->>FE: Click "Buy Now"
    FE->>BE: POST /api/v1/payment/capturePayment<br/>{courses: [courseIds]}
    
    BE->>MW: Check auth + isStudent
    MW-->>BE: Authorized
    BE->>DB: Validate courses exist and are published
    BE->>BE: Calculate total amount
    BE->>RZ: Create Razorpay order<br/>{amount, currency: "INR"}
    RZ-->>BE: Return order details<br/>{order_id, amount, currency}
    BE-->>FE: Success: {orderDetails}
    
    Note over S,ES: Payment Gateway Integration
    FE->>FE: Initialize Razorpay checkout<br/>with order details
    FE-->>S: Open Razorpay payment modal
    S->>RZ: Complete payment<br/>(Card/UPI/NetBanking)
    
    alt Payment Successful
        RZ-->>FE: Payment success callback<br/>{payment_id, order_id, signature}
        FE->>BE: POST /api/v1/payment/verifySignature<br/>{payment_id, order_id, signature}
        
        BE->>BE: Verify signature using<br/>crypto.createHmac with Razorpay secret
        alt Signature Valid
            BE->>DB: Find courses by courseIds
            BE->>DB: Update User.courses<br/>Add courseIds to student's enrolled courses
            BE->>DB: Update Course.studentsEnrolled<br/>Add userId to each course
            BE->>DB: Create CourseProgress documents<br/>for each enrolled course
            BE->>ES: Send enrollment confirmation email<br/>using courseEnrollmentEmail template
            BE-->>FE: Success: Enrollment complete
            
            FE->>RS: resetCart()
            FE-->>S: Show success message<br/>Navigate to enrolled courses
        else Invalid Signature
            BE-->>FE: Error: Payment verification failed
            FE-->>S: Show error message
        end
    else Payment Failed
        RZ-->>FE: Payment failure callback
        FE-->>S: Show payment failed message
    end
```

### Cart Management Flow

```mermaid
stateDiagram-v2
    [*] --> EmptyCart
    
    EmptyCart --> CartWithItems : addToCart(course)
    CartWithItems --> CartWithItems : addToCart(another course)
    CartWithItems --> CartWithItems : removeFromCart(course)
    CartWithItems --> EmptyCart : clearCart()
    
    CartWithItems --> CheckoutInitiated : clickBuyNow()
    CheckoutInitiated --> PaymentInProgress : initiateRazorpay()
    
    PaymentInProgress --> PaymentSuccess : paymentSucceeded()
    PaymentInProgress --> PaymentFailed : paymentFailed()
    PaymentInProgress --> PaymentCancelled : userCancelled()
    
    PaymentSuccess --> EnrollmentProcessing : verifySignature()
    EnrollmentProcessing --> EnrollmentComplete : enrollmentSucceeded()
    EnrollmentProcessing --> EnrollmentFailed : enrollmentFailed()
    
    PaymentFailed --> CartWithItems : retryPayment()
    PaymentCancelled --> CartWithItems : returnToCart()
    EnrollmentFailed --> CartWithItems : handleError()
    EnrollmentComplete --> EmptyCart : resetCart()
    
    state CartWithItems {
        [*] --> CalculatingTotal
        CalculatingTotal --> DisplayingItems
        DisplayingItems --> UpdatingQuantity
        UpdatingQuantity --> DisplayingItems
    }
    
    state PaymentInProgress {
        [*] --> LoadingRazorpay
        LoadingRazorpay --> RazorpayModal
        RazorpayModal --> ProcessingPayment
        ProcessingPayment --> [*]
    }
```

---

## Profile Management

### User Profile Management Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (React)
    participant RS as Redux Store (authSlice, profileSlice)
    participant BE as Backend (Express)
    participant MW as Middleware (auth)
    participant DB as MongoDB
    participant CL as Cloudinary
    
    Note over U,CL: View Profile
    U->>FE: Navigate to /dashboard/my-profile
    FE->>RS: Read user data from authSlice
    FE-->>U: Display current profile info<br/>(firstName, lastName, email, image)
    
    Note over U,CL: Update Profile Information
    U->>FE: Click "Edit Profile"
    FE-->>U: Open EditProfile modal/form<br/>Pre-populated with current data
    U->>FE: Modify profile fields<br/>(about, contactNumber, dateOfBirth, gender)
    FE->>BE: PUT /api/v1/profile/updateProfile<br/>{about, contactNumber, dateOfBirth, gender}
    
    BE->>MW: Check auth middleware
    MW->>MW: Verify JWT token
    MW-->>BE: User authenticated
    
    BE->>DB: Find User document by req.user.id
    BE->>DB: Find Profile document using<br/>User.profile reference
    BE->>DB: Update Profile fields with new data
    BE-->>FE: Success: {updatedProfile}
    
    FE->>RS: setUser(updatedUserData)
    FE-->>U: Close modal, show success toast<br/>Profile display updates automatically
    
    Note over U,CL: Update Profile Picture
    U->>FE: Click on profile picture/avatar
    FE-->>U: Open file selector or ImageUpload component
    U->>FE: Select new image file
    FE->>FE: Show image preview
    U->>FE: Confirm upload
    FE->>FE: Create FormData with image file
    FE->>BE: PUT /api/v1/profile/updateDisplayPicture<br/>(multipart/form-data)
    
    BE->>MW: Check auth middleware
    MW-->>BE: Authenticated
    BE->>CL: Upload image using imageUploader utility
    CL-->>BE: Return secure_url for new image
    BE->>DB: Update User.image field with new URL
    BE-->>FE: Success: {newImageUrl}
    
    FE->>RS: setUser(userWithNewImage)
    FE-->>U: Update all UI components showing avatar<br/>(Navbar, Profile, etc.)
    
    Note over U,CL: View Enrolled Courses
    U->>FE: Click "Enrolled Courses" tab
    FE->>BE: GET /api/v1/profile/getEnrolledCourses
    
    BE->>MW: Check auth middleware
    MW-->>BE: Authenticated
    BE->>DB: Find User by ID<br/>Populate courses array with full course details
    BE-->>FE: Success: {enrolledCourses}
    
    FE-->>U: Display list of enrolled courses<br/>with progress indicators
    
    Note over U,CL: Account Settings
    U->>FE: Access account settings
    FE-->>U: Show options: Change Password, Delete Account
    
    alt Change Password
        U->>FE: Click "Change Password"
        FE-->>U: Show change password form
        U->>FE: Enter oldPassword, newPassword
        FE->>BE: POST /api/v1/auth/changePassword<br/>{oldPassword, newPassword}
        
        BE->>MW: Check auth middleware
        MW-->>BE: Authenticated
        BE->>DB: Find User by ID
        BE->>BE: Compare oldPassword with stored hash using bcrypt
        alt Old password matches
            BE->>BE: Hash newPassword using bcrypt
            BE->>DB: Update User.password with new hash
            BE-->>FE: Success: Password updated
            FE-->>U: Show success message
        else Old password doesn't match
            BE-->>FE: Error: Invalid old password
            FE-->>U: Show error message
        end
    else Delete Account
        U->>FE: Click "Delete Account"
        FE-->>U: Show confirmation dialog
        U->>FE: Confirm deletion
        FE->>BE: DELETE /api/v1/profile/deleteAccount
        
        BE->>MW: Check auth middleware
        MW-->>BE: Authenticated
        BE->>DB: Delete User document
        BE->>DB: Delete associated Profile document
        BE->>DB: Remove user from Course.studentsEnrolled arrays
        BE->>DB: Delete user's CourseProgress documents
        BE-->>FE: Success: Account deleted
        
        FE->>RS: Clear all auth state
        FE-->>U: Navigate to home page<br/>Show account deleted message
    end
```

### Profile Data Structure Flow

```mermaid
erDiagram
    User {
        ObjectId _id PK
        string firstName
        string lastName
        string email UK
        string password
        string role
        string image
        ObjectId profile FK
        ObjectId[] courses
        ObjectId[] courseProgress
        date createdAt
        date updatedAt
    }
    
    Profile {
        ObjectId _id PK
        string gender
        date dateOfBirth
        string about
        string contactNumber
        date createdAt
        date updatedAt
    }
    
    Course {
        ObjectId _id PK
        string courseName
        string courseDescription
        ObjectId instructor FK
        ObjectId category FK
        number price
        string thumbnail
        ObjectId[] courseContent
        ObjectId[] studentsEnrolled
        ObjectId[] ratingAndReviews
        string status
        date createdAt
        date updatedAt
    }
    
    CourseProgress {
        ObjectId _id PK
        ObjectId courseId FK
        ObjectId userId FK
        ObjectId[] completedVideos
        date createdAt
        date updatedAt
    }
    
    Section {
        ObjectId _id PK
        string sectionName
        ObjectId[] subSection
        date createdAt
        date updatedAt
    }
    
    SubSection {
        ObjectId _id PK
        string title
        string description
        string videoUrl
        number timeDuration
        date createdAt
        date updatedAt
    }
    
    Category {
        ObjectId _id PK
        string name
        string description
        date createdAt
        date updatedAt
    }
    
    User ||--|| Profile : "has one"
    User ||--o{ Course : "enrolled in"
    User ||--o{ CourseProgress : "tracks progress"
    Course ||--o{ CourseProgress : "has progress records"
    Course ||--o{ Section : "contains"
    Section ||--o{ SubSection : "contains"
    Course ||--|| Category : "belongs to"
    User ||--o{ Course : "instructs"
```

**Profile Management API Endpoints:**
- `GET /api/v1/profile/getUserDetails` - Get user profile information
- `PUT /api/v1/profile/updateProfile` - Update profile details
- `PUT /api/v1/profile/updateDisplayPicture` - Update profile picture
- `GET /api/v1/profile/getEnrolledCourses` - Get user's enrolled courses
- `DELETE /api/v1/profile/deleteAccount` - Delete user account

---

## Rating and Review System

### Rating and Review Flow

```mermaid
sequenceDiagram
    participant S as Student
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant MW as Middleware (auth, isStudent)
    participant DB as MongoDB
    
    Note over S,DB: Submit Rating and Review
    S->>FE: Complete course or click "Rate Course"
    FE-->>S: Open RatingModal component
    S->>FE: Select star rating (1-5) and enter review text
    FE->>FE: Validate rating and review using react-hook-form
    FE->>BE: POST /api/v1/course/createRating<br/>{courseId, rating, review}
    
    BE->>MW: Check auth + isStudent
    MW-->>BE: Authorized
    
    BE->>DB: Check if user is enrolled in course<br/>Find User where courses contains courseId
    alt User not enrolled
        BE-->>FE: Error: Must be enrolled to review
        FE-->>S: Show error message
    else User is enrolled
        BE->>DB: Check if user already reviewed this course<br/>Find RatingAndReview where user + course
        alt Already reviewed
            BE-->>FE: Error: Already reviewed this course
            FE-->>S: Show error message
        else No existing review
            BE->>DB: Create RatingAndReview document<br/>{user, course, rating, review}
            BE->>DB: Update Course.ratingAndReviews<br/>Push reviewId to array
            BE-->>FE: Success: Review submitted
            FE-->>S: Close modal, show success toast
        end
    end
    
    Note over S,DB: Display Course Ratings
    S->>FE: View course details page
    FE->>BE: GET /api/v1/course/getReviews/:courseId
    
    BE->>DB: Find all RatingAndReview documents<br/>for courseId, populate user details
    BE-->>FE: Success: {reviews}
    
    FE->>BE: GET /api/v1/course/getAverageRating/:courseId
    BE->>DB: Find all ratings for course<br/>Calculate average rating
    BE-->>FE: Success: {averageRating}
    
    FE-->>S: Display reviews with:<br/>- User avatars and names<br/>- Star ratings<br/>- Review text<br/>- Average rating
    
    Note over S,DB: Review Management (Optional)
    alt Update Review (if feature exists)
        S->>FE: Click "Edit Review"
        FE-->>S: Open edit modal with current rating/review
        S->>FE: Update rating and/or review text
        FE->>BE: PUT /api/v1/course/updateRating<br/>{reviewId, rating, review}
        
        BE->>MW: Check auth + isStudent
        MW-->>BE: Authorized
        BE->>DB: Find RatingAndReview by reviewId<br/>Check if user is owner
        alt User owns review
            BE->>DB: Update rating and review fields
            BE-->>FE: Success: Review updated
            FE-->>S: Show success message, refresh display
        else User doesn't own review
            BE-->>FE: Error: Unauthorized
            FE-->>S: Show error message
        end
    else Delete Review (if feature exists)
        S->>FE: Click "Delete Review"
        FE-->>S: Show confirmation dialog
        S->>FE: Confirm deletion
        FE->>BE: DELETE /api/v1/course/deleteRating/:reviewId
        
        BE->>MW: Check auth + isStudent
        MW-->>BE: Authorized
        BE->>DB: Find RatingAndReview by reviewId<br/>Check if user is owner
        alt User owns review
            BE->>DB: Delete RatingAndReview document
            BE->>DB: Remove reviewId from Course.ratingAndReviews
            BE-->>FE: Success: Review deleted
            FE-->>S: Show success message, refresh display
        else User doesn't own review
            BE-->>FE: Error: Unauthorized
            FE-->>S: Show error message
        end
    end
```

### Review System Architecture

```mermaid
flowchart TD
    A[Student completes course] --> B{Review Action}
    
    B -->|Rate Course| C[Open Rating Modal]
    B -->|View Reviews| D[Display Course Reviews]
    
    C --> E[Star Rating Component<br/>react-rating-stars-component]
    C --> F[Review Text Area]
    
    E --> G[Validate Input]
    F --> G
    
    G --> H{Validation Check}
    H -->|Valid| I[Submit Review API]
    H -->|Invalid| J[Show Validation Errors]
    
    I --> K{Authorization Check}
    K -->|Authorized| L[Database Operations]
    K -->|Unauthorized| M[Return Error]
    
    L --> N{Enrollment Check}
    N -->|Enrolled| O{Duplicate Check}
    N -->|Not Enrolled| P[Return Error: Must be enrolled]
    
    O -->|No Existing Review| Q[Create RatingAndReview]
    O -->|Already Reviewed| R[Return Error: Already reviewed]
    
    Q --> S[Update Course ratings array]
    S --> T[Return Success]
    
    D --> U[GET Reviews API]
    U --> V[Fetch all course reviews]
    V --> W[Calculate average rating]
    W --> X[Populate user details]
    X --> Y[Return formatted reviews]
    
    Y --> Z[Display Review Cards]
    Z --> AA[Show user avatar, name]
    Z --> BB[Show star rating]
    Z --> CC[Show review text]
    Z --> DD[Show review date]
    
    T --> EE[Close Modal]
    T --> FF[Show Success Toast]
    T --> GG[Refresh Course Page]
    
    style A fill:#1e3a8a
    style C fill:#7c3aed
    style I fill:#1e40af
    style Q fill:#9333ea
    style D fill:#7c2d12
    style Z fill:#0d9488
```

### Rating Data Flow

```mermaid
erDiagram
    User {
        ObjectId _id PK
        string firstName
        string lastName
        string email
        string image
        string role
        ObjectId[] courses "enrolled courses"
        date createdAt
        date updatedAt
    }
    
    Course {
        ObjectId _id PK
        string courseName
        string courseDescription
        ObjectId instructor FK
        ObjectId category FK
        number price
        string thumbnail
        ObjectId[] studentsEnrolled
        ObjectId[] ratingAndReviews
        string status
        date createdAt
        date updatedAt
    }
    
    RatingAndReview {
        ObjectId _id PK
        ObjectId user FK
        ObjectId course FK
        number rating "1-5 stars"
        string review "text content"
        date createdAt
        date updatedAt
    }
    
    Category {
        ObjectId _id PK
        string name
        string description
        date createdAt
        date updatedAt
    }
    
    User ||--o{ RatingAndReview : "writes"
    Course ||--o{ RatingAndReview : "receives"
    User ||--o{ Course : "enrolled in"
    User ||--o{ Course : "instructs"
    Course ||--|| Category : "belongs to"
```

**Rating and Review API Endpoints:**
- `POST /api/v1/course/createRating` - Create a new rating and review
- `GET /api/v1/course/getReviews/:courseId` - Get all reviews for a course
- `GET /api/v1/course/getAverageRating/:courseId` - Get average rating for a course
- `PUT /api/v1/course/updateRating/:reviewId` - Update an existing review
- `DELETE /api/v1/course/deleteRating/:reviewId` - Delete a review

**Business Rules:**
- Users can only review courses they are enrolled in
- Users can only write one review per course
- Rating must be between 1-5 stars
- Users can only edit/delete their own reviews

---

## Summary

This comprehensive flow diagram documentation covers the complete StudyNotion application architecture and feature workflows. Each diagram shows:

1. **System Architecture**: High-level overview of the entire application stack
2. **Authentication**: Complete user signup, login, and password reset flows
3. **Course Management**: Instructor workflows for creating and managing courses
4. **Student Features**: Course discovery, viewing, and progress tracking
5. **Payment System**: Cart management and Razorpay integration
6. **Profile Management**: User profile operations and account settings
7. **Rating System**: Course review and rating functionality

### Key Technologies Covered

- **Frontend**: React, Redux Toolkit, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT tokens, bcrypt password hashing
- **File Storage**: Cloudinary for images and videos
- **Payments**: Razorpay integration
- **Email**: Nodemailer with HTML templates

### API Endpoints Summary

The diagrams include all major API routes used throughout the application:

- **Auth APIs**: `/api/v1/auth/*` (login, signup, sendotp, reset-password)
- **Profile APIs**: `/api/v1/profile/*` (getUserDetails, updateProfile, updateDisplayPicture)
- **Course APIs**: `/api/v1/course/*` (createCourse, addSection, addSubSection, getFullDetailsOfCourse)
- **Payment APIs**: `/api/v1/payment/*` (capturePayment, verifySignature)
- **Rating APIs**: `/api/v1/course/*` (createRating, getReviews, getAverageRating)

Each flow diagram provides detailed insight into the data flow, error handling, and user experience for the StudyNotion learning management system.

