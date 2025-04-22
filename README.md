# EVENT REGISTRATION SERVICES
This project is a backend service for managing event registrations. It is built using Node.js, Express, and MongoDB.

## Getting Started

### Prerequisites

- Node.js
- Docker
- Docker Compose

### Installation

1. #### Clone the repository:

```bash
git clone https://github.com/Wuttiwat2001/event-registration-services
```

2. #### Install dependencies:

```bash
npm run install
```

3. #### Set up the environment variables:
   Create a .env file in the root directory and add the following variables:

```bash
PORT=8080
MONGODB_URI=mongodb://root:example@mongodb:27017/event_registration?authSource=admin
JWT_SECRET=your_jwt_secret
```

### Usage

1. #### Start the development server:

```bash
npm run serve
```

### API Endpoints

#### Auth Endpoints

- POST /auth/register - Register a new user
- POST /auth/login - Login

#### Event Endpoints

- POST /api/events - Create a new event
- POST /api/events/findAll - Find all events
- GET /api/events/:id - Find an event by ID
- PUT /api/events/update/:id - Update an event
- DELETE /api/events/remove/:id - Remove an event
- POST /api/events/registered-users - Find registered users for an event
- POST /api/events/join/:eventId - Join an event

### If want design to microservice

- Auth Service - /auth/register, /auth/login
- Event Service - /api/events, /api/events/findAll, /api/events/:id, /api/events/update/:id, /api/events/remove/:id
- Register Service - /api/events/join/:eventId, /api/events/registered-users
- User Service (Optional)
- Notification Service (Optional)

#### Environment Variables

- PORT - The port number on which the server will run (default is 8080)
- MONGODB_URI - The URI of your MongoDB database
- JWT_SECRET - The secret key for JWT authentication

### Running with Docker Compose

1. #### Create a .env file in the root directory and add the following variables:

```bash
PORT=8080
MONGODB_URI=mongodb://root:example@mongodb:27017/event_registration?authSource=admin
JWT_SECRET=your_jwt_secret
```

2. #### Run the application using Docker Compose:

- docker-compose up --build

3. #### If the database is not accessible, ensure the MONGODB_URI in the .env file is correct and points to the MongoDB service in Docker Compose:

```bash
MONGODB_URI=mongodb://root:example@mongodb:27017/event_registration?authSource=admin
```

### Example Requests

#### Register a new user

```bash
curl -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d '{
  "username": "testuser",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "phone": "1234567890"
}'
```

#### Create a new event

```bash
curl -X POST http://localhost:8080/api/events -H "Content-Type: application/json" -d '{
  "title": "Sample Event",
  "description": "This is a sample event.",
  "location": "Sample Location",
  "totalSeats": 100,
  "remainingSeats": 100,
  "createdBy": "userId"
}'
```