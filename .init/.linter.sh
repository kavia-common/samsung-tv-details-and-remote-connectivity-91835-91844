#!/bin/bash
cd /home/kavia/workspace/code-generation/samsung-tv-details-and-remote-connectivity-91835-91844/samsung_tv_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

