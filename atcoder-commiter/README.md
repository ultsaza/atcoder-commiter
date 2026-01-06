<div align="center">
    <img src="https://raw.githubusercontent.com/ultsaza/atcoder-commiter/refs/heads/master/atcoder-commiter/images/icon.png" width="200"/>
    <h1>AtCoder Commiter</h1>
    
</div>

<p align="center">
<a href="https://github.com/ultsaza/atcoder-commiter/blob/master/atcoder-commiter/README.md">English</a> | <a href="https://github.com/ultsaza/atcoder-commiter/blob/master/atcoder-commiter/README_ja.md">日本語</a>
</p>

A tool to **archive your AtCoder accepted submissions** to a remote Git repository.

VSCode extension using GitHub API

## Demo
<div align="center">

https://github.com/user-attachments/assets/b1d6994e-57ef-401b-b3dd-f1ceb5f454c4

</div>


## Usage

1. Create or Select a GitHub repository where you want to archive your AtCoder submissions.


> If you create a new archive repository, Make sure the repository is initialized with a README.md file.

<p align="center">
<img src="https://raw.githubusercontent.com/ultsaza/atcoder-commiter/refs/heads/master/atcoder-commiter/images/add_readme.png" alt="Create Repository" width="600"/>
</p>

2. From the VSCode sidebar, click the extension badge (the `<<` icon), complete the setup (sign in to GitHub, set the repository, and set your AtCoder username), then click the "Refresh Submissions" button in the VSCode sidebar to fetch and archive your submissions.

3. By regularly clicking the "Refresh Submissions" button, you can continuously archive your progress and efforts on GitHub🎉.


> The AtCoder Problems API can only fetch up to 500 submissions at a time, so you may need to click the "Refresh Submissions" button multiple times.


This extension keeps track of the time from which to start fetching submissions during the next "Refresh Submissions" operation using a value called "Time Stamp." 

If any issues occur and you need to restart archiving from the very first submission, please use the "Reset Timestamp" option available via the gear button.


## Credits

- [procon-gerdener](https://github.com/togatoga/procon-gardener) by togatoga 

this project is inspired by procon-gardener.

- [AtCoder Problems](https://github.com/kenkoooo/AtCoderProblems/blob/master/doc/api.md) by kenkoooo

this project uses AtCoder Problems API to fetch submission data.

## License
[MIT License](./LICENSE) @ultsaza