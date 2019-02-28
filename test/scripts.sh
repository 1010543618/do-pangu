#!/bin/sh
mkdir git
cd git
touch test测试.md < ../test.md
touch test.md < ../test.md
touch \!\@\#\$\^\&\-\+\,test\_\(\{\~\'测试\'\;\}\).md < ../test.md

git init
git add .

npx do-pangu

git status