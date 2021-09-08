from django.core.management import call_command

import logging
import sys

logger = logging.getLogger(__name__)


def db_backup():
    logger.debug("Database Backup Started")
    try:
        call_command('dbbackup')

    except:
        e = sys.exc_info()[0]
        logger.error(e)
        pass

