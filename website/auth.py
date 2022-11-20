import json, requests
from urllib.parse import parse_qs, urlencode
from flask import Blueprint, request, redirect, jsonify, session
from . import BASE_URL, OAUTH_STATE, \
              GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, \
              LINKEDIN_CLIENT_ID, LINKEDIN_SECRET, LINKEDIN_REDIRECT_URL, \
              GITHUB_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_REDIRECT_URL
from .models import User
from .models import db
from werkzeug.security import check_password_hash

auth = Blueprint('auth', __name__)

@auth.route("/api/getUser")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return {
            "id": "",
            "email": ""
        }
    
    user = User.query.filter_by(id=user_id).first()
    return {
        "id": user.id,
        "email": user.email
    }


@auth.route("/api/login", methods=["POST"])
def login_user():

    email = request.json["email"]
    password = request.json["password"]

    try:
        user = User.query.filter_by(email=email).first()

        if user is None:
            return jsonify({"error": "Unauthorized"}), 401

        if not check_password_hash(user.password, password):
            return jsonify({"error": "Unauthorized"}), 401
        
        session["user_id"] = user.id

    except Exception as e:
        print(e)
        return jsonify({"error": "Internal Server Error"}), 500

    return jsonify({
        "id": user.id,
        "email": user.email
    })


# @auth.route("/api/register", methods=["POST"])
# def register_user():
#     email = request.json["email"]
#     user_name = request.json['userName']
#     password1 = request.json["password1"]
#     password2 = request.json["password2"]

#     if len(email) < 4:
#         return jsonify({"error": "Email must be larger than 3 characters"}), 409
#     elif len(user_name) < 2:
#         return jsonify({"error": "Username be at least 2 characters"}), 409
#     elif password1 != password2:
#         return jsonify({"error": "Passwords do not match"}), 409
#     elif len(password1) < 8:
#         return jsonify({"error": "Password must be at least 8 characters"}), 409

#     user_exists = User.query.filter_by(email=email).first() is not None

#     if user_exists:
#         return jsonify({"error": "User already exists"}), 409

#     # Create new user
#     hashed_password = generate_password_hash(password1, method="sha256")
#     new_user = User(email=email, password=hashed_password, user_name=user_name, provider="basic")
#     db.session.add(new_user)
#     db.session.commit()
    
#     session["user_id"] = new_user.id

#     return jsonify({
#         "id": new_user.id,
#         "email": new_user.email
#     })

@auth.route('/api/linkedin/login')
def linkedin_login():
    path = request.args['currentpath']
    state = " ".join([OAUTH_STATE, path])
    qs = f'response_type=code&client_id={LINKEDIN_CLIENT_ID}&redirect_uri={LINKEDIN_REDIRECT_URL}&state={state}&scope=r_liteprofile%20r_emailaddress'
    return redirect(f"https://www.linkedin.com/oauth/v2/authorization?{qs}", 307)


@auth.route('/api/linkedin/authorize')
def linkedin_authorize():
    provider = 'linkedin'

    #Extract code
    if 'code' not in request.args:
        # User did not authorize or site down
        return redirect(BASE_URL, code=307)

    authorization_code = request.args['code']
    state = request.args['state']
    state_split = state.split(" ")
    oauth_state = state_split[0]
    path = state_split[1]

    if oauth_state != OAUTH_STATE:
        return "Unauthorized", 401

    #Get token
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    params = {
        'grant_type': 'authorization_code',
        'code': f'{authorization_code}',
        'redirect_uri': LINKEDIN_REDIRECT_URL,
        'client_id': LINKEDIN_CLIENT_ID,
        'client_secret': LINKEDIN_SECRET,
    }

    try:
        response = requests.post('https://www.linkedin.com/oauth/v2/accessToken', params=params, headers=headers)

        access_token = response.json()["access_token"]
        headers = {
            'Authorization': f'Bearer {access_token}',
        }

        #Get user
        get_user_uri = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,EMAIL,handle~))'
        #get_user_uri = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))'
        response = requests.get(get_user_uri, headers=headers)
        contacts = response.json()

        email_address = None
        for contact in contacts['elements']:
            if 'emailAddress' in contact['handle~']:
                email_address = contact['handle~']['emailAddress']
                break

        if email_address == None:
            return 'Email not found', 500

        response = requests.get('https://api.linkedin.com/v2/me', headers=headers)
        users_info = response.json()
        users_name = f'{users_info["localizedFirstName"]} {users_info.get("localizedLastName")}'.strip()

        user = User.query.filter_by(email=email_address, provider=provider).first()

        # If user exists
        if user:
            session["user_id"] = user.id  
            return redirect(f"{BASE_URL}{path}", code=307)

        user = User(email=email_address, user_name=users_name, provider=provider)

        db.session.add(user)
        db.session.commit()

    except Exception as e:
        print(e)
        return 'Internal Server Error', 500
    else:
        session["user_id"] = user.id
        return redirect(f"{BASE_URL}{path}", code=307)


@auth.route('api/github/login')
def github_login():
    path = request.args['currentpath']
    state = " ".join([OAUTH_STATE, path])
    qs = f'client_id={GITHUB_CLIENT_ID}&state={state}&scope=user:email'
    return redirect(f"https://github.com/login/oauth/authorize?{qs}", 307)


@auth.route('/api/github/authorize')
def github_authorize():
    provider='github'

    try:
        code = request.args.get("code")
        if not code:
            # User did not authorize or site down
            return redirect(BASE_URL, code=307)

        state = request.args['state']
        state_split = state.split(" ")
        oauth_state = state_split[0]
        path = state_split[1]

        if oauth_state != OAUTH_STATE:
            return "Unauthorized", 401

        user_name, primary_email = __get_github_user(code)

        user = User.query.filter_by(email=primary_email, provider=provider).first()

        # If user exists
        if user:
            session["user_id"] = user.id
            return redirect(f"{BASE_URL}{path}", code=307)

        # Create new user 
        user = User(email=primary_email, user_name=user_name, provider=provider)

        db.session.add(user)
        db.session.commit()
    except Exception as e:
        print(e)
        return 'Internal Server Error', 500
    else:
        session["user_id"] = user.id
        return redirect(f"{BASE_URL}{path}", code=307)


def __get_github_user(code):
    url = 'https://github.com/login/oauth/access_token?'
    values = {
        "code": code,
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET
    }

    qs = urlencode(values)

    access_token_response = requests.post(url + qs)
    decoded = parse_qs(access_token_response.text)
    token = decoded['access_token'][0]

    get_user_response = requests.get("https://api.github.com/user", headers={'Authorization': f'Bearer {token}'})
    get_user_json = get_user_response.json()
    user_name = get_user_json['login']
    primary_email = get_user_json['email']

    if primary_email is None:
        get_emails_response = requests.get("https://api.github.com/user/emails", headers={'Authorization': f'Bearer {token}'})
        email_list = get_emails_response.json()
        for email_dict in email_list:
            if email_dict['primary']:
                primary_email = email_dict['email']

    return user_name, primary_email



@auth.route("/api/google/login")
def google_login():
    path = request.args['currentpath']
    state = " ".join([OAUTH_STATE, path])
    scope = " ".join([
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ])
    values = {
      "client_id": GOOGLE_CLIENT_ID,
      "redirect_uri": GOOGLE_REDIRECT_URI,
      "state": state,
      "scope": scope,
      "access_type": 'offline',
      "response_type": 'code',
      "prompt": 'consent'
    }

    qs = urlencode(values)

    print(qs)
    return redirect(f"https://accounts.google.com/o/oauth2/v2/auth?{qs}", 307)


@auth.route("/api/google/authorize")
def google_authorize():
    provider='google'
    try:
        code = request.args.get("code")
        if not code:
            # User did not authorize or site down
            return redirect(BASE_URL, code=307)

        state = request.args['state']
        state_split = state.split(" ")
        oauth_state = state_split[0]
        path = state_split[1]

        if oauth_state != OAUTH_STATE:
            return "Unauthorized", 401

        user_name, primary_email, verified_email = __get_google_user(code)

        # If email not verified, return error
        if not verified_email:
            return "Your Google email is not verified", 403

        user = User.query.filter_by(email=primary_email, provider=provider).first()

        # If user exists
        if user:
            session["user_id"] = user.id
            return redirect(f"{BASE_URL}{path}", code=307)

        # Create new user 
        user = User(email=primary_email, user_name=user_name, provider=provider)

        db.session.add(user)
        db.session.commit()
    except Exception as e:
        print(e)
        return 'Internal Server Error', 500
    else:
        session["user_id"] = user.id
        return redirect(f"{BASE_URL}{path}", code=307)


def __get_google_user(code):
    # Get token
    url = 'https://oauth2.googleapis.com/token?'
    values = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    qs = urlencode(values)

    try:
        access_token_response = requests.post(url + qs)
        access_token_response_text = access_token_response.text
        access_token_response_json = json.loads(access_token_response_text)
        id_token = access_token_response_json['id_token']
        access_token = access_token_response_json['access_token']
        
        get_google_user_response = requests.get(f'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={access_token}', headers={'Authorization': f'Bearer {id_token}'})
        get_google_user_response_json = json.loads(get_google_user_response.text)
        user_name = get_google_user_response_json['name']
        primary_email = get_google_user_response_json['email']
        verified_email = get_google_user_response_json['verified_email']
    except Exception as e:
        print(e)
    else:
        return user_name, primary_email, verified_email


@auth.route("/api/logout", methods=["POST"])
def logout_user():
    if session.get("user_id"):
        session.pop("user_id")
    return "200"
