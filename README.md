# Team Task Manager

A full-stack, production-ready project and task management application with role-based access control.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Lucide React
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT & bcryptjs

## Roles
- **ADMIN**: Can create projects, manage tasks across projects, delete projects/tasks, and add members.
- **MEMBER**: Can view assigned projects, view their own tasks, and update their task status to 'In Progress' or 'Done'.

## Getting Started

### Local Setup

1. **Clone the repository** (if from Git) or navigate to the `team-task-manager` folder.
2. **Backend Setup**:
   - `cd backend`
   - Create a `.env` file based on `.env` with the following:
     ```
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
     JWT_SECRET=your_jwt_secret_key_here
     NODE_ENV=development
     ```
   - Run `npm install`
   - Run `npm run dev` to start the backend server on port 5000.
3. **Frontend Setup**:
   - `cd frontend`
   - Run `npm install --legacy-peer-deps` (if resolving peer dependency conflicts with React 19).
   - Run `npm run dev` to start the Vite development server.

### Railway Deployment Steps

To deploy this application to Railway, we will use separate services for the Frontend and Backend, or a combined service. For simplicity and scalability, deploying them as separate services is recommended.

#### 1. Setup MongoDB Atlas
- Create a free cluster on MongoDB Atlas.
- Add a database user with a secure password.
- Allow access from anywhere (`0.0.0.0/0`) in Network Access.
- Copy your connection string (`mongodb+srv://...`).

#### 2. Deploy Backend on Railway
1. Push your code to a GitHub repository.
2. Log in to [Railway](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo**.
4. Select your repository.
5. In the Railway dashboard, go to the backend service settings.
6. Set the **Root Directory** to `/backend`.
7. Add the following **Environment Variables**:
   - `PORT` (e.g., 5000)
   - `MONGO_URI` (Paste your MongoDB Atlas connection string)
   - `JWT_SECRET` (A strong, random string)
   - `NODE_ENV` (production)
8. Wait for Railway to build and deploy. Once complete, copy the **Public Domain URL**.

#### 3. Deploy Frontend on Railway (or Vercel)
1. Go to the frontend codebase (`/frontend/src/api/axios.js`) and update the `baseURL` to the newly generated Railway Backend URL.
2. Create a new service on Railway connected to the same GitHub repo.
3. Set the **Root Directory** to `/frontend`.
4. Railway will automatically detect Vite and build the static assets.
5. (Optional) Alternatively, deploy the `/frontend` directory to Vercel/Netlify for better edge caching.

Enjoy using the Team Task Manager!
