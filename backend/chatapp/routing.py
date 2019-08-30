from channels.routing import ProtocolTypeRouter, URLRouter
import chatall.routing
from .token_auth import TokenAuthMiddlewareStack
from channels.auth import AuthMiddlewareStack

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chatall.routing.websocket_urlpatterns
        )
    ),
})