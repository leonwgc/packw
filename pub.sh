#!/bin/bash
set -e

if [[ -z $1 ]]; then
  echo "version: "
  read -r ver
else
  ver=$1
fi

  # publish
  # git push origin refs/tags/v"$ver"
  git tag -d v"$ver"
  git push origin :v"$ver"
  git tag v"$ver"
  git push origin v"$ver"

  npm publish
fi