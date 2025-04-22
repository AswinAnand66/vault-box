# VaultBox - Encrypted Life Vault & Emergency Unlock System

VaultBox is a secure personal vault application that helps users store sensitive, life-critical information with emergency access features.

## Features

- Secure email/password authentication
- Encrypted vault entries
- Trusted contact system
- Auto-delete functionality
- Emergency unlock mechanism
- File upload support
- Category-based organization

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- Encryption: crypto-js
- Styling: Tailwind CSS

## Project Structure

```
vault-box/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js application
├── .env                    # Environment variables
└── README.md              # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user

### Vault Entries
- GET /api/entries - Get all entries
- POST /api/entries - Create new entry
- PUT /api/entries/:id - Update entry
- DELETE /api/entries/:id - Delete entry

### Trusted Contacts
- POST /api/contacts - Add trusted contact
- GET /api/contacts - Get trusted contact
- PUT /api/contacts - Update trusted contact settings

## Security Features

- End-to-end encryption for vault entries
- JWT-based authentication
- Rate limiting
- Input validation
- Secure password hashing
- Emergency access protocol