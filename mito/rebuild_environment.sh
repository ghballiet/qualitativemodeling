#!/bin/bash

echo "Fixing file permissions..."
chmod -R 777 includes/json

echo "Building Lisp bootstrap file..."
cd includes/lisp
sbcl --load bootstrap.lisp
echo "Done."

echo "Reloading JSON..."
./encode_struct.sh places
./encode_struct.sh quantities
./encode_struct.sh claims
./encode_struct.sh facts
./encode_struct.sh predictions
./encode_struct.sh beliefs > /dev/null