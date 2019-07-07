#!/bin/bash

curl -s -X "$1" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $2" "$3"