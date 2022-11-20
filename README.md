# Keep On Coding
To run server use:\
python3 -m venv venv\
. venv/bin/activate\
pip3 install -r requirements.txt\
python3 app.py\

Redis\
Will need Redis running on port 6379 to store server sesssions\

To run client use:\
cd client\
npm install\
npm start\

To deploy to production\
React Code:\
Pull latest git changes\
Go to client folder and "npm run build"\

Server Code:\
Pull latest git changes\
Install from requirements file\
sudo systemctl reload nginx\
sudo supervisorctl reload\
