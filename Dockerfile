# Stage 1: base source
FROM alpine AS base
WORKDIR /project
COPY project-vite ./project-vite
COPY project-api ./project-api

# Stage 2: build frontend
FROM node:lts-alpine AS frontend-build
WORKDIR /project/project-vite

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_SENTRY_DSN
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

COPY --from=base /project/project-vite ./
RUN npm ci
RUN npm run build

# Stage 3: build & run backend
FROM python:3.13-slim
WORKDIR /project/project-api
COPY --from=base /project/project-api ./
COPY --from=frontend-build /project/project-vite/dist /project/project-vite/dist
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]