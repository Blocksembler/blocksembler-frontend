#!/bin/sh

# Path to the runtime config.js file
CONFIG_FILE=/usr/share/nginx/html/config.js

# Replace placeholders in config.js with environment variables
cat <<EOF > $CONFIG_FILE
window.env = {
    DEFAULT_ARCHITECTURE: "${BLOCKSEMBLER_DEFAULT_ARCHITECTURE:-anna}",
    BACKEND_API_URL: "${BLOCKSEMBLER_BACKEND_API_URL:-/api/v3}",
    LOG_SYNC_BATCH_SIZE: "${BLOCKSEMBLER_LOG_SYNC_BATCH_SIZE}",
    LOG_SYNC_INTERVAL: "${BLOCKSEMBLER_LOG_SYNC_INTERVAL}",
};
EOF

# Start Nginx
/docker-entrypoint.sh "$@"