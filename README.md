# time_backend

Node.js + Express backend (TDG-style MVC).

## Structure

```
time_backend/
├── index.js
├── public/
└── src/
    ├── config/          # config.js, .env_local, .env_dev
    ├── controller/      # business handlers
    ├── model/           # mongoose models
    ├── routes/          # express routes
    ├── middleware/      # verify, rateLimiter
    ├── db/              # mongo connection
    ├── services/        # shared services
    └── utils/           # messages, responseHandler, validation
```

## Setup

```bash
npm install
```

## Run

```bash
# local
npm run local

# dev
npm run dev
```

- Root: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`
