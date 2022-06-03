# syntax=docker/dockerfile:1
FROM python:3.8-slim as base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/

From base
RUN apt-get update
RUN apt-get install -y clamav clamav-daemon

# this is to bootstrap the virus definitions, as trying to start clamd without
# any just causes the process to die, upon the container starting it updates
# these immediately again
RUN freshclam
