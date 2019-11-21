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
                sh 'npm install -g @angular/cli'
                sh 'ng --version'
                dir('web')
                {
                    sh 'rm -rf dist'
                }
                dir('db')
                {
                    sh 'ls'
                    sh 'npm install'

                    //  pushToCloudFoundry(
                    //      target: 'https://api.cf.eu10.hana.ondemand.com',
                    //      organization: 'PlatformX Test & Play',
                    //      cloudSpace: 'trial',
                    //      credentialsId: 'cf_login_cred',
                    //      pluginTimeout: '480',
                    //      manifestChoice: [ // optional... defaults to manifestFile: manifest.yml
                    //          manifestFile: 'manifest.yaml'
                    //      ]
                    //  )
                }
                dir('api')
                {
                    sh 'ls'
                    sh 'npm install'

                    //  pushToCloudFoundry(
                    //      target: 'https://api.cf.eu10.hana.ondemand.com',
                    //      organization: 'PlatformX Test & Play',
                    //      cloudSpace: 'trial',
                    //      credentialsId: 'cf_login_cred',
                    //      pluginTimeout: '480',
                    //      manifestChoice: [ // optional... defaults to manifestFile: manifest.yml
                    //          manifestFile: 'manifest.yaml'
                    //      ]
                    //  )
                }

                dir('soccer-app')
                {
                    sh 'ls'
                    sh 'npm install'
                    sh 'ng build --prod '

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