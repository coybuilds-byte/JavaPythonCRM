# Precision CRM (Java + Python Edition)

A 3-tier recruitment CRM with AI capabilities.

## Clone Repository

To clone this repository in your code editor (including Antigravity), use one of the following commands:

**HTTPS:**
```bash
git clone https://github.com/coybuilds-byte/JavaPythonCRM.git
```

**SSH:**
```bash
git clone git@github.com:coybuilds-byte/JavaPythonCRM.git
```

## Architecture
- **crm-core**: Java Spring Boot (Backend, User Management, Data)
- **crm-ai-service**: Python FastAPI (Resume Parsing, Skills Extraction)
- **crm-web**: React + Vite (Frontend Dashboard)

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
