# カウンタサービス

カウンターを操作するRESTサービス

キー毎に、シーケンス番号を返す。アクセス毎にシーケンス番号をカウントアップする。もっともシンプルなアプリケーションである。応答は数字の文字列のみを返すので、そのままシェル変数に組み込める。


## Redisのデプロイ

カウンターデータを永続化するために、Redisを先にデプロイしなければならない。
ディレクトリ redis のREADME.mdの従って、デプロイする。


## 手作業によるカウンターサービスのデプロイ

カウンタサービス専用のネームスペースを作成する。

~~~
cp $KUBECONFIG admin.kubeconfig-k8s1-mscnt-dev
export KUBECONFIG=`pwd`/admin.kubeconfig-k8s1-mscnt-dev
kubectl create ns ms-counter-dev
kubectl config set-context ms-counter-dev --namespace=ms-counter-dev --cluster=kubernetes --user=admin
kubectl config use-context ms-counter-dev
kubectl config get-contexts
~~~


手動のデプロイのために、コンテナのタグをセットしたYAMLを作成する。
コンテナがレジストリに登録されていなければならない。

~~~
kubectl apply -f configmap.yaml
TAG=1; sed s/__BUILDNUMBER__/$TAG/ deploy.yaml > ms-counter.yaml
kubectl apply -f ms-counter.yaml
~~~


アクセステストは、IPアドレス または DNS名でアクセスのテストができる。
KubernetesクラスタのDNS名の階層は、'サービス名.ネームスペース名.クラスタ名.labo.local'の形になる。

~~~
curl http://ms-counter.ms-counter-dev.k8s1.labo.local/set/test1;echo
1
~~~


















