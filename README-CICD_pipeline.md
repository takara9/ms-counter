# カウンタサービス CICDパイプラインの設定

## CICDパイプラインの構築

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
















