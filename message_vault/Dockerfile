# Final stage: lightweight image
FROM debian:bookworm-slim

WORKDIR /app

COPY .env .env
# Binary ko copy karo (binary ka naam same hona chahiye jo tu "cargo build --release" se banata hai)
COPY message_vault /app/app

# Port expose
EXPOSE 4003

# Default command
CMD ["./app"]
