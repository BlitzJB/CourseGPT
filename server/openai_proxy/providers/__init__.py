from .aivvm import AivvmChatCompletion

PROVIDERS = {
    AivvmChatCompletion.__name__: AivvmChatCompletion,
}