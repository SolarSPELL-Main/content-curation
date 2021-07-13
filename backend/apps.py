from django.apps import AppConfig


class BackendConfig(AppConfig):
    name = 'backend'


class GroupPermissionsConfig(AppConfig):
    name = 'backend'

    def ready(self):
        from .GroupAuthorization import handle
        handle(self)
