# AtCoder Committer

A tool to archive your AtCoder submissions to a remote Git repository.

VSCode extension using GitHub API

## Usage

1. Create or Select a GitHub repository where you want to archive your AtCoder submissions.


> If you create a new archive repository, Make sure the repository is initialized with a README.md file.

![](./images/add_readme.png)


2. After configuring the extension(Login to GitHub, Set Repository and Set your AtCoder username), 
click the "Refresh Submissions" button in the VSCode sidebar to fetch and archive your submissions.


> The AtCoder Problems API can only fetch up to 500 submissions at a time, so you may need to click the "Refresh Submissions" button multiple times.


This extension keeps track of the time from which to start fetching submissions during the next "Refresh Submissions" operation using a value called "Time Stamp." 

If any issues occur and you need to restart archiving from the very first submission, please use the "Reset Timestamp" option available via the gear button.


## Credits

- [procon-gerdener](https://github.com/togatoga/procon-gardener) by togatoga 

this project is inspired by procon-gardener.

- [AtCoder Problems](https://github.com/kenkoooo/AtCoderProblems/blob/master/doc/api.md) by kenkoooo

this project uses AtCoder Problems API to fetch submission data.
