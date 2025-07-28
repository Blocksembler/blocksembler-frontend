#!/bin/sh

export SSL_CERT_FILE="${SSL_CERT_FILE:-/etc/ssl/fullchain.pem}"
export SSL_KEY_FILE="${SSL_KEY_FILE:-/etc/ssl/key.pem}"

mkdir -p /etc/ssl

if [ ! -f "$SSL_CERT_FILE" ] || [ ! -f "$SSL_KEY_FILE" ]; then
  echo "No existing certificate found. Generating self-signed certificate..."
  mkdir -p /etc/ssl
  openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$SSL_KEY_FILE" \
    -out "$SSL_CERT_FILE" \
    -subj "/C=AT/ST=Vienna/L=Vienna/O=univie/CN=localhost"

  chmod 644 "${SSL_CERT_FILE}"
  chmod 644 "${SSL_KEY_FILE}"

else
  echo "Existing certificate found. Skipping certificate generation."
fi

# Path to the runtime config.js file
CONFIG_FILE=/usr/share/nginx/html/config.js

# Replace placeholders in config.js with environment variables
cat <<EOF > $CONFIG_FILE
window.env = {
    DEFAULT_ARCHITECTURE: "${BLOCKSEMBLER_DEFAULT_ARCHITECTURE:-anna}",
    BACKEND_API_URL: "${BLOCKSEMBLER_BACKEND_API_URL:-localhost}"
};
EOF

# Start Nginx
/docker-entrypoint.sh "$@"