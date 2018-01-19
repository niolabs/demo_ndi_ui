#!/usr/bin/env bash

##########################################################################
# HOW TO USE THIS SCRIPT TO INSTALL AND RUN THE CLIENT
# in terminal, run one the following command:
# sudo curl http://dni.demo.niolabs.com/install/install_macmini.sh | bash
##########################################################################

mkdir -p ~/nio/projects/dni
cd ~/nio/projects/dni
rm -f client.zip
rm -rf client
echo ""
echo "Downloading nio DNI client"
curl -sS https://dni.demo.niolabs.com/install/client.zip > client.zip
unzip -qq client.zip
rm client.zip
cd client

installed_python="$(which python3)"
if [ $installed_python ]; then
  python_major="$(python3 -c 'import sys; print(sys.version_info[0])')"
  python_minor="$(python3 -c 'import sys; print(sys.version_info[1])')"
  echo "Found python version $python_major.$python_minor"
  if [ \( $python_major -lt 3 \) -o \( $python_minor -lt 4 \) ]; then
    echo "Installing python 3.5.2"
    sudo installer -pkg python-3.5.2-macosx10.6.pkg -target /
  fi
else
  echo "Installing python 3.5.2"
  sudo installer -pkg python-3.5.2-macosx10.6.pkg -target /
fi

echo "Installing pip, psutil, pubkeeper, safepickle"
sudo python3 get-pip.py
sudo pip3.5 install -qqq --upgrade pip
sudo pip3.5 install -qqq psutil
sudo pip3.5 install -qqq pubkeeper.server.core-0.2.5-py3-none-any.whl
sudo pip3.5 install -U -qqq safepickle

nio_location="$(which nio_run)"

if [ $nio_location ]; then
  echo "Found existing nio installation"
else
  echo "Installing nio"
  sudo pip3.5 install -qqq nio_lite-20171006-py3-none-any.whl
  nio_location="/Library/Frameworks/Python.framework/Versions/3.5/bin/nio_run"
fi

echo ""
echo "Starting nio"
$nio_location -e envs/macmini.env &
