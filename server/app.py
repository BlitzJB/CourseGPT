from flask_cors import CORS
from flask import Flask
import openai
import os
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

openai.api_key = os.environ.get("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)