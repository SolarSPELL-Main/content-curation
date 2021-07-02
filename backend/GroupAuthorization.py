from django.contrib.auth.models import Group, Permission
import logging

GROUPS = {
    "Admin": {
        # general permissions
        "log entry": ["add", "delete", "change", "view"],
        "group": ["add", "delete", "change", "view"],
        "permission": ["add", "delete", "change", "view"],
        "user": ["add", "delete", "change", "view"],
        "content type": ["add", "delete", "change", "view"],
        "session": ["add", "delete", "change", "view"],
    },

    "Library Specialist": {
        # django app model specific permissions
        "metadata type": ["add", "delete", "change", "view"],
        "metadata": ["add", "delete", "change", "view"],
        "content": ["add", "delete", "change", "view"],
    },

    "Content Specialist": {
        "metadata type": ["view"],
        "metadata": ["view"],
        "content": ["add", "delete", "change", "view"],
    },
    "Metadata Specialist": {
        # django app model specific permissions
        "metadata type": ["add", "delete", "change", "view"],
        "metadata": ["add", "delete", "change", "view"],
        "content": ["change", "view"],
    },
}


# Creates Groups and permission
def handle(self, *args, **options):
    print("Handle _ GroupAuthorization")
    for group_name in GROUPS:
        print("Group Name ", group_name)
        new_group, created = Group.objects.get_or_create(name=group_name)

        # Loop models in group
        for app_model in GROUPS[group_name]:
            print("App Model", app_model)
            # Loop permissions in group/model
            for permission_name in GROUPS[group_name][app_model]:

                # Generate permission name as Django would generate it
                name = "Can {} {}".format(permission_name, app_model)
                print("Creating {}".format(name))

                try:
                    model_add_perm = Permission.objects.get(name=name)
                except Permission.DoesNotExist:
                    logging.warning(
                        "Permission not found with name '{}'.".format(name))
                    continue

                new_group.permissions.add(model_add_perm)
