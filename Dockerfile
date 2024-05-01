# Use the official Nginx image from the Docker Hub
FROM nginx:alpine

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf

# Remove the default Nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from the current directory to the Nginx server
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container has provisioned
CMD ["nginx", "-g", "daemon off;"]
