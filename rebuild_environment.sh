#!/bin/bash

echo "Fixing file permissions..."
chmod -R 777 includes/json

echo "Building Lisp bootstrap file..."
cd includes/lisp
sbcl --load bootstrap.lisp
echo "Done."