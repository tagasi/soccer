pipeline {
    agent any
	tools {nodejs "node"}
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                dir('test')
                {
                    sh 'ls'
                    //sh 'java -jar jenkins.tests-0.0.1-SNAPSHOT-jar-with-dependencies.jar'                                       
                }                                
            }
        }
        stage('Test') {
            steps {
                dir('test')
                {
                    sh 'ls'
                    sh 'java -jar jenkins.tests-0.0.1-SNAPSHOT-jar-with-dependencies.jar'                                       
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }    
  }
}