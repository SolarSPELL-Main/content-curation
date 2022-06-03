/etc/init.d/clamav-daemon start
python manage.py migrate
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python manage.py shell
echo "from django.contrib.sites.models import Site; site = Site.objects.create(domain='localhost', name='localhost'); site.save()" | python manage.py shell
python manage.py migrate && python manage.py runserver 0.0.0.0:8000
