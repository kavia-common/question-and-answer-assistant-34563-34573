#!/bin/bash
cd /home/kavia/workspace/code-generation/question-and-answer-assistant-34563-34573/q_and_a_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

