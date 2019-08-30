from channels.auth import AuthMiddlewareStack
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        headers = dict(scope['headers'])
        print(scope)
        if b'sec-websocket-protocol' in headers:
            print(headers[b'sec-websocket-protocol'].decode().split())
            try:
                token_key = headers[b'sec-websocket-protocol'].decode().split()
                if token_key:
                    token = Token.objects.get(key=token_key)
                    scope['user'] = token.user
                else:
                    scope['user'] = AnonymousUser()
            except Token.DoesNotExist:
                scope['user'] = AnonymousUser()
        return self.inner(scope)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))