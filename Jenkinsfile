pipeline {
    agent any
	tools {nodejs "node"}
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'npm -v' 
                dir './db'
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}