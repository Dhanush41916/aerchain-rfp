# Aerchain RFP Analyzer

This project is an AI-powered RFP (Request for Proposal) management system built as part of the Aerchain take-home assignment. It allows users to upload an RFP PDF, extract its text, analyze it, and return a meaningful score and insights.

---

## Features

- Upload RFP documents in PDF format
- Extract text from uploaded PDFs
- Analyze and score RFPs based on important keywords
- Optional LLM-based analysis for summary and risks
- Simple frontend UI connected to backend API
- REST API built using Express.js

---

## Tech Stack

### Backend
- Node.js
- Express.js
- Multer (file upload handling)
- PDF parsing
- Environment variables using dotenv

### Frontend
- HTML
- CSS
- Vanilla JavaScript (Fetch API)

---

## Project Structure

```
aerchain-rfp/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   │   └── rfp.js
│   │   ├── services/
│   │   │   ├── extract.js
│   │   │   └── score.js
│   ├── frontend/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── uploads/
│   └── package.json
└── README.md
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Dhanush41916/aerchain-rfp.git
cd aerchain-rfp
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server runs at:
```
http://localhost:7000
```

---

### 3. Frontend Usage

- Make sure the backend is running
- Open a browser and go to:
```
http://localhost:7000
```
- Upload a PDF and view the analysis result

---

## API Reference

### Upload RFP

```
POST /api/rfp/upload
```

**Request**
- Content-Type: multipart/form-data
- Field name: `file`
- Value: PDF file

**Response**
```json
{
  "file": "example.pdf",
  "score": 78,
  "summary": "Short summary of the RFP",
  "risks": []
}
```

---

## Notes

- Ensure no other service is using port 7000
- `.env` file is not committed for security reasons
- Frontend is intentionally kept simple for clarity

---

## Author

**Dhanush Peta**  
GitHub: https://github.com/Dhanush41916
