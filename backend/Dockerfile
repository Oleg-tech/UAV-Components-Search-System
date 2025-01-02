# Use the official Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc python3-dev libpq-dev

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application code
COPY . /app/

WORKDIR /app/uav_components_search


# Set environment variables for superuser credentials
ENV DJANGO_SUPERUSER_USERNAME=admin
ENV DJANGO_SUPERUSER_EMAIL=admin@example.com
ENV DJANGO_SUPERUSER_PASSWORD=securepassword

# Expose the port Django runs on
EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py createsuperuser --noinput || echo 'Superuser already exists' && python manage.py runserver 0.0.0.0:8000"]
