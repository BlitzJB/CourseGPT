import re


def query_to_headings(response):
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