pipeline {
    agent any
	tools {nodejs "node"}
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'npm -v'                
                sh 'ls'     
                dir 'db'
                sh 'ls'          
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