from pydantic import BaseModel

class GetOutlineRequest(BaseModel):
    topic: str
    custom_instructions: str