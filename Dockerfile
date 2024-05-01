# Use the official Nginx image from the Docker Hub
FROM nginx:alpine

# Install gettext package which provides the "envsubst" command
RUN apk add --no-cache gettext

# Copy custom configuration template
COPY nginx.conf /etc/nginx/templates/nginx.conf

# Remove the default Nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from the current directory to the Nginx server
COPY . /usr/share/nginx/html

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Expose port dynamically (will be determined by runtime environment variable)
EXPOSE $PORT

# Use the entrypoint script to start Nginx
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
