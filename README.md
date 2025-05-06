
# CRM Frontend

## Project Overview
This frontend is part of a CRM system for managing orders, users, groups, and administrative features. Built using React and MUI, it provides a responsive user interface and communicates with a Django REST API backend.

## Getting Started

### Installation
To run the frontend locally:

```
git clone https://github.com/AlexHudkov/crm_frontend.git
cd crm_frontend
npm install
```

### Environment Variables (.env)
Create a `.env` file in the root directory to configure API endpoints:

```
REACT_APP_BASE_URL=http://127.0.0.1:8000
REACT_APP_BACKEND_URL=http://localhost:8000
```

Ensure your `.env` file is included in `.gitignore` to prevent exposing sensitive data.

### Running the Project
Start the local development server:

```bash
npm start
```

By default, the app runs at: [http://localhost:3000](http://localhost:3000)

## Key Features

- Authentication and session handling
- Order listing with filtering, sorting, and pagination
- Data export to Excel (via XLSX + FileSaver)
- Manager and group administration
- WebSocket support for real-time order updates

##  Project Structure

```
crm_front/
├── public/                   # Static public assets
├── src/
│   ├── components/           # Reusable UI components
│   ├── constants/            # Global constants and configuration
│   ├── context/              # Auth provider and session context
│   ├── layouts/              # Page and layout wrappers
│   ├── pages/                # Route-based pages (Orders, Admin, etc.)
│   ├── services/             # API interaction modules
│   ├── utils/                # Helper functions
│   ├── router.js             # Routing setup
│   └── index.js              # App entry point
├── .env                      # Environment variables
├── .env.example              # Sample env configuration
├── package.json              # NPM dependencies and scripts
├── README.md                 # Project documentation
```

##  Technologies Used

- React – Frontend framework
- MUI – Material UI components and theming
- React Router – Client-side routing
- Axios – API communication
- Lodash – Utility helpers
- XLSX / FileSaver – Excel export and file saving
- Date-fns – Date formatting and manipulation

##  Developer Info
Author: Oleksii Hudkov  
Email: Alexnkest@gmail.com
