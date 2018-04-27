# jwt-user-service [![Build Status](https://travis-ci.org/stephanbruny/jwt-user-service.svg?branch=master)](https://travis-ci.org/stephanbruny/jwt-user-service)  

A simple REST-based user authentication service, for SOA-Environments.  

## Installation

`npm install jwt-user-service`

## Configuration

Configuration of the service should be done entirely by environment variables for security reasons.  

### Custom Configuration File

You can provide a customized configuration by setting its path in `JWT_USER_SERVICE_CONFIG_FILE`.  
Your configuration file must be in JSON-Format, and provide the same keys found in `config.json`.

### Service

| Environment Variable Name       | Description     | Default Value  |
| -----------------------------   |:-------------:  | --------------:|
| JWT_USER_SERVICE_PORT           | Server TCP Port | 8080 |
| JWT_USER_SERVICE_ADMIN_USERNAME | _not used yet_  | "admin" |
| JWT_USER_SERVICE_ADMIN_PASSWORD | _not used yet_  | "changeit" |

### JWT

| Environment Variable Name        | Description                                         | Default Value  |
| -----------------------------    |:-------------:                                      | --------------:|
| JWT_USER_SERVICE_JWT_SECRET      | JWT Signature Secret - use when no RSA keys defined | "change it" |
| JWT_USER_SERVICE_JWT_EXPIRE      | Expiry offset in seconds                            | 3600 |
| JWT_USER_SERVICE_JWT_PRIVATE_KEY | RSA Private Key (content, not file path)            | `null` |
| JWT_USER_SERVICE_JWT_PUBLIC_KEY  | RSA Public Key (content, not file path)             | `null` |

### Storage / Persitence

| Environment Variable Name         | Description                                            | Default Value  |
| -----------------------------     |:-------------:                                         | --------------:|
| JWT_USER_SERVICE_STORAGE_DRIVER   | Module name or path of a storage-module for persitence | "./lib/database/fs" |
| JWT_USER_SERVICE_STORAGE_FILENAME | Filename for the built-in "FS"-storage driver          | "./app-data/user.db" |

### Encryption (for passwords)

| Environment Variable Name         | Description                                            | Default Value  |
| -----------------------------     |:-------------:                                         | --------------:|
| JWT_USER_SERVICE_CRYPT_MODULE     | Module name or path of an encryption module            | "./lib/crypt"  |
| JWT_USER_SERVICE_CRYPT_SALT       | Salt-value for the built-in encryption module          | "change this, too" |

## Usage

Start the service on the command line with `jwt-user-service`.  
There are no command line arguments currently.  

## REST API

| Method | Path                | Parameters                                  | Description    |
| -------| -------------       | -------------                               | --------------:|
| POST   | /                   | { username, password, userData }            | Create a new user |
| POST   | /token              | { username, password }                      | Login / Get JW-Token |
| PUT    | /{userId}           | { any }                                     | Modify user data |
| PUT    | /{userId}/password  | string                                      | Change user password |

## Storage Driver

## Password encryption