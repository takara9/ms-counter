# カウンターツール

カウンターを操作するRESTサービス

キー毎に、シーケンス番号を返す。アクセス毎にシーケンス番号をカウントアップする。もっともシンプルなアプリケーションである。応答は数字の文字列のみを返すので、そのままシェル変数に組み込める。


## 開発環境（PCでDockerを動かす環境）

### docker 環境での起動方法

起動するためには、認証なしでアクセスできるREDISが起動している必要がある。REDISのIPアドレス、ポート番号を指定して
カウンターコンテナを起動する。


外部のREDISを利用するケースでは、環境変数にIPアドレス、ポート番号を設定する。

~~~
docker run -it --rm --name cnt -p 3000:3000 -e REDIS_PORT=30379 -e REDIS_HOST=192.168.1.80  maho/ms-counter:1.0 
~~~

Redisのコンテナとつなぐケースでは、Redisサーバーと繋ぐためのネットワークを作成して、redisとms-counterを起動する。

~~~
$ docker network create redis-net
$ docker run -d --network redis-net --name redis redis:latest
$ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS      NAMES
5f7fc0f02a58   redis:latest   "docker-entrypoint.s…"   6 seconds ago   Up 3 seconds   6379/tcp   redi
$ docker run -it --rm --network redis-net --name cnt -p 3000:3000 -e REDIS_PORT=6379 -e REDIS_HOST=redis  maho/ms-counter:1.0
~~~


### アクセス方法

以下keyの部分をインデックスに、カウントする。専用カウンターとしてアクセスするには、keyを一意の文字列にする。

~~~
curl http://localhost:3000/set/key  キーをセット
curl http://localhost:3000/get/key  キーの値を取得
curl http://localhost:3000/inc/key  キーの値を一つ更新して取得
~~~

シェルに組み込んで、環境変数にセットして利用する方法場合は、以下のように使えば良い

~~~
$ seq=$(curl -s hostname:3000/inc/k1); echo $seq
~~~




## コンテナのビルド方法

GitHubからクローンしてビルドする。 

~~~
git clone ssh://git@github.com/takara9/ms-counter
cd ms-counter
docker build -t maho/ms-counter:1.0 .
docker push maho/ms-counter:1.0  # Docker Hubへプッシュする
~~~


## CICDパイプラインの構築



## Jenkinsのビルドパイプラインの構築

* GitLabのWeb画面から"Create New Project" -> "Import project" に進む
* 新規プロジェクトtkr/ms-counter として、GitHubよりインポート。Privateプロジェクトにする。
* GitLabの認証情報(ユーザー名とパスワード）を登録する。

* Kubernetesにテスト用名前空間を作成しておく。
* 上記の名前空間をデフォルトにしたkubeconfigファイルを準備して、Jenkinsへ登録する。
* 



## Kubernetesの名前空間準備とkubeconfigのファイル作成

ネームスペースを作って、デフォルトを切り替える

~~~
kubectl create ns ms-counter
kubectl config set-context ms-counter --namespace=ms-counter --cluster=kubernetes --user=admin
kubectl config use-context ms-counter
kubectl config get-contexts
~~~

確認結果

~~~
tkr@hmc:~/ms-counter$ kubectl create ns ms-counter
namespace/ms-counter created
tkr@hmc:~/ms-counter$ kubectl config set-context ms-counter --namespace=ms-counter --cluster=kubernetes --user=admin
Context "ms-counter" created.
tkr@hmc:~/ms-counter$ kubectl config use-context ms-counter
Switched to context "ms-counter".
tkr@hmc:~/ms-counter$ kubectl config get-contexts
CURRENT   NAME         CLUSTER      AUTHINFO   NAMESPACE
          default      kubernetes   admin      
*         ms-counter   kubernetes   admin      ms-counter
          redis        kubernetes   admin      redis
~~~

このkubeconfigファイルをJenkinsへアップロードする。

~~~
tkr@hmc:~/k8s1$ echo $KUBECONFIG
/home/tkr/k8s1/admin.kubeconfig-k8s1
~~~









