set windows-shell := ["pwsh", "-NoLogo", "-NoProfileLoadTime", "-Command"]

build:
  cd client && just build

dev:
  cd client && just dev

test:
  cd client && just test