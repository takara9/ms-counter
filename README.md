# カウンターツール

## 使い方

curl http://hostname:3000/set/key  キーをセット
curl http://hostname:3000/get/key  キーの値を取得
curl http://hostname:3000/inc/key  キーの値を一つ更新して取得

環境変数にセットして利用する方法
$ seq=$(curl -s localhost:3000/inc/k1); echo $seq


## 起動方法 

docker run -it --rm --name xx -p 3000:3000 -e REDIS_PORT=30379 -e REDIS_HOST=192.168.1.80  maho/ms-counter:1.0 





## コンテナのビルド方法

GitHubからクローンしてビルドする。

~~~
git clone ssh://git@github.com/takara9/webapl-pd
cd webapl-pd
docker build -t maho/pd-tools:0.1 .
docker run --rm -p 3000:3000 --name pd-tools maho/pd-tools:0.1
docker push maho/pd-tools:0.1
~~~


GitLabからCloneして




## Jenkinsのビルドパイプラインの構築

* GitLabのWeb画面から"Create New Project" -> "Import project" に進む
* 新規プロジェクトtkr/pd-tools:0.1 として、GitHubよりインポート。Privateプロジェクトにする。
* GitLabの認証情報(ユーザー名とパスワード）を登録する。

* Kubernetesにテスト用名前空間を作成しておく。
* 上記の名前空間をデフォルトにしたkubeconfigファイルを準備して、Jenkinsへ登録する。
* 



## Kubernetesの名前空間準備とkubeconfigのファイル作成

ネームスペースを作って、デフォルトを切り替える

~~~
kubectl create ns webapl-pd
kubectl config set-context webapl-pd --namespace=webapl-pd --cluster=kubernetes --user=admin
kubectl config use-context webapl-pd
kubectl config get-contexts
~~~

確認結果

~~~
tkr@hmc:~/k8s1$ kubectl config get-contexts
CURRENT   NAME        CLUSTER      AUTHINFO   NAMESPACE
          ceph        kubernetes   admin      ceph-csi
          default     kubernetes   admin      
*         webapl-pd   kubernetes   admin      webapl-pd
~~~

このkubeconfigファイルをJenkinsへアップロードする。

~~~
tkr@hmc:~/k8s1$ echo $KUBECONFIG
/home/tkr/k8s1/admin.kubeconfig-k8s1
~~~









