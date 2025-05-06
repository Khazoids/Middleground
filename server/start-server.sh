cd /home/ubuntu/middleground/server
set -a
source config.env
set +a
NODE_ENV=production npx tsx server