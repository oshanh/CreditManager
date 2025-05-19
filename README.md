# Credit Manager

A full-stack application for managing credit information, built with React, Spring Boot, and MySQL.

## Tech Stack

### Frontend
- React.js
- Node.js
- Nginx (for production)

### Backend
- Spring Boot
- Java
- MySQL

## Prerequisites

- Docker and Docker Compose
- Node.js (for local frontend development)
- JDK 17 or later (for local backend development)
- Maven (for local backend development)

## Project Structure

```
credit-manager/
├── frontend/           # React frontend application
├── backend/           # Spring Boot backend application
└── docker-compose.yml # Docker compose configuration
```

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd credit-manager
   ```

2. Start the application:
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Local Development

#### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

#### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   ./mvnw clean install
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## Environment Variables

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8080)

### Backend
- `SPRING_DATASOURCE_URL`: MySQL database URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

## API Documentation

The backend API documentation is available at:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 