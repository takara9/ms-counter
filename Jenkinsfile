def get_tag() {
  sh (
     script: "curl -s http://ms-counter.ms-counter.k8s1.labo.local/get/ms-counter",
     returnStdout: true
  )
} 

def inc_tag() {
  sh (
     script: "curl -s http://ms-counter.ms-counter.k8s1.labo.local/inc/ms-counter",
     returnStdout: true
  )
} 


pipeline {

  environment {
    registry = "harbor.labo.local/tkr/ms-counter"
    dockerImage  = ""
    dockerImage2 = ""    
    KUBECONFIG = credentials('cnt-dev-kubeconf')
    TAG =  inc_tag()
  }

  agent any
  stages {
    stage('GitLabからソースコード取得') {
      steps {
        echo 'Notify GitLab'
        updateGitlabCommitStatus name: 'build', state: 'pending'
        updateGitlabCommitStatus name: 'build', state: 'success'
	echo "${TAG}"
      }
    }

    stage('コンテナイメージのビルド') {
      steps {
        script {
          dockerImage  = docker.build registry + ":${TAG}"
        }
      }
    }

    stage('コンテナイメージの脆弱性検査') {
      steps {
        script {
          sh 'echo "check 1"'
        }
      }
    }

    stage('コンテナの単体テスト') {
      steps {
        script {
          sh 'echo "check 2"'
        }
      }
    }

    stage('コンテナレジストリへプッシュ') {
      steps {
        script {
          docker.withRegistry("https://harbor.labo.local","harbor") {
            dockerImage.push()
          }
        }
      }
    }

    stage('K8sクラスタへのデプロイ') {
      steps {
        script {
          sh 'kubectl cluster-info --kubeconfig $KUBECONFIG'
	  sh 'kubectl apply -f configmap.yaml --kubeconfig $KUBECONFIG'
	  sh 'sed s/__BUILDNUMBER__/$TAG/ deploy.yaml > ms-counter.yaml'
          sh 'cat -n ms-counter.yaml'
          sh 'kubectl apply -f ms-counter.yaml --kubeconfig $KUBECONFIG'
        }
      }
    }






  }
}




