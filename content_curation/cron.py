from django.core.management import call_command

# import logging
import sys

# logger = logging.getLogger(__name__)

'''
def db_backup():
    print("Starting backup")
    try:
        call_command('dbbackup')

    except:
        # e = sys.exc_info()[0]
        # logger.error(e)
        pass
'''


def db_backup():
    print("Starting backup")
    call_command('dbbackup')
    print("Ending backup")
