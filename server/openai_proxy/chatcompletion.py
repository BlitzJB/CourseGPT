from .providers import PROVIDERS
from .config import BEST_MODELS

class ChatCompletion:
    def __init__(
        self,
        provider="best",
        model="gpt-3.5-turbo",
        stream=False,
        messages=None,
        temperature=0.7,
        async_mode=False,
    ):
        if provider == "best":
            self.provider = BEST_MODELS[model](model, stream, messages, temperature, async_mode)
        elif provider in PROVIDERS:
            self.provider = PROVIDERS[provider](model, stream, messages, temperature, async_mode)
        else:
            raise Exception("Invalid provider")
        
        
    @property
    def response(self):
        return self.provider.response