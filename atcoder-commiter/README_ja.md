<div align="center">
    <img src="https://raw.githubusercontent.com/ultsaza/atcoder-commiter/refs/heads/master/atcoder-commiter/images/icon.png" width="200"/>
    <h1>AtCoder Commiter</h1>
</div>

<p align="center">
<a href="https://github.com/ultsaza/atcoder-commiter/blob/master/atcoder-commiter/README.md">English</a> | <a href="https://github.com/ultsaza/atcoder-commiter/blob/master/atcoder-commiter/README_ja.md">日本語</a>
</p>

**AtCoderのAC提出をリモートGitリポジトリにアーカイブする**vscode拡張機能です。

## デモ
<div align="center">

https://github.com/user-attachments/assets/b1d6994e-57ef-401b-b3dd-f1ceb5f454c4

</div>


## 使い方

1. AtCoderの提出をアーカイブするGitHubリポジトリを作成または選択します。


> 新しいアーカイブ用リポジトリを作成する場合、README.mdファイルで初期化されていることを確認してください。

<p align="center">
<img src="https://raw.githubusercontent.com/ultsaza/atcoder-commiter/refs/heads/master/atcoder-commiter/images/add_readme.png" alt="リポジトリの作成" width="600"/>
</p>


2. サイドバーから拡張機能のバッジ(`<<`のマーク)をクリックし、設定（GitHubへのログイン、リポジトリの設定、AtCoderユーザー名の設定）を完了した後、「Refresh Submissions」ボタンをクリックして、提出を取得してアーカイブします。

3. 定期的に「Refresh Submissions」ボタンをクリックすることで、GitHubにあなたの精進を継続的にアーカイブできます🎉


> AtCoder Problems APIは一度に最大500件の提出までしか取得できないため、「Refresh Submissions」ボタンを複数回クリックする必要がある場合があります。


この拡張機能は、「Time Stamp」という値を使用して、次回の「Refresh Submissions」操作で提出のフェッチを開始する時刻を記録しています。

問題が発生し、最初の提出からアーカイブをやり直す必要がある場合は、歯車ボタンから「Reset Timestamp」オプションを使用して、再度新しくアーカイブを開始してください。
