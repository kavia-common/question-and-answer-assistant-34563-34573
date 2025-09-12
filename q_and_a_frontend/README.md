# Q&A Frontend (React)

This is a lightweight React UI for a Q&A assistant. Users can submit questions and see the latest answer from the Flask backend.

## Run locally

1. Install dependencies:
   - `npm install`

2. Configure backend base URL (optional):
   - By default, the app calls the backend using relative paths (`/question`, `/answer`).
   - If your backend runs on a different origin, set an environment variable before `npm start`:
     - macOS/Linux:
       - `export REACT_APP_BACKEND_BASE_URL="http://localhost:5000"`
     - Windows (Powershell):
       - `$env:REACT_APP_BACKEND_BASE_URL="http://localhost:5000"`

3. Start the app:
   - `npm start`
   - Open http://localhost:3000

## Endpoints used

- POST `${REACT_APP_BACKEND_BASE_URL || ''}/question` with body `{ "question": "..." }`
- GET `${REACT_APP_BACKEND_BASE_URL || ''}/answer`

These match the backend OpenAPI provided.

## Notes

- The UI includes a light/dark theme toggle.
- Errors and loading states are displayed to the user.
- To build for production: `npm run build`.
