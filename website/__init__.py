from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_session import Session
from config import config
import redis

# SQL_LOCAL = "mysql+pymysql://root:coder123@localhost/KeepOnCodingAcademy"
SQL_USER = config['SQL_USER']
SQL_PASS = config['SQL_PASS']
SQL_HOST = config['SQL_HOST']
DB_NAME = config['DB_NAME']

BASE_URL = config['BASE_URL']
OAUTH_STATE = config['OAUTH_STATE']
FLASK_SECRET_KEY = config['FLASK_SECRET_KEY']

GOOGLE_CLIENT_ID = config["GOOGLE_CLIENT_ID"]
GOOGLE_CLIENT_SECRET = config["GOOGLE_CLIENT_SECRET"]
GOOGLE_REDIRECT_URI = f"{BASE_URL}/api/google/authorize"

LINKEDIN_CLIENT_ID = config["LINKEDIN_CLIENT_ID"]
LINKEDIN_SECRET = config["LINKEDIN_SECRET"]
LINKEDIN_REDIRECT_URL = f'{BASE_URL}/api/linkedin/authorize'

GITHUB_CLIENT_ID = config["GITHUB_CLIENT_ID"]
GITHUB_CLIENT_SECRET = config["GITHUB_SECRET"]
GITHUB_REDIRECT_URL = f'{BASE_URL}/api/github/authorize'


def create_app():
    app = Flask(__name__)
    app.secret_key = FLASK_SECRET_KEY
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///testing.db'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{SQL_USER}:{SQL_PASS}@{SQL_HOST}/{DB_NAME}?ssl_ca=/etc/ssl/certs/ca.crt'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    #app.config['SQLALCHEMY_ECHO'] = True
    
    app.config['SESSION_TYPE'] = "redis"
    #app.config['SESSION_TYPE'] = 'sqlalchemy'
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_REDIS'] = redis.from_url("redis://127.0.0.1:6379")
    cors = CORS(app, supports_credentials=True)
    server_session = Session(app)

    from .models import db
    from .models import ma
    #app.config['SESSION_SQLALCHEMY'] = db

    ma.init_app(app)

    # Setup DB
    db.init_app(app)
    with app.app_context():
        # creating tables if already doesn't exist
        db.create_all()

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import User
    api = Api(app)
    return app

