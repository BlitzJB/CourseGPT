# Useage
There are a few differences between the openai library's api and this


### Sync Generation without Streaming
```python
sync_chat = AivvmChatCompletion(
    model="gpt-3.5-turbo",
    stream=False,
    messages=[{"role": "user", "content": "How do I cook a biryani"}],
)
print("Sync with no streaming\n\n", sync_chat.response)
```

### Async Generation without Streaming
```python
async def async_example():
    async_chat = AivvmChatCompletion(
        model="gpt-3.5-turbo",
        stream=False,
        messages=[
            {"role": "system", "content": "Provide instructions for cooking biryani"}
        ],
        async_mode=True,
    )
    print("Async with no streaming\n\n", await async_chat.response)


loop = asyncio.get_event_loop()
async_task = loop.create_task(async_example())
loop.run_until_complete(async_task)
```

### Sync Generation with Streaming
```python
sync_chat = AivvmChatCompletion(
    model="gpt-3.5-turbo",
    stream=True,
    messages=[{"role": "user", "content": "How do I cook biryani"}],
)
print("Sync with streaming\n\n")
for chunk in sync_chat.response:
    print(chunk, end="")
```

### Async Generation with Streaming
```python
async def async_example():
    async_chat = AivvmChatCompletion(
        model="gpt-3.5-turbo",
        stream=True,
        messages=[
            {"role": "system", "content": "Provide instructions for cooking biryani"}
        ],
        async_mode=True,
    )
    print("Async with streaming\n\n")
    async for chunk in async_chat.response:
        print(chunk, end="")


loop = asyncio.get_event_loop()
async_task = loop.create_task(async_example())
loop.run_until_complete(async_task)
```

