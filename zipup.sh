#! /bin/bash
zip -r ${PWD##*/}.zip * -x .eslintignore .eslintrc.js .gitignore .travis.yml *.zip zipup.sh "node_modules/*" LICENSE;
echo;
echo "created ${PWD##*/}.zip inside this folder";
echo;