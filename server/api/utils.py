import json, re

def conv_h_to_str(topics):
    """
    Convert topic data to a formatted string representation.
    """
    out = ""
    for index, item in enumerate(topics):
        out += f"{index+1}. {item['topic']}\n"
        for s_index, subtopic in enumerate(item['subtopics']):
            out += f"\t{index+1}.{s_index+1}. {subtopic}\n"
    return out

def sse_format(data):
    """
    Format data for Server-Sent Events.
    """
    return f"data: {json.dumps(data)}\n\n"

def digest_outline(response):
    """
    Convert LLM Generated Outline to a consumable format.
    
    Format:
    ```
    [
        {
            "topic": "Topic 1",
            "subtopics": [
                "Subtopic 1",
                "Subtopic 2",
                "Subtopic 3"
            ]
        },
        {
            "topic": "Topic 2",
            "subtopics": [
                "Subtopic 1",
                "Subtopic 2",
                "Subtopic 3"
            ]
        }
    ]
    ```
    """
    subtopic_pattern = re.compile(r"&&(.*?)&&")
    segments = [segment.strip() for segment in response.split("$$") if segment.strip()]

    output = []
    
    for i in range(0, len(segments), 2):
        topic_name = segments[i]
        subtopics_content = segments[i + 1] if i + 1 < len(segments) else ""
        subtopics = [
            m.group(1).strip() for m in subtopic_pattern.finditer(subtopics_content)
        ]
        
        topic_name = re.sub(r'Unit \d+: ', '', topic_name)
        subtopics = [re.sub(r'Subheading \d+: ', '', subtopic) for subtopic in subtopics]

        output.append({"topic": topic_name, "subtopics": subtopics})

    return output