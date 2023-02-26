# ShareYourMind
A web application served as a portal to share knowledge by users. A project realized as an individual project at the Warsaw University of Technology.

# Run instructions
To run the entire project, it is necessary to run backend and frontend separately. 
It is possible by running appropriate commands in Terminal (Linux or macOS) or Powershell (Windows).
You need to have installed `python interpreter` and `node.js`

## Backend
Write these commands one by one to run backend:\
`cd backend`\
`pip install -r requirements.txt`\
`python manage.py migrate`\
`python manage.py runserver`

Backend will be available at: http://localhost:8000/

## Frontend
Write these commands one by one to run frontend:\
`cd frontend`\
`npm install`\
`npm start`

Frontend will be available at: http://localhost:3000/
