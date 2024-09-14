#!/bin/bash
set -e

if [ "$VERSION" = "" ]; then
  echo version not specified
  exit 1
fi 

INSTALL_DIR="$HOME/.local/terraform"
URL=""
ARCH=""
OS=""

case $(uname -m) in
  x86_64 | x86-64 | x64 | amd64)
    ARCH="amd64"
  ;;
  aarch64 | arm64)
    ARCH="arm64"
  ;;
esac

case $(uname -s) in
  Darwin)
    OS="macos"
  ;;
  Linux)
    OS="linux"
  ;;
esac

case "$OS-$ARCH" in
  linux-amd64)
    URL=https://releases.hashicorp.com/terraform/${VERSION}/terraform_${VERSION}_linux_arm64.zip
  ;;
  linux-arm64)
    URL=https://releases.hashicorp.com/terraform/${VERSION}/terraform_${VERSION}_linux_arm64.zip
  ;;
  macos-amd64)
    URL=https://releases.hashicorp.com/terraform/${VERSION}/terraform_${VERSION}_darwin_amd64.zip
  ;;
  macos-arm64)
    URL=https://releases.hashicorp.com/terraform/${VERSION}/terraform_${VERSION}_darwin_arm64.zip
  ;;
esac

if [ "$URL" == "" ]; then
  echo "Cannot find installer"
  exit 1
fi

echo $URL

test -d $OUT_DIR && rm -rf $OUT_DIR
mkdir $OUT_DIR
curl -s -L --url $URL | tar -xzf - -C $OUT_DIR

export PATH="${OUT_DIR}:$PATH"
echo "${OUT_DIR}" >> $GITHUB_PATH

terraform --version
