# microupload

A simple encrypted file storage service.

## Purpose

This sample application is a combination of two personal projects :
- [REserve](https://www.npmjs.com/package/reserve) : a **lightweight** web server statically **configurable** with regular expressions.
- [&#975;&#592;&oplus;&sopf;](https://www.npmjs.com/package/kaos) : a **simple but efficient** *(and hopefully hard to break)* data encrypter

It was created to illustrate the **streaming capabilities** of &#975;&#592;&oplus;&sopf;.

It implements a simple file upload / download service. Files are **encrypted** with a key that is **not saved on the server**. Once uploaded, the file is stored using a [unique id](https://www.npmjs.com/package/uuid) *(the file name and type are lost in the process)*. The id, the password and the file name must be known to download and access the file.

It leverages **chunk streaming and encryption** so there is *in theory* **no size limit** when uploading or downloading files.

## Setup

- Clone the repository
- Use `npm install`
- Use `npm start`
- Connect to http://localhost:8088

## Uploading a file

- Enter a key *(field `key`)*
- Browse the file to upload *(field `File to upload`)*
- Click **Upload**
- A new line will show the file name, the generated unique id and the upload progress

## Downloading a file

- Enter a key *(field `key`)*
- Enter the file id *(field `File to download`)*
- Click **Download**
- Once downloaded, rename the file to its original name

## Please note

- The key is transmitted at the beginning of the upload and the file is encrypted on the server side. They can be **intercepted**. One way to mitigate this is to run the server with SSL enabled. Please check [REserve documentation](https://github.com/ArnaudBuchholz/reserve/blob/master/doc/configuration.md#ssl-optional) on how to enable `https` access.

- To avoid brute force decryption, use **very long keys**.
