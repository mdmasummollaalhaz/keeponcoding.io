from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import fields
from uuid import uuid4

db = SQLAlchemy()
ma = Marshmallow()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(150), nullable=False)
    user_name = db.Column(db.String(150))
    password = db.Column(db.Text, nullable=False)
    provider = db.Column(db.String(50))
    created_date = db.Column(db.DateTime(timezone=True), default=func.now())
    __table_args__ = (
        # this can be db.PrimaryKeyConstraint if you want it to be a primary key
        db.UniqueConstraint('email', 'provider'),
    )

class UserSchema(ma.Schema):
    email = fields.String()
    user_name = fields.String()



class Question(db.Model):
    __tablename__ = "question"

    id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.String(4092))
    topic = db.Column(db.Integer)
    difficulty = db.Column(db.Integer)
    title = db.Column(db.String(1024))
    constraints = db.Column(db.String(1024))
    question_name = db.Column(db.String(100))
    video_url = db.Column(db.String(100))

class QuestionSchema(ma.Schema):
    id = fields.Int()
    prompt = fields.String()
    topic = fields.String()
    difficulty = fields.Int()
    title = fields.String()
    constraints = fields.String()
    question_name = fields.String()
    video_url = fields.String()


class TopicQuestionSchema(ma.Schema):
    id = fields.Int()
    difficulty = fields.Int()
    title = fields.String()
    question_name = fields.String()
    question_difficulty_desc = fields.String()



class QuestionExample(db.Model):
    __tablename__ = 'question_example'
    
    id = db.Column(db.Integer, primary_key=True)
    question_name = db.Column(db.String(100))
    example_order_id = db.Column(db.Integer)
    input = db.Column(db.String(1000))
    output = db.Column(db.String(1000))
    explanation = db.Column(db.String(1000))

class QuestionExampleSchema(ma.Schema):
    question_name = fields.String()
    example_order_id = fields.Integer()
    input = fields.String()
    output = fields.String()
    explanation = fields.String()


class SubmissionStatus(db.Model):
    __tablename__ = 'submission_status'
    
    id = db.Column(db.Integer, primary_key=True)
    status_desc = db.Column(db.String(45))

class SubmissionStatusSchema(ma.Schema):
    id = fields.Integer()
    status_desc = fields.String()


class QuestionSubmission(db.Model):
    __tablename__ = 'question_submission'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    question_id = db.Column(db.Integer)
    language_id = db.Column(db.Integer)
    submission_status = db.Column(db.Integer)
    submission_date = db.Column(db.DateTime(timezone=True), default=func.now())
    submission_code = db.Column(db.String(10000))

class QuestionSubmissionSchema(ma.Schema):
    question_id = fields.Integer()
    language_id = fields.Integer()
    submission_status = fields.String()
    submission_date = fields.DateTime()
    # submission_code = fields.String()
    language = fields.String()
    status_desc = fields.String()



class QuestionTopic(db.Model):
    __tablename__ = 'question_topic'

    id = db.Column(db.Integer, primary_key=True)
    question_topic_desc = db.Column(db.String(64))
    topic_order = db.Column(db.Integer)
    topic_url_path = db.Column(db.String(45))

class QuestionTopicSchema(ma.Schema):
    question_topic_desc = fields.String()
    topic_order = fields.Integer()
    topic_url_path = fields.String()




class QuestionDifficulty(db.Model):
    __tablename__ = 'question_difficulty'

    id = db.Column(db.Integer, primary_key=True)
    question_difficulty_desc = db.Column(db.String(32))

class QuestionDifficultySchema(ma.Schema):
    id = fields.Integer
    question_difficulty_desc = fields.String()




class QuestionTemplate(db.Model):
    __tablename__ = 'question_template'

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer)
    language_id = db.Column(db.Integer, db.ForeignKey('language.id'))
    boilerplate = db.Column(db.String(10000))

class QuestionTemplateSchema(ma.Schema):
    id = fields.Integer()
    question_id = fields.Integer()
    language_id = fields.Integer()
    boilerplate = fields.String()

        

class QuestionTestCode(db.Model):
    __tablename__ = 'question_test_code'

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer)
    language_id = db.Column(db.Integer, db.ForeignKey('language.id'))
    test_code = db.Column(db.String(10000))

class QuestionTestCodeSchema(ma.Schema):
    id = fields.Integer()
    question_id = fields.Integer()
    language_id = fields.String()
    test_code = fields.String()



class Language(db.Model):
    __tablename__ = 'language'

    id = db.Column(db.Integer, primary_key=True)
    language = db.Column(db.String(32))
    active = db.Column(db.Integer)
    # question_template = db.relationship('QuestionTemplate')
    # question_test_code = db.relationship('QuestionTestCode')

class LanguageSchema(ma.Schema):
    id = fields.Integer()
    language = fields.String()
    active = fields.Integer()
    # question_template = fields.Nested(QuestionTemplateSchema)
    # question_test_code = fields.Nested(QuestionTestCodeSchema)


class EditorOptionsSchema(ma.Schema):
    language = fields.String()
    boilerplate = fields.String()
    test_code = fields.String()

# class Sessions(db.Model):
#     __tablename__ = 'sessions'

#     id = db.Column(db.Integer, primary_key=True)
#     session_id = db.Column(db.String(255))
#     data = db.Column(db.LargeBinary)
#     expiry = db.Column(db.DateTime())
