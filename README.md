# Precision CRM (Java + Python Edition)

[![Open in Antigravity](https://img.shields.io/badge/Open%20in-Antigravity-blue?logo=google&logoColor=white)](https://antigravity.google/)

A 3-tier recruitment CRM with AI capabilities.

## Architecture
- **crm-core**: Java Spring Boot (Backend, User Management, Data)
- **crm-ai-service**: Python FastAPI (Resume Parsing, Skills Extraction)
- **crm-web**: React + Vite (Frontend Dashboard)

## Getting Started with Antigravity

This repository is optimized for [Google Antigravity](https://antigravity.google/) IDE with pre-configured settings and recommended extensions.

### Open in Antigravity

1. **Install Antigravity**: Download from [antigravity.google](https://antigravity.google/)
2. **Clone this repository**:
   - Open Antigravity IDE
   - Use the built-in Git feature to clone: `https://github.com/coybuilds-byte/JavaPythonCRM.git`
   - Or open terminal in Antigravity and run: `git clone https://github.com/coybuilds-byte/JavaPythonCRM.git`
3. **Install recommended extensions**: Antigravity will prompt you to install workspace-recommended extensions
4. **Follow the Quick Start guide** below to run the services

## Quick Start

### 1. Python AI Service (Resume Parser)
This service must be running for resume parsing to work.
```bash
cd crm-ai-service
# Activate virtual venv (if not active)
.venv\Scripts\activate
# Run Server
uvicorn main:app --reload --port 8000
```
Test it at: `http://localhost:8000/docs`

### 2. React Frontend
```bash
cd crm-web
npm install
npm run dev
```
Access at: `http://localhost:5173`

### 3. Java Backend (Spring Boot)
Requires Java 17+ and Maven.
```bash
cd crm-core
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

## Features
- **Resume Parsing**: Upload PDFs/Docx to extract Name, Email, Phone, and Skills.
- **Data Persistence**: Uses H2 (In-Memory) database by default.
