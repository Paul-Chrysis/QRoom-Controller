#!/bin/bash

# Script to generate a self-signed SSL certificate for Rails development
# This is needed because we're using secure cookies with SameSite=None

# Create directory for SSL certificates if it doesn't exist
mkdir -p config/ssl

# Generate a private key
openssl genrsa -out config/ssl/localhost.key 2048

# Generate a certificate signing request
openssl req -new -key config/ssl/localhost.key -out config/ssl/localhost.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate a self-signed certificate valid for 1 year
openssl x509 -req -days 365 -in config/ssl/localhost.csr -signkey config/ssl/localhost.key -out config/ssl/localhost.crt

# Remove the CSR as it's no longer needed
rm config/ssl/localhost.csr

# Set permissions
chmod 600 config/ssl/localhost.key
chmod 600 config/ssl/localhost.crt

echo "Self-signed SSL certificate generated successfully!"
echo "Certificate: config/ssl/localhost.crt"
echo "Private key: config/ssl/localhost.key"
echo ""
echo "To use these certificates with Rails, update config/puma.rb with:"
echo "ssl_bind '0.0.0.0', '3000', { key: 'config/ssl/localhost.key', cert: 'config/ssl/localhost.crt' }"
