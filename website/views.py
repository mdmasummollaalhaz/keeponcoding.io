from datetime import datetime
from flask import Blueprint, request, jsonify, session
from .models import *
import json, docker

views = Blueprint('views', __name__)

ACCEPTED_SUBMISSION = 1
RUNTIME_ERROR_SUBMISSION = 2
COMPILATION_ERROR_SUBMISSION = 3
WRONG_ANSWER_SUBMISSION = 4
TIME_LIMIT_EXCEEDED_SUBMISSION = 5
DOCKER_TIMEOUT_EXIT_CODE = 124

question_schema = QuestionSchema()
question_schemas = QuestionSchema(many=True)
question_topic_schema = QuestionTopicSchema()
question_topic_schemas = QuestionTopicSchema(many=True)
topic_questions_schemas = TopicQuestionSchema(many=True)
question_example_schema = QuestionExampleSchema()
question_example_schemas = QuestionExampleSchema(many=True)
question_submission_schema = QuestionSubmissionSchema()
question_submission_schemas = QuestionSubmissionSchema(many=True)
language_schemas = LanguageSchema(many=True)
language_schema = LanguageSchema()
editor_options_schema = EditorOptionsSchema()
editor_options_schemas = EditorOptionsSchema(many=True)


@views.route('/api/submit-code', methods=['POST'])
def submit_code():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    req = json.loads(request.data)
    language_id = req['language_id']
    code = req['code']
    question_number = req['question_number']
    command_list = [question_number, code]
    submission_status = 0

    try:
        container, status_code = __run_docker_container(language_id, command_list)

        if status_code == DOCKER_TIMEOUT_EXIT_CODE:
            submission_status = TIME_LIMIT_EXCEEDED_SUBMISSION
            result = {"time_limit_exceeded" : True}
        elif status_code == 0:
            stdout = container.logs(stdout=True, stderr=False).decode('utf-8')
            stderr = container.logs(stdout=False, stderr=True).decode('utf-8')

            #Run language specific string parser
            if language_id == 1:
                pass
            elif language_id == 2:
                result = __javascript_string_parser(stdout, stderr)
            elif language_id == 3:
                pass
            
            submission_status = __get_submission_status(result)
        else:
            raise Exception("Docker status code: " + status_code + " not expected.")
    except Exception as e:
        print(e)
        return 'Internal Server Error', 500
    finally:
        container.remove()

    try:
        __save_question_submission(user_id, language_id, code, submission_status, question_number)
    except Exception as e:
        print(e)
        return 'Internal Server Error', 500

    print(result)
    return result


@views.route('/api/test-code', methods=['POST'])
def test_code():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    req = json.loads(request.data)
    language_id = req['language_id']
    code = req['code']
    question_number = req['question_number']
    custom_input = req['custom_input']
    command_list = [question_number, code, custom_input]

    try:
        container, status_code = __run_docker_container(language_id, command_list)

        if status_code == DOCKER_TIMEOUT_EXIT_CODE:
            result = {"time_limit_exceeded" : True}
        elif status_code == 0:
            stdout = container.logs(stdout=True, stderr=False).decode('utf-8')
            stderr = container.logs(stdout=False, stderr=True).decode('utf-8')

            #Run language specific string parser
            if language_id == 1:
                pass
            elif language_id == 2:
                result = __javascript_string_parser(stdout, stderr)
            elif language_id == 3:
                pass
            
        else:
            raise Exception("Docker status code: " + status_code + " not expected.")
    except Exception as e:
        return 'Internal Server Error', 500
    finally:
        container.remove()

    return result


#Get all questions
@views.route('/api/questions')
def get_questions():
    try:
        questions = Question.query.all()
    except Exception as e:
        print(e)
        return 'Internal Server Error', 500

    return question_schemas.dump(questions)


@views.route('/api/questions/<question_name>')
def get_question(question_name):
    
    user_id = session.get("user_id")

    if not user_id:
        user_id = '0'

    try:
        question = db.session.query(Question) \
            .filter_by(question_name=question_name) \
            .first()

        question_examples = db.session.query(QuestionExample) \
            .filter_by(question_name=question_name) \
            .order_by(QuestionExample.example_order_id)

        question_submissions = db.session.query(QuestionSubmission.submission_code, 
                                                QuestionSubmission.submission_date, 
                                                QuestionSubmission.submission_status,
                                                Language.language, 
                                                SubmissionStatus.status_desc) \
            .join(Language, Language.id == QuestionSubmission.language_id)\
            .join(SubmissionStatus, SubmissionStatus.id == QuestionSubmission.submission_status)\
            .filter(QuestionSubmission.user_id==user_id) \
            .filter(question.id == QuestionSubmission.question_id) \
            .order_by(QuestionSubmission.submission_date.desc())

        question_template = db.session.query(Language.language, QuestionTemplate.boilerplate)\
            .join(QuestionTemplate, QuestionTemplate.language_id==Language.id)\
            .filter(Language.active==1)\
            .filter(QuestionTemplate.question_id==question.id)\
            .order_by(Language.id)

        question_test_code = db.session.query(Language.language, QuestionTestCode.test_code)\
            .join(QuestionTestCode, QuestionTestCode.language_id==Language.id)\
            .filter(Language.active==1)\
            .filter(QuestionTestCode.question_id==question.id)\
            .order_by(Language.id)

    except Exception as e:
        print(e)
        return 'Internal Server Error', 500

    return  {
                'question': question_schema.dump(question), 
                'question_examples' : question_example_schemas.dump(question_examples),
                'question_submissions' : question_submission_schemas.dump(question_submissions),
                'question_template' : editor_options_schemas.dump(question_template),
                'question_test_code' : editor_options_schemas.dump(question_test_code)
            }


@views.route('/api/topics')
def get_topics():
    try:
        question_topics = QuestionTopic.query.order_by(QuestionTopic.topic_order)
    except Exception as e:
        return 'Internal Server Error', 500
    return question_topic_schemas.dump(question_topics)


#Get questions based on topic
@views.route('/api/topics/<topic_url_path>')
def get_topic_questions(topic_url_path):
    try:
        questions = db.session.query(Question.title, Question.question_name, QuestionDifficulty.question_difficulty_desc)\
            .join(QuestionTopic, QuestionTopic.id == Question.topic)\
            .join(QuestionDifficulty, QuestionDifficulty.id == Question.difficulty)\
            .filter(QuestionTopic.topic_url_path==topic_url_path)

        
    except Exception as e:
        print(e)
        return 'Internal Server Error', 500
    return topic_questions_schemas.dump(questions)



def __get_docker_image_name(language_id):
    if language_id == 1:
        return 'python-codeexecution'
    elif language_id == 2:
        return 'javascript-codeexecution'
    elif language_id == 3:
        return 'java-codeexecution'


def __get_submission_status(response):
    if response['has_syntax_error']:
        return RUNTIME_ERROR_SUBMISSION
    elif response['has_compile_error']:
        return COMPILATION_ERROR_SUBMISSION
    elif response['test_output']['outcome'] == "SUCCESS":
        return ACCEPTED_SUBMISSION
    elif response['test_output']['outcome'] == "FAIL":
        return WRONG_ANSWER_SUBMISSION
    return 0


def __run_docker_container(language_id, command_list):
    docker_image_name = __get_docker_image_name(language_id)

    #Create Docker container
    dockerClient = docker.from_env()

    container = dockerClient.containers.run(image=docker_image_name
                                            ,command=command_list
                                            ,detach=True
                                            )
    
    container_wait_result = container.wait()
    
    return container, container_wait_result['StatusCode']


def __save_question_submission(id, language_id, code, submission_status, question_number):
    new_submission = QuestionSubmission(user_id=id, language_id=language_id, 
                        submission_date=datetime.now(), submission_code=code, 
                        submission_status=submission_status, question_id=question_number)
    db.session.add(new_submission)
    db.session.commit()


def __javascript_string_parser(stdout, stderr):

    if "__SYNTAX_ERROR__" in stdout:
        return {'has_syntax_error' : True, 'syntax_error_message' : stderr}
    else:
        std_out_split = stdout.split('--- RESULT DELIMITER ---')

        console_output = std_out_split[0]

        if len(std_out_split) > 2:
            console_output += std_out_split[2]

        return { 'console_output': console_output, 'test_output' : json.loads(std_out_split[1]), 'has_syntax_error': False, 'has_compile_error': False }
    
