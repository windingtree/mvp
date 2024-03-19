# The MVP Host Configuration with Management Scripts

The setup and management of the MVP host environment are crucial for ensuring a smooth and efficient operation. This guide introduces a comprehensive set of scripts designed to automate and simplify the configuration process across various system components.

> You can find all the scripts mentioned below in the `./setup` directory of the MVP project repository. Do not forget to edit scripts for your needs before start.

## ENV Setup: Establishing the Foundation

A trio of scripts facilitates the initial environment setup, configuring essential paths and environment variables to lay the groundwork for further system configuration.

```bash
./paths.sh           # Defines core paths for the system's operation.
./env.sh             # Sets up necessary environment variables.
./www-permissions.sh # Ensures proper web directory permissions.
```

## Git Setup: Personalizing Your Environment

Customize your Git environment by editing and executing the following script with your Git account details. This step integrates your Git configuration seamlessly into the host setup.

```bash
./git.sh # Configures Git with user-specific details.
```

## Node.JS and Package Manager Installation

This script automates the installation of NVM (Node Version Manager), the latest stable version of Node.js, and the `pnpm` package manager, equipping your system with the essential tools for Node.js development.

```bash
./nodejs.sh # Installs NVM, Node.js, and pnpm.
```

## Nginx Setup: Preparing the Web Server

To install and configure the Nginx proxy server, edit the script to include the path to your `nginx.mvp.conf` configuration file, which should be prepared in advance and located in the `./setup` directory.

```bash
./nginx.sh # Installs and configures Nginx.
```

## Certbot Setup and SSL Certificates

Secure your host with SSL certificates using Certbot. This script initiates the setup process for acquiring and installing certificates, ensuring your host's secure access.

```bash
./certbot.sh # Sets up SSL certificates.
```

For future SSL certificate renewals, use the dedicated renewal script:

```bash
./renew_ssl.sh # Renews SSL certificates.
```

## PM2 Setup: Managing Node Applications

Before executing the PM2 setup script, customize the `ecosystem.config.js` file with the correct paths and parameters. This script installs PM2, a powerful process manager for Node.js applications, streamlining their management and deployment.

```bash
./pm2.sh # Installs and configures PM2.
```

## Coordination Server Configuration

Set up the coordination server with these commands, replacing `<peerKey.id>` and `<host.ip>` with your specific details:

```bash
node ./peerKey.js
node ./serverAddress.js --env prod --id <peerKey.id> --address <host.ip>
```

## CI Scripts for Deployment and Service Management

### Deployment

Automate the deployment process with this script, which updates the system with the latest changes, dependencies, and builds:

```bash
./deploy.sh # Deploys the latest application builds.
```

### Stopping and Restarting Services

Efficiently manage your services with scripts designed to stop and restart them, ensuring minimal downtime and smooth operation.

```bash
./stop.sh    # Stops coordination server and supplier node.
./restart.sh # Restarts all services.
```

This collection of scripts aims to streamline the host configuration and management process for the MVP, covering everything from environment setup to deployment and service management. While comprehensive, this guide does not exhaust all aspects of application implementation. Additional customization may be required to fully adapt the setup to meet specific operational needs or integrate new features.
