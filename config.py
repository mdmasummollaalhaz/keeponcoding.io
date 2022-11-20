import json
import redis

with open('/etc/flask-config.json') as config_file:
    config = json.load(config_file)


class Config:
    SQL_HOST = config.get('SQL_HOST')
    SQL_USER = config.get('SQL_USER')
    SQL_PASS = config.get('SQL_PASS')
    DB_NAME = config.get('DB_NAME')

