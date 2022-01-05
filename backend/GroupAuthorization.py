from django.contrib.auth.models import Group, Permission

import logging

logger = logging.getLogger(__name__)

GROUPS = {
    "Admin": {
        # general permissions
        "log entry": ["add", "delete", "change", "view"],
        "group": ["add", "delete", "change", "view"],
        "permission": ["add", "delete", "change", "view"],
        "user": ["add", "delete", "change", "view"],
        "content type": ["add", "delete", "change", "view"],
        "session": ["add", "delete", "change", "view"],
        "copyright permission": ["add", "delete", "change", "view"],
        "organization": ["add", "delete", "change", "view"],
    },

    "Library Specialist": {
        "metadata type": ["add", "delete", "change", "view"],
        "metadata": ["add", "delete", "change", "view"],
        "content": ["add", "delete", "change", "view"],
        "copyright permission": ["add", "delete", "change", "view"],
        "organization": ["add", "delete", "change", "view"],
    },

    "Student": {
        "metadata type": ["add", "delete", "change", "view"],
        "metadata": ["add", "delete", "change", "view"],
        "content": ["add", "delete", "change", "view"],
        "copyright permission": ["add", "view"],
        "organization": ["add", "view"],
    },
}


# Creates Groups and permission
def handle(self, *args, **options):
    for group_name in GROUPS:
        new_group, created = Group.objects.get_or_create(name=group_name)
        # Loop models in group
        for app_model in GROUPS[group_name]:
            # Loop permissions in group/model
            for permission_name in GROUPS[group_name][app_model]:
                # Generate permission name as Django would generate it
                name = "Can {} {}".format(permission_name, app_model)
                try:
                    model_add_perm = Permission.objects.get(name=name)
                except Permission.DoesNotExist:
                    logger.warning(
                        "Permission not found with name '{}'.".format(name))
                    continue
                new_group.permissions.add(model_add_perm)
