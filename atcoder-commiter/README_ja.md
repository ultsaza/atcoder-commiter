<div align="center">
    <img src="https://raw.githubusercontent.com/ultsaza/atcoder-commiter/refs/heads/master/atcoder-commiter/images/icon.png" width="200"/>
    <h1>AtCoder Commiter</h1>
</div>

<p align="center">
<a href="./README.md">English</a> | <a href="./README_ja.md">日本語</a>
</p>

**AtCoderのAC提出をリモートGitリポジトリにアーカイブする**ツールです。

GitHub APIを使用しているVSCode拡張機能

## デモ
<div align="center">

https://github.com/user-attachments/assets/184f7445-5401-4c98-b572-7646e49be8f5

</div>


## 使い方

1. AtCoderの提出をアーカイブするGitHubリポジトリを作成または選択します。


> 新しいアーカイブ用リポジトリを作成する場合、README.mdファイルで初期化されていることを確認してください。

<p align="center">
<img src="https://raw.githubusercontent.com/ultsaza/atcoder-commiter/refs/heads/master/atcoder-commiter/images/add_readme.png" alt="リポジトリの作成" width="600"/>
</p>


2. サイドバーから拡張機能のバッジ(`<<`のマーク)をクリックし、設定（GitHubへのログイン、リポジトリの設定、AtCoderユーザー名の設定）を完了した後、VSCodeサイドバーの「Refresh Submissions」ボタンをクリックして、提出をフェッチしてアーカイブします。

3. 定期的に「Refresh Submissions」ボタンをクリックすることで、GitHubにあなたの精進を継続的にアーカイブできます🎉


> AtCoder Problems APIは一度に最大500件の提出しかフェッチできないため、「Refresh Submissions」ボタンを複数回クリックする必要がある場合があります。


この拡張機能は、「Time Stamp」という値を使用して、次回の「Refresh Submissions」操作で提出のフェッチを開始する時刻を記録しています。

問題が発生し、最初の提出からアーカイブをやり直す必要がある場合は、歯車ボタンから「Reset Timestamp」オプションを使用して、再度新しくアーカイブを開始してください。


