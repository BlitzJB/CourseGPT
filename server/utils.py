from functools import wraps
import time
import openai
from openai.error import ServiceUnavailableError, APIError

from exceptions import RateLimitExcepton


def conv_h_to_str(topics):
    out = ""
    for index, item in enumerate(topics):
        out += f"{index+1}. {item['topic']}\n"
        for s_index, subtopic in enumerate(item['subtopics']):
            out += f"\t{index+1}.{s_index+1}. {subtopic['name']}\n"
    return out


def rate_limited(max_per_interval, interval):
    calls = []
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_time = time.time()

            calls[:] = [call for call in calls if current_time - call < interval]

            if len(calls) < max_per_interval:
                calls.append(current_time)
                return func(*args, **kwargs)
            else:
                raise RateLimitExcepton("Rate Limit Exceeded")
        return wrapper
    return decorator


@rate_limited(max_per_interval=3, interval=60)
def execute(system, user) -> str:
    messages = [{
        "role": "system",
        "content": system
    }]
    
    if (user):
        messages.append({
            "role": "user",
            "content": user
        })
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k",
            messages=messages,
            temperature=1,
            max_tokens=10568,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        return response['choices'][0]['message']['content']
    except ServiceUnavailableError:
        print("SUE")
        return execute(system, user)
    except APIError:
        print("APIE")
        return execute(system, user)