# コンテナのビルドとテスト

## docker 環境での起動方法

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


## アクセス方法

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

