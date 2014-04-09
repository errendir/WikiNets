#!/bin/sh

# compile the coffeescript files in this example project
node_modules/coffee-script/bin/coffee --watch --compile static/*.coffee &

# compile the coffeescript files in celestrium
node_modules/coffee-script/bin/coffee --watch --compile -o static/core/ static/core-coffee/ &

# statically serve files out of ./www/
node web.js
