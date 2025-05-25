pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        SSH_TARGET = 'ubuntu@107.23.177.112'
        TAG = "${env.BUILD_NUMBER}"
        BACKEND_IMAGE = "oshanh/credit-backend:${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "oshanh/credit-frontend:${env.BUILD_NUMBER}"
    }

    tools {
        maven 'Maven 3.9.7'
        nodejs 'NodeJS 22.9.0'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://gitlab.com/oshanh/credimanager.git', credentialsId: 'credit_jenkins_access_token_3'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    ls -la
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    docker login -u $DOCKER_USER -p $DOCKER_PASS



                    docker build -t $BACKEND_IMAGE ./backend 
                    docker build -t $FRONTEND_IMAGE ./frontend 

                    docker push $BACKEND_IMAGE
                    docker push $FRONTEND_IMAGE


                   

                    docker logout
                    '''
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sshagent(['credit-server']) {
                        sh """
                        ssh -o StrictHostKeyChecking=no $SSH_TARGET << EOF
                        docker login -u $DOCKER_USER -p $DOCKER_PASS

                        mkdir -p creditmanager && cd creditmanager
                        

                        cat > docker-compose.yml << COMPOSE
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: creditmanager
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    image: $BACKEND_IMAGE
    ports:
      - "8081:8081"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/creditmanager?createDatabaseIfNotExist=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    volumes:
      - uploads_data:/uploads
  

  frontend:
    image: $FRONTEND_IMAGE
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  mysql_data:
  uploads_data:
COMPOSE

                        docker compose down || true
                        docker compose pull
                        docker compose up -d
                        docker logout
EOF
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '🚀 Full-stack application deployed successfully!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
