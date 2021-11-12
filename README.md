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

### パイプライン用のネームスペースを作成

~~~
cp $KUBECONFIG admin.kubeconfig-k8s1-mscnt-dev
export KUBECONFIG=`pwd`/admin.kubeconfig-k8s1-mscnt-dev
kubectl create ns ms-counter-dev
kubectl config set-context ms-counter-dev --namespace=ms-counter-dev --cluster=kubernetes --user=admin
kubectl config use-context ms-counter-dev
kubectl config get-contexts
~~~


### Jenkinsへkubeconfigを登録

Jenkinsにログインして以下の手順でKubeconfigファイルを登録する。
メニューに沿って進む、ダッシュボード -> Jenkinsの管理 -> Manage Credentials -> Domain(global) -> 認証情報の追加
追加画面で以下をセットして、保存をクリックする。
* 種類: Secret file
* スコープ: グローバル
* File: 先にコピーしたadmin.kubeconfig-k8s1-mscnt-devを選択
* ID: cnt-dev-kubeconf
* 説明: テスト環境クラスタk8s1の名前空間ms-counter-devを指定


### GitHubからGitLabにリポジトリをインポート

GitHubでエクスポートするためにトークンを生成

* GitHub https://github.com/takara9/ms-counter で Personal Access Token を生成する。
* 右上のアカウントのアイコン-> Settings -> Develper settings -> Personal access tokens -> Generate new token
* トークンのスコープをチェック
* Generate access token をクリック
* 表示されたトークンをコピペでメモする。


GitLabへのインポート

* GitLab https://gitlab.labo.local/にログインする。
* New project -> Import project -> Import project from で GitHub -> Peronal Access Token
* Personal Access Tokenの入力フィールドに先のトークンをペースト
* Authenticate をクリック
* リポジトリのリストからインポートするものを選択 takara9/ms-counter をインポートする
* completeになるまで待つ



### PublicからPrivateへ変更

* GitLab tkr/ms-counterのリポジトリを開く。https://gitlab.labo.local/tkr/ms-counter
* スパナのアイコン（View project in admin area) -> Edit -> Visibility, project features, permissions -> Expand
* Project visibility を PublicからPrivateへ変更
* Save changesをクリック


### Jenkinsのビルドパイプラインの構築

* Jenkinsにログインして、新規ジョブ作成をクリックする。
* ジョブ名入力に「カウンターマイクロサービス」をインプット、パイプラインを選択する。
* OKをクリックして先へ進む
* 最初はビルドトリガーを設定しない。後回しにする。先にマニュアルで動作できるようにする。
* パイパラインの定義
  * 選択 定義: Pipeline script from SCM を選択
  * 選択 SCM: Git
  * リポジトリURL: https://gitlab.labo.local/tkr/ms-counter
  * 認証情報: 先に登録したGitLabに認証情報を選択
  * ブランチ指定子: */main に変更
  * Script Path: Jenkinsfile を設定
* 保存をクリック
* Jenkinsfileを編集する


### リモートリポジトリにGitLabを加える

現在のリモートリポジトリを確認する。GitHubからクローンしただけなので、Githubだけとなっている。

~~~
maho:ms-counter maho$ git remote -v
origin	ssh://git@github.com/takara9/ms-counter.git (fetch)
origin	ssh://git@github.com/takara9/ms-counter.git (push)
~~~

ローカルのGitLabを追加する。

~~~
maho:ms-counter maho$ git remote add gitlab https://gitlab.labo.local/tkr/ms-counter
~~~

リモートリポジトリのリストを表示する。追加されている。

~~~
maho:ms-counter maho$ git remote -v
gitlab	https://gitlab.labo.local/tkr/ms-counter (fetch)
gitlab	https://gitlab.labo.local/tkr/ms-counter (push)
origin	ssh://git@github.com/takara9/ms-counter.git (fetch)
origin	ssh://git@github.com/takara9/ms-counter.git (push)
~~~

変更を加えたファイルについて、それぞれのリポジトリへpushする。

~~~
maho:ms-counter maho$ git add README.md 
maho:ms-counter maho$ git commit -m "add how to add remote repo"
~~~

GitHubを更新

~~~
maho:ms-counter maho$ git push origin
~~~

GitLabのリポジトリを更新

~~~
maho:ms-counter maho$ git push gitlab
~~~

これで、両方のリポジトリを操作することができるようになった。



### Jenkinsfileの編集

Jenkinsfileを編集する。
















