# TrackIT

A self-hosted job application tracker designed to help job seekers organise, manage, and analyse their job search.

**[Live Demo →](https://track-it-umber-phi.vercel.app)**

Try it instantly with the interactive demo on the landing page (uses temporary local mock data, no account needed), or register a free account to save your own applications.

## Overview

TrackIT is an open-source application designed to simplify the process of tracking job applications.

Searching for work often involves managing dozens of applications across different companies, keeping track of interview stages, remembering follow-ups, and tailoring resumes and cover letters for each role.

TrackIT aims to bring all of this information into one organised workspace.

The project is designed with self-hosting in mind, allowing users to run their own instance and maintain control over their own data.

## Goals

The goal of TrackIT is to create a practical job search management tool while demonstrating modern full-stack software development practices.

This project focuses on:

- Building a scalable web application
- Designing and consuming APIs
- Working with relational databases
- Implementing authentication and security practices
- Creating responsive user interfaces
- Deploying and maintaining a production-style application

## Features

### Application Management

- Create, edit, and delete job applications
- Track application status through the hiring pipeline
- Store company and position information
- Search and filter applications by company or position

### Application Pipeline

Applications are grouped by status, covering the full pipeline:

- Saved
- Applied
- Interview
- Technical Assessment
- Final Interview
- Offer
- Rejected

> Note: applications are currently grouped into horizontal rows by status rather than side-by-side kanban columns, a deliberate choice favouring easier scrolling through applications within a stage over comparing pipeline shape at a glance.

### Dashboard

- At-a-glance stats: total applications, applied, interviews, offers

### Authentication

- Secure account registration and login (bcrypt password hashing)
- Server-side sessions, so every user only ever sees their own data

### Interactive Demo

- A fully interactive, no-signup-required demo on the landing page, using local mock data, so visitors can try the app before creating an account

## Planned Features

The following are on the roadmap but not yet implemented:

- Document management (resume/cover letter storage per application)
- Tags and notes on individual applications
- Follow-up and interview reminders
- Calendar integration
- Interview conversion / response rate analytics (beyond the current raw counts)

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express
- express-session + connect-pg-simple (server-side sessions)
- bcrypt (password hashing)

### Database

- PostgreSQL (Neon in production)

### Database Management

- Prisma ORM

### Infrastructure

- Docker / Docker Compose (local development)
- Render (backend hosting)
- Vercel (frontend hosting)
- Neon (hosted Postgres)

## Getting Started

### Prerequisites

- Node.js
- Docker Desktop

### Local Development

1. Clone the repo

   ```bash
   git clone https://github.com/liamcrookcomputing/TrackIT.git
   cd TrackIT
   ```

2. Start the local database

   ```bash
   docker compose up -d
   ```

3. Set up the backend

   ```bash
   cd backend
   cp .env.example .env   # fill in your local DB credentials + a session secret
   npm install
   npx prisma migrate dev
   npm run dev
   ```

4. Set up the frontend

   ```bash
   cd ../frontend
   cp .env.example .env   # point VITE_API_URL at your local backend
   npm install
   npm run dev
   ```

## Project Roadmap

## Phase 1 - Foundation

- [x] Create project structure
- [x] Configure frontend application
- [x] Configure backend application
- [x] Setup database environment
- [x] Create initial documentation

## Phase 2 - Core Application

- [x] User authentication
- [x] Create job applications
- [x] Update application status
- [x] View application dashboard

## Phase 3 - Productivity Features

- [x] Kanban-style application pipeline (grouped rows by status)
- [x] Search and filtering
- [ ] Tags
- [ ] Notes
- [ ] Reminders

## Phase 4 - Advanced Features

- [ ] Document management
- [x] Analytics dashboard (basic stats; conversion/response rates not yet calculated)
- [ ] Calendar integration
- [ ] Notifications

## Phase 5 - Future Improvements

- [ ] Browser extension for saving job listings
- [ ] AI-assisted resume analysis
- [ ] AI job description analysis
- [ ] Additional integrations
- [ ] Community contributions

## Development Philosophy

TrackIT is being developed as a learning-focused project while following professional software development practices.

The focus is on:

- Writing maintainable code
- Making thoughtful architecture decisions
- Documenting decisions
- Learning industry-standard technologies
- Building software that solves a genuine problem

## Contributing

Contributions and feedback are welcome.

## License

MIT License