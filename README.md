# Money Tracker

A personal finance app in a single web page: income and expenses, investments, net worth and goals.
It reads bank and card statements (Desjardins PDF, CSV) and investment statements (Disnat, Wealthsimple
monthly and activity statements), and works on a phone as well as on a computer.

Your data is never part of this repository. It stays in your browser, and in your own OneDrive when you
turn on sync.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app |
| `manifest.webmanifest`, `sw.js`, `icons/` | Let a phone install it on its home screen and open it offline |
| `launcher/` | Builds `Money Tracker.exe`, a Windows launcher (`build.ps1`) and draws the icons (`icons.ps1`) |

## Publishing it (GitHub Pages)

1. Upload `index.html`, `manifest.webmanifest`, `sw.js` and the `icons` folder to a GitHub repository.
2. In the repository: **Settings › Pages**, source **Deploy from a branch**, branch **main**, folder **/ (root)**.
3. The app is then at `https://<your-user-name>.github.io/<repository-name>/`.

## Sync with OneDrive

Sync needs the app registered once with Microsoft, which is free:

1. Sign in to <https://portal.azure.com> with the Microsoft account whose OneDrive should hold the data.
   Personal accounts may be asked to create a free Azure account first.
2. **App registrations › New registration**:
   - Name: `Money Tracker`
   - Supported account types: **Personal Microsoft accounts only**
   - Redirect URI: platform **Single-page application (SPA)**, the app's address
     (`https://<your-user-name>.github.io/<repository-name>/`). Add the same address followed by
     `index.html` as a second redirect URI.
3. Copy the **Application (client) ID** into `MS_CLIENT_ID` in `index.html` (it is not a secret), set
   `APP_URL` to the app's address, and upload `index.html` again.

The app only asks for its own folder in your OneDrive (**Apps › Money Tracker**), where it keeps one
file, `money-tracker.json`. Microsoft has web apps sign in again about once a day, usually without a
prompt.
