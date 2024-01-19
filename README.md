# CSS Cleanup API

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D%2012-brightgreen)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

CSS Cleanup API is a simple Node.js API for cleaning up unused CSS. It utilizes the purify-css and purgecss libraries. Users can choose the cleanup engine by providing the "engine" parameter when calling the API, which can be set to either "purify" or "purge."

## Features

- **Clean Up Unused CSS:** Remove unused CSS from provided HTML code or URLs.
- **Choose Cleanup Engine:** Select between the "purify" or "purge" engine to suit your needs.

## Prerequisites

- Node.js (version 12 or higher)
- [pnpm](https://pnpm.io/) for development

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fadlee/css-cleanup-api.git
   ```
Install dependencies using pnpm:

```bash
pnpm install
```

## Usage

Run the API locally:

```bash
pnpm start
```

Test the API with cURL:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"urls": ["https://example.com/"], "htmlCode": "<div></div>", "engine": "purify"}' http://localhost:3000/cleanup-css
```

## Parameters

- urls (Array of Strings):
An array of URL strings to fetch and clean up CSS.
- htmlCode (String):
HTML code for which CSS cleanup is required.
- engine (String):
Specify the cleanup engine. Accepted values are "purify" or "purge."

## Contributions

Feel free to contribute to the project! Check out the Contribution Guidelines for more information.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
