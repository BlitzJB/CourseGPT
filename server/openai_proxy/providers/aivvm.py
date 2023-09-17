import json
import requests
import aiohttp


class AivvmChatCompletion:
    url = "https://chat.aivvm.com/api/chat"
    headers = {
        "Content-Type": "application/json",
    }

    def __init__(
        self,
        model="gpt-3.5-turbo",
        stream=False,
        messages=None,
        temperature=0.7,
        async_mode=False,
    ):
        self.model = model
        self.stream = stream
        self.messages = messages
        self.temperature = temperature
        self.async_mode = async_mode
        self.payload = self._prepare_payload()

    def _prepare_payload(self):
        system_message = None
        if self.messages:
            for message in self.messages:
                if message.get("role") == "system":
                    system_message = message
                    break

        if system_message:
            self.messages.remove(system_message)
            prompt = system_message.get("content")
        else:
            prompt = ""

        payload = {
            "model": {
                "id": self.model,
                "name": "GPT-3.5",
                "maxLength": 12000,
                "tokenLimit": 4096,
            },
            "messages": self.messages,
            "key": "",
            "prompt": prompt,
            "temperature": self.temperature,
        }
        return payload

    def _sync_request(self):
        response = requests.post(
            self.url, headers=self.headers, data=json.dumps(self.payload)
        )
        if response.status_code == 429 or response.status_code == 500:
            return self._sync_request()
        elif response.status_code == 200:
            return response.text

    def _sync_request_generator(self):
        response = requests.post(
            self.url,
            headers=self.headers,
            data=json.dumps(self.payload),
            stream=self.stream,
        )
        
        if response.status_code == 429 or response.status_code == 500:
            return self._sync_request_generator()
        elif response.status_code == 200:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    yield chunk.decode("utf-8")
        else:
            print("Error:", response.status_code)

    async def _async_request_generator(self):
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.url, headers=self.headers, data=json.dumps(self.payload)
            ) as response:
                if response.status == 429 or response.status == 500:
                    async for chunk in self._async_request_generator():
                        yield chunk
                elif response.status == 200:
                    async for chunk in response.content.iter_any():
                        yield chunk.decode("utf-8")
                else:
                    print("Error:", response.status)

    async def _async_request(self):
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.url, headers=self.headers, data=json.dumps(self.payload)
            ) as response:
                if response.status == 429 or response.status == 500:
                    return await self._async_request()
                elif response.status == 200:
                    return await response.text()

    @property
    def response(self):
        return self.fetch_chat_response()

    def fetch_chat_response(self):
        if self.async_mode:
            if self.stream:
                return self._async_request_generator()
            return self._async_request()
        else:
            if self.stream:
                return self._sync_request_generator()
            return self._sync_request()