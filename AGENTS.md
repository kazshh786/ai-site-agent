# AI Site Agent Documentation

This document describes the key components and workflow of the AI Site Agent project.

## Project Overview

This is an AI-powered website generator that uses Celery to handle asynchronous tasks. A main Python script queues a website creation task, which is then picked up and executed by a Celery worker. The process requires a running Redis instance to act as the message broker.

---

## Key Services & Agents

### 1. Redis Server (Message Broker)

Celery requires a running Redis server to manage the task queue.

- **How to Start:** The environment setup script should start a Redis server, for example, using `sudo service redis-server start`.
- **Connection:** The application connects to Redis at `redis://localhost:6379/0`.

### 2. Celery Worker (`tasks.py`)

This is the core agent that processes the website creation tasks from the queue. It must be running in the background for the system to work.

- **File:** `tasks.py`
- **How to Start:**
  ```bash
  celery -A tasks worker --loglevel=INFO &
