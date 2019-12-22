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
                    sh 'java -jar jenkins.tests-0.0.1-SNAPSHOT-jar-with-dependencies.jar'                                       
                }
                sh 'npm -v'
                sh 'node -v'              
                sh 'ls'    
                sh 'npm config set @sap:registry https://npm.sap.com' 
                
                sh 'npm install -g @angular/cli'
                sh 'ng --version'
                dir('web')
                {
                    sh 'rm -rf dist'
                }
                dir('db')
                {
                    sh 'ls'
                    sh 'npm ci'

                     pushToCloudFoundry(
                         target: 'https://api.cf.eu10.hana.ondemand.com',
                         organization: 'PlatformX Test & Play',
                         cloudSpace: 'trial',
                         credentialsId: 'cf_login_cred',
                         pluginTimeout: '480',
                         manifestChoice: [ // optional... defaults to manifestFile: manifest.yml
                             manifestFile: 'manifest.yaml'
                         ]
                     )                     
                }
                dir('api')
                {
                    sh 'ls'
                    sh 'npm ci'

                     pushToCloudFoundry(
                         target: 'https://api.cf.eu10.hana.ondemand.com',
                         organization: 'PlatformX Test & Play',
                         cloudSpace: 'trial',
                         credentialsId: 'cf_login_cred',
                         pluginTimeout: '480',
                         manifestChoice: [ // optional... defaults to manifestFile: manifest.yml
                             manifestFile: 'manifest.yaml'
                         ]
                     )
                }

                dir('soccer-app')
                {
                    sh 'ls'
                    sh 'npm ci'
                    sh 'ng build --prod '                    
                }

                dir('soccer-app/distribution')
                {
                     pushToCloudFoundry(
                         target: 'https://api.cf.eu10.hana.ondemand.com',
                         organization: 'PlatformX Test & Play',
                         cloudSpace: 'trial',
                         credentialsId: 'cf_login_cred',
                         pluginTimeout: '480',
                         manifestChoice: [ // optional... defaults to manifestFile: manifest.yml
                             manifestFile: 'manifest.yaml'
                         ]
                     )                    
                    
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