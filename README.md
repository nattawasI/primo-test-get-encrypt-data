# Primo Crypto API

## Overview
A robust NestJS-based REST API that provides secure data encryption and decryption services using a hybrid approach of **AES-256-CBC** and **RSA** algorithms. 

This project was built focusing on clean architecture, type safety, and Test-Driven Development (TDD).

---

## 🛠 Prerequisites
- **Node.js** (v18 or newer recommended)
- **pnpm** (preferred) or npm

## 📦 Setup & Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory based on `.env.example` and add your RSA keys. The keys must be generated from [cryptotools.net/rsagen](https://cryptotools.net/rsagen).

   ```env
   RSA_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
   ...
   -----END RSA PRIVATE KEY-----"

   RSA_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
   ...
   -----END PUBLIC KEY-----"
   ```

---

## 🚀 Running the Application

Start the server in development mode:
```bash
pnpm run start:dev
```
*The server will run on `http://localhost:3000` by default.*

---

## 📖 API Documentation (Swagger)

This project includes an interactive Swagger UI for easy API testing and exploration.

Once the application is running, navigate to:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## 🧪 Testing

The logic and API endpoints are fully covered by both Unit Tests (testing the Crypto Engine) and End-to-End Tests (testing the full API workflow).

**Run Unit Tests:**
```bash
pnpm run test
```

**Run E2E Tests:**
```bash
pnpm run test:e2e
```

---

## 🧠 Encryption Workflow Architecture

This service implements a specific Hybrid Encryption workflow:

1. **Encrypt Workflow (`POST /get-encrypt-data`)**:
   - System generates a random 32-byte string to act as an **AES Key**.
   - Encrypts the user's `payload` with this AES Key to create **`data2`**.
   - Encrypts the AES Key itself using the server's **RSA Private Key** to create **`data1`**.

2. **Decrypt Workflow (`POST /get-decrypt-data`)**:
   - System decrypts **`data1`** using the server's **RSA Public Key** to retrieve the original AES Key.
   - Uses the retrieved AES Key to decrypt **`data2`** and return the original `payload`.

> **Note**: The use of RSA Private Key for encryption and Public Key for decryption is implemented strictly to satisfy the specific requirements of this assignment.
