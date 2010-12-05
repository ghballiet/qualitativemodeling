#!/bin/bash

echo "Building Lisp bootstrap file..."
cd includes/lisp
sbcl --load bootstrap.lisp
echo "Done."