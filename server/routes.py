from flask import request, jsonify

from .app import app
from .extractors import query_to_headings
from .utils import execute, conv_h_to_str
from .exceptions import RateLimitExcepton
from .extractors import query_to_headings

@app.route('/getoutline', methods=['POST'])
def get_headings():
    try:
        topic = request.get_json()['topic']
        custom_instructions = request.get_json()['custom_instructions']
        q_to_h_prompt = open("./prompts/query-to-headings.md").read()
        q_to_h_prompt = q_to_h_prompt.replace("{{ TOPIC }}", topic).replace("{{ CUSTOM_INSTRUCTIONS }}", custom_instructions) 
        response = execute(q_to_h_prompt, topic)
        items = query_to_headings(response)
        return jsonify({ "items": items })
    except RateLimitExcepton:
        return "RATE_LIMIT_EXCEEDED", 429

@app.route("/getfull", methods=['POST'])
def get_full():
    try:
        topic = request.get_json()['topic']
        index = int(request.get_json()['topic_number'])
        s_index = int(request.get_json()['subheading_number'])
        outline = conv_h_to_str(request.get_json()['outline']['items'])
        o_to_full_prompt = open("./prompts/outline-to-full.md").read()
        o_to_full_prompt = o_to_full_prompt.replace("{{ TOPIC }}", topic).replace("{{ OUTLINE }}", outline)
        response = execute(o_to_full_prompt, f"Current lecture number: {index}.{s_index}").replace("this lecture", "this section")
        return jsonify({ "text": response })
    except RateLimitExcepton:
        return "RATE_LIMIT_EXCEEDED", 429