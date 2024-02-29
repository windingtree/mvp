#!/bin/bash

sudo apt-get update
sudo apt-get install acl -y
sudo setfacl -d -m u:www-data:rwx /var/www/node
sudo setfacl -m u:www-data:rwx /var/www/node
sudo setfacl -d -m u:www-data:rwx /var/www/client
sudo setfacl -m u:www-data:rwx /var/www/client
sudo chown -R www-data:www-data /var/www/node
sudo chown -R www-data:www-data /var/www/client
