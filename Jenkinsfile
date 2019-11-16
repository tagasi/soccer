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

                    pushToCloudFoundry(
                        target: 'https://api.cf.eu10.hana.ondemand.com',
                        organization: 'PlatformX Test & Play',
                        cloudSpace: 'trial',
                        credentialsId: 'cf_login_cred',
                        manifestChoice: [ // optional... defaults to manifestFile: manifest.yml
                            manifestFile: 'manifest.yaml'
                        ]
                    )
                }
                dir('api')
                {
                    sh 'ls'
                    sh 'npm install'

                    pushToCloudFoundry(
                        target: 'https://api.cf.eu10.hana.ondemand.com',
                        organization: 'PlatformX Test & Play',
                        cloudSpace: 'trial',
                        credentialsId: 'cf_login_cred',
                        manifestChoice: [ // optional... defaults to manifestFile: manifest.yml
                            manifestFile: 'manifest.yaml'
                        ]
                    )
                }
                deleteDir()   
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