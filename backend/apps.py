from django.apps import AppConfig


class BackendConfig(AppConfig):
    name = 'backend'

class GroupPermissionsConfig(AppConfig):
    name = 'backend'

    def ready(self):
        print("Ready method in AppConfig")
        from .GroupAuthorization import handle
        handle(self)