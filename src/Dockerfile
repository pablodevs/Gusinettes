FROM python:3.8-alpine3.14

WORKDIR /app
COPY ./entrypoint.sh /app/entrypoint.sh
COPY ./migrations /app/src/migrations
COPY ./src/requirements.txt /app/src/requirements.txt
RUN \
 apk add --no-cache postgresql-libs &&  \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev &&  \
 python3 -m pip install -r /app/src/requirements.txt --no-cache-dir &&  \
 apk --purge del .build-deps

COPY . /app
RUN chmod +x /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]