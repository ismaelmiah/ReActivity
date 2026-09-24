# ReActivity

ReActivity is a full-stack social events application inspired by Meetup-style event planning, built with ASP.NET Core and React/TypeScript. The project demonstrates a clean architecture approach with CQRS-style command handlers, a .NET Web API, a React client, and a SQLite-backed data layer.

## What the project does

ReActivity lets users:

- Browse upcoming activities and event details
- Create, edit, and delete activities
- Join or leave event attendance lists
- Follow other users and view profiles
- Upload and manage profile photos
- Chat in real time through SignalR
- Authenticate users with JWT-based security

The app is designed as a practical example of a modern full-stack application with separation between domain logic, application services, persistence, and presentation layers.

## Live Demo

There is no public hosted deployment configured in this repository at the moment.

For local usage, the app is designed to run as:

- Frontend: http://localhost:3000
- API: http://localhost:5000 or the configured ASP.NET launch URL

If you deploy this project to a hosting provider, the application can be served from a single ASP.NET host by building the React client into the API's static files folder.

## Screenshots

Add screenshots here as the app evolves. A typical gallery would include:

- Activity dashboard
- Activity detail page
- User profile and following view
- Event creation form
- Real-time chat panel

Example placeholder:

![Activity dashboard](https://github.com/ismaelmiah/ReActivity/blob/master/client-app/public/images/dashboard.png?raw=true)

![Activity details](https://github.com/ismaelmiah/ReActivity/blob/master/client-app/public/images/activityDetails.png)

![User profile](https://github.com/ismaelmiah/ReActivity/blob/master/client-app/public/images/userProfile.png)

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- MobX
- Semantic UI React
- Axios
- Final Form
- SignalR client

### Backend
- ASP.NET Core 3.x/5-style Web API structure (Upgraded to .Net 8, Initially written with core 3.1)
- C#
- Entity Framework Core
- SQLite
- Identity framework
- JWT authentication
- MediatR
- AutoMapper
- FluentValidation

### Infrastructure
- Cloudinary for image uploads
- SignalR for real-time chat
- CORS configuration for local React development

## Architecture

The solution follows a layered design inspired by Clean Architecture:

- Domain: core entities and business rules
- Application: handlers, DTOs, validators, interfaces, and use cases
- Persistence: database context, migrations, and seed data
- Infrastructure: external services such as photos and security helpers
- API: controllers, middleware, JWT setup, routing, and SignalR hub
- Client App: React frontend consuming the API

The backend uses MediatR handlers for commands and queries, which keeps the API controllers thin and moves business logic into reusable application workflows.

## Key features

- Activity management: list, create, update, delete, and details views
- Attendance tracking: users can join and leave activities
- User profiles: followers, following, profile summaries, and avatars
- Social graph: follow and unfollow other users
- Photo uploads: Cloudinary-backed profile and activity media handling
- Real-time communication: chat via SignalR
- Token-based auth: secure access to protected endpoints
- Responsive UI: modern event browsing and management experience

## Local setup

### Prerequisites

- .NET SDK
- Node.js and npm
- SQLite support through the .NET runtime

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ReActivity.git
cd ReActivity
```

### 2. Restore backend dependencies

```bash
cd server-app

dotnet restore
```

### 3. Run the API

From the server app directory:

```bash
dotnet run --project API/API.csproj
```

The API will automatically apply migrations and seed initial data.

### 4. Install frontend dependencies

```bash
cd ../client-app
npm install
```

### 5. Start the React app

```bash
npm start
```

The React app should open on the local development URL configured by CRA, typically:

```text
http://localhost:3000
```

### 6. Build the frontend for production

```bash
cd client-app
npm run build
```

This project includes a postbuild step that moves the production build into the API static files folder for deployment.

## Deployment

The application is structured so the React frontend can be bundled and served by the ASP.NET Core API. In this repository, the client build step copies generated assets into the API's static hosting directory.

Recommended deployment flow:

1. Run the frontend production build
2. Copy the build output into the API's static web root
3. Publish the .NET API project
4. Configure environment variables such as:
   - ConnectionStrings__DefaultConnection
   - TokenKey
   - Cloudinary settings

### Example hosting targets

- Azure App Service
- IIS
- Docker container
- Any environment capable of hosting an ASP.NET Core app with static files

> This repository does not currently include a live production deployment configuration, but the structure is ready for a standard .NET + React publish pipeline.

---

ReActivity is a practical example of a full-stack, event-focused app that brings together modern frontend patterns, clean backend architecture, and real-time user interactions.


