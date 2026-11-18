MERN Assessment Management System – Frontend

A web-based assessment management application built with React, Vite and Tailwind CSS. The system allows administrators to create and manage assessments while students can access assessments, answer questions, submit their work and view their results.

Live Application

Frontend: https://assessment-frontend-batch-01.vercel.app/

Backend API: https://assessment-api-batch-01-1.onrender.com/api

Backend API Documentation: https://assessment-api-batch-01-1.onrender.com/api-docs

Related Repository

Backend Repository: https://github.com/LovelyboyBruno/Assessment_API_BATCH_01

Technologies Used

* React – Frontend user interface
* Vite – Development and build tool
* Tailwind CSS – Styling and responsive design
* React Router – Client-side navigation
* Axios – API communication
* Node.js and Express – Backend API
* MongoDB Atlas – Database
* JWT – Authentication and authorization
* Vercel – Frontend deployment

Main Features

Administrator

* Secure administrator login.
* Dashboard displaying assessment system statistics.
* Create new assessments.
* View all available assessments.
* Edit existing assessments.
* Delete assessments.
* Manage assessment questions.
* View student submissions and results.

Student

* Secure student login.
* View available assessments.
* Take assessments.
* Complete questions within the assessment duration.
* Submit assessment answers.
* View assessment results and performance.

General Features

* Role-based access to administrator and student functionality.
* Protected application routes.
* Responsive user interface.
* Dark and light themes.
* API integration with the backend.
* Assessment timing and submission functionality.

Project Structure

assessment-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Assessment.jsx
│   │   ├── Question.jsx
│   │   ├── Submission.jsx
│   │   ├── TakeAssessment.jsx
│   │   ├── Results.jsx
│   │   └── StudentAssessments.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md

Installation and Setup

1. Clone the repository

git clone https://github.com/LovelyboyBruno/Assessment_FRONTEND_BATCH_01.git

2. Navigate into the project

cd Assessment_FRONTEND_BATCH_01

3. Install dependencies

npm install

4. Configure environment variables

Create a .env file in the project root directory.

Add:

VITE_API_URL=https://assessment-api-batch-01-1.onrender.com/api

For local backend development, use the corresponding local API address instead.

5. Start the development server

npm run dev

Vite will provide a local development URL, usually:

http://localhost:5173

Building for Production

To create a production build:

npm run build

To preview the production build locally:

npm run preview

API Integration

The frontend communicates with the backend through Axios.

The API service is configured in:

src/services/api.js

The backend provides endpoints for:

* Authentication
* Assessments
* Questions
* Submissions
* Dashboard statistics
* Student results

For detailed API documentation, visit:

https://assessment-api-batch-01-1.onrender.com/api-docs

Deployment

The frontend is deployed using Vercel and connected to the GitHub repository.

Production URL:

https://assessment-frontend-batch-01.vercel.app/

The application uses a Vercel rewrite configuration to support client-side routing when refreshing application pages.

Security Notes

* Environment files containing secrets must not be committed to GitHub.
* The .env file should remain excluded through .gitignore.
* Authentication uses JWT tokens.
* Administrative operations are protected by backend role-based authorization.
* Never publish database credentials, JWT secrets or private environment variables.

Author

Developer: LovelyboyBruno

Project: MERN Assessment Management System

Frontend: React + Vite
Backend: Node.js + Express

Database: MongoDB Atlas