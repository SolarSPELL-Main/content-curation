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
# RUN apt-get install -y systemd
RUN apt-get install -y clamav clamav-daemon
# RUN apt-get install -y clamav-daemon freshclam clamav

# RUN sed -i 's/^Foreground .*$/Foreground true/g' /etc/clamav/clamd.conf && \
#     echo 'TCPSocket 3310' >> /etc/clamav/clamd.conf && \
#     sed -i 's/^Foreground .*$/Foreground true/g' /etc/clamav/freshclam.conf

# this is to bootstrap the virus definitions, as trying to start clamd without
# any just causes the process to die, upon the container starting it updates
# these immediately again
RUN freshclam

# RUN mkdir /run/clamav && chown clamav:clamav /run/clamav
# COPY etc /etc/
