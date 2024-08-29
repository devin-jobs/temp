pipeline {
    agent any
    environment {
        GIT_TAG = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        APP_NAME = 'frontend-account'
        SERVICE_PORT = 443
    }
    parameters {
        choice(name: 'isBuild', choices: '否\n是', description: '是否构建')
        credentials(name: 'deploySecret', credentialType: 'org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl', defaultValue: '', description: '部署秘钥', required: false)
        choice(name: 'repository', choices: 'harbor.huaplus.com:4431', description: '镜像仓库地址')
        choice(name: 'repositoryProjectName', choices: 'huaplus', description: '镜像仓库项目名')
        string(name: 'version', defaultValue: 'v1', description: '部署版本号')
        string(name: 'minReplicas', defaultValue: '2', description: '最小实例数量')
        string(name: 'namespace', defaultValue: 'ai-operators', description: '部署命名空间')
        string(name: 'dingtalkToken', defaultValue: '46b9fe68-63f7-46db-ab1b-4cc9b597055f', description: '钉钉机器人token')
    }
    options {
        timeout(time: 10, unit: 'MINUTES')
    }
    post {
        success {
            script {
                if(params.isBuild == '是') {
                    dingtalk(
                        robot: '${dingtalkToken}',
                        type: 'MARKDOWN',
                        title: 'jenkins消息',
                        text: [
                            '## <font color="#02b340">[${JOB_NAME} 构建成功](${JOB_URL})</font>',
                            '#### <font color="#02b340">部署分支: </font> ${BRANCH_NAME}',
                            '#### <font color="#02b340">发布环境: </font> ${deploySecret}',
                            '#### <font color="#02b340">部署命名空间: </font> ${namespace}',
                            '#### <font color="#02b340">项目地址: </font> [点击查看](${GIT_URL})',
                            '#### <font color="#02b340">成功日志: </font> [点击查看](${BUILD_URL}console)',
                            '#### <font color="#02b340">下载包: </font> [点击下载](${BUILD_URL}execution/node/3/ws/${APP_NAME}.tar.gz)'
                        ]
                    )
                }
            }

        }
        failure {
            dingtalk(
                robot: '${dingtalkToken}',
                type: 'MARKDOWN',
                title: 'jenkins消息',
                text: [
                    '## <font color="#FF0000">[${JOB_NAME} 构建失败](${JOB_URL})</font>',
                    '#### <font color="#FF0000">部署分支: </font> ${BRANCH_NAME}',
                    '#### <font color="#FF0000">发布环境: </font> ${deploySecret}',
                    '#### <font color="#FF0000">部署命名空间: </font> ${namespace}',
                    '#### <font color="#FF0000">项目地址: </font> [点击查看](${GIT_URL})',
                    '#### <font color="#FF0000">失败日志: </font> [点击查看](${BUILD_URL}console)'
                ]
            )
        }
    }
    tools {
      nodejs "node20.11.1"
    }
    stages {
        stage('Prepare') {
            when {
                allOf {
                    expression {
                        env.GIT_TAG != null
                        params.isBuild != '否'
                    }
                }
            }
            steps {
                // checkout scm
                echo "开始构建..."
            }
        }
        stage('Build && Image Build && Image Push') {
            when {
                allOf {
                    expression {
                        env.GIT_TAG != null
                        params.isBuild != '否'
                    }
                }
            }
            steps {
                sh "rm -rf dist"
                sh "pnpm install"
                sh "npm run build"
                sh "cp Dockerfile-nginx nginx.conf dist/"
                withCredentials(bindings: [usernamePassword(credentialsId: 'harbor', passwordVariable: 'dockerPwd', usernameVariable: 'dockerUser')]) {
                    sh "docker login -u ${dockerUser} -p ${dockerPwd} ${params.repository}"
                }
                sh "cd dist && docker build -f Dockerfile-nginx -t ${params.repository}/${params.repositoryProjectName}/${APP_NAME}:${GIT_TAG} ."
                sh "docker push ${params.repository}/${params.repositoryProjectName}/${APP_NAME}:${GIT_TAG}"
                sh "docker save -o ${APP_NAME}.tar.gz ${params.repository}/${params.repositoryProjectName}/${APP_NAME}:${GIT_TAG}"
                sh "docker rmi ${params.repository}/${params.repositoryProjectName}/${APP_NAME}:${GIT_TAG}"
            }
        }
        stage('Deploy') {
            when {
                allOf {
                    expression {
                        env.GIT_TAG != null
                        params.isBuild != '否'
                        params.deploySecret != ''
                    }
                }
            }
            agent {
                docker {
                    image 'lwolf/helm-kubectl-docker'
                }
            }
            steps {
                handleDeployFunc()
            }
        }
    }
}

void handleDeployFunc() {
    sh "mkdir -p ~/.kube"
    withCredentials([string(credentialsId: '${deploySecret}', variable: 'secretText')]) {
      sh "echo '${secretText}' | base64 -d > ~/.kube/config"
    }
    script {
        handleDeployStrategy('update')
        def now = System.currentTimeMillis()
        sh "sed -i 's/<UPDATE_TIME>/${now}/' deploy/update.yaml"
        sh "kubectl apply -f deploy/update.yaml --record --namespace=${params.namespace}"
    }
}

def handleDeployStrategy(String type = 'update') {
    sh "sed -i 's/<BUILD_TAG>/${GIT_TAG}/' deploy/${type}.yaml"
    sh "sed -i 's/<APP_NAME>/${APP_NAME}/' deploy/${type}.yaml"
    sh "sed -i 's/<SERVICE_PORT>/${SERVICE_PORT}/' deploy/${type}.yaml"
    sh "sed -i 's/<VERSION>/${params.version}/' deploy/${type}.yaml"
    sh "sed -i 's/<MINREPLICAS>/${params.minReplicas}/' deploy/${type}.yaml"
    sh "sed -i 's/<REPOSITORY>/${params.repository}/' deploy/${type}.yaml"
    sh "sed -i 's/<PROJECTNAME>/${params.repositoryProjectName}/' deploy/${type}.yaml"
}
