from django.apps import AppConfig
from sys import argv

class BackendConfig(AppConfig):
    name = 'backend'


class GroupPermissionsConfig(AppConfig):
    name = 'backend'

    def ready(self):
        # Groups shouldn't be added in migration/other stages
        # Hence check that server is being run before running handle
        is_runserver = any(arg.casefold() == 'runserver' for arg in argv)
        is_runsslserver = any(arg.casefold() == 'runsslserver' for arg in argv)

        if is_runserver or is_runsslserver:
            from .GroupAuthorization import handle
            handle(self)
