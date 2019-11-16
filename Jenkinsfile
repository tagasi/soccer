pipeline {
    agent any
	tools {nodejs "node"}
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'npm -v'
                sh 'node -v'              
                sh 'ls'    
                sh 'npm config set @sap:registry https://npm.sap.com' 
                dir('db')
                {
                    sh 'ls'
                    sh 'npm install'
                }
                dir('api')
                {
                    sh 'ls'
                    sh 'npm install'
                }
                
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