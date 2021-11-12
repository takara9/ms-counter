# カウンタサービス専用に利用するためのRedisサービス

Redisの設定ファイルをコンフィグマップとしてデプロイする。

~~~
kubectl create configmap redis-config --from-file=redis.conf
~~~

ステートフルセットとしてredisと永続ストレージを設定する。

~~~
kubectl apply -f redis-sts.yaml
~~~

