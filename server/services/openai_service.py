from openai_proxy import ChatCompletion

async def create_subtopic_task(t_index, s_index, topic, outline):
    """
    Create an asynchronous task to generate a subtopic.
    """
    o_to_full_prompt = open("./prompts/outline-to-full.md").read()
    task = ChatCompletion(
        model="gpt-3.5-turbo",
        temperature=1,
        async_mode=True,
        messages=[
            {
                "role": "system",
                "content": o_to_full_prompt.replace("{{ TOPIC }}", topic).replace("{{ OUTLINE }}", outline)
            },
            {
                "role": "user",
                "content": f"Current section number: {t_index+1}.{s_index+1}"
            }
        ]
    )
    result = await task.response
    return {"index": t_index, "subindex": s_index, "result": result}

def get_outline_sync(topic: str, custom_instructions: str):
    q_to_h_prompt = open("./prompts/query-to-headings.md").read()
    q_to_h_prompt = q_to_h_prompt.replace("{{ TOPIC }}", topic).replace("{{ CUSTOM_INSTRUCTIONS }}", custom_instructions) 
    response = ChatCompletion(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": q_to_h_prompt
            },
            {
                "role": "user",
                "content": topic
            }
        ]
    ).response
    return response