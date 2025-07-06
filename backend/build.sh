#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files for the admin panel
python manage.py collectstatic --no-input

# Run migrations app by app in the correct order to resolve dependencies
# This is the key fix
python manage.py migrate contenttypes
python manage.py migrate auth
python manage.py migrate api
python manage.py migrate