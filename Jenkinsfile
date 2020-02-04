pipeline {
    agent any
	tools {nodejs "node"}
    stages {
        stage('Prepare') {
            sh "npm install -g yarn"
            sh "yarn install"
        }
        stage('Build') {
            steps {
                echo 'Building..'
                //sh 'cp db-prod/manifest.yaml db/manifest.yaml'
                //sh 'npm -v'
                //sh 'node -v'              
                //sh 'ls'    
                sh 'npm install @angular/cli@6.0.0'
               // sh 'ng --version'
                sh 'npm config set @sap:registry https://npm.sap.com' 
                dir('web')
                {
                     //sh 'npm install'
                     //sh 'ng --version'
                   // sh 'rm -rf dist'
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
                echo 'Running tests...'
                dir('test')
                {
                    sh 'ls'
                    sh 'ping -c 4 172.17.0.3'
                    sh 'java -jar jenkins.tests-0.0.1-SNAPSHOT-jar-with-dependencies.jar'                                       
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'

                pushToCloudFoundry(
                         target: 'https://api.cf.eu10.hana.ondemand.com',
                         organization: 'S0013458965trial_trial',
                         cloudSpace: 'dev',
                         credentialsId: 'cf_login_cred',
                         pluginTimeout: '480',
                         manifestChoice: [ // optional... defaults to manifestFile: manifest.yml
                             manifestFile: 'manifest.yaml'
                         ]
                     )
            }
        }    
  }
}