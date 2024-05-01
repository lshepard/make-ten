#!/bin/sh

# Use envsubst to replace the environment variable in the Nginx configuration
envsubst < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf

# Execute the command provided to the entrypoint (CMD in Dockerfile)
exec "$@"
