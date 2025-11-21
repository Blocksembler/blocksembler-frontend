#!/bin/sh

# Path to the runtime config.js file
CONFIG_FILE=/usr/share/nginx/html/config.js

export SERVER_NAME=${BLOCKSEMBLER_SERVER_NAME:-localhost}

# Replace placeholders in config.js with environment variables
cat <<EOF > $CONFIG_FILE
window.env = {
    BACKEND_DISABLED: "${BLOCKSEMBLER_BACKEND_DISABLED:-false}",
    DEFAULT_ARCHITECTURE: "${BLOCKSEMBLER_DEFAULT_ARCHITECTURE:-anna}",
    BACKEND_API_URL: "${BLOCKSEMBLER_BACKEND_API_URL:-http://localhost}",
    LOG_SYNC_BATCH_SIZE: "${BLOCKSEMBLER_LOG_SYNC_BATCH_SIZE}",
    LOG_SYNC_INTERVAL: "${BLOCKSEMBLER_LOG_SYNC_INTERVAL}",
    RESOURCE_LINKS: $(echo ${BLOCKSEMBLER_RESOURCE_LINKS} | jq -R -r -c @json)
};
EOF

# Start Nginx
/docker-entrypoint.sh "$@"