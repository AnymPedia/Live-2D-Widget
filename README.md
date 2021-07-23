## Feature

Add Live2D widget to web page. Compatible with PJAX.

**WARNING: This project does not support legacy browsers such as IE 11.**

## Dependencies

Font Awesome (v4 or v5) is required for this plugin. Take Font Awesome v4 as an example, please add the following in `<head>`:
```xml
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css">
```

## Usage

Add this line of code to `<head>` or `<body>`，To show the effect：
```xml
<script src="https://cdn.jsdelivr.net/gh/AnymPedia/Live-2D-Widget@latest/autoload.js"></script>
```
If PJAX is enabled on the website, since the live 2D character does not need to refresh every page, you should pay attention to putting relevant scripts outside the PJAX refresh area。

In other words, if you are a novice, or you only need the most basic functions, just put this line of code, together with the line of code that loaded Font Awesome before, into the `<head>` of html.
For pages generated with various template engines (such as Nunjucks, Jinja, or PHP), you must modify it yourself. The method is similar, but it may be a little troublesome. Take [Hexo](https://hexo.io) as an example, you need to configure the path correctly in the theme-related ejs or njk template before it can be loaded.

**but! We strongly recommend to configure it yourself, otherwise many functions are incomplete and may cause problems! **
If you are interested in tossing yourself, please see the detailed instructions below.

### Using CDN

To customize the content, you can fork this warehouse and then modify it. At this time, the usage method correspondingly becomes
```xml
<script src="https://cdn.jsdelivr.net/gh/username/Live-2D-Widget@latest/autoload.js"></script>
```
Replace `username` here with your GitHub username. In order to refresh the contents of the CDN normally, you need to create a new git tag and push it to the GitHub repository, otherwise the `@latest` here still points to the file before the update. In addition, the CDN itself has a cache, so the changes may take some time to take effect. Related documents:
- [Git Basics - Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
- [Managing releases in a repository](https://help.github.com/en/github/administering-a-repository/managing-releases-in-a-repository)

### Self-host

You can also put these files directly on the server instead of loading them through the CDN.

-If you can access your host via `ssh`, please clone the entire repository to the server. implement:
  ```bash
  cd /path/to/your/webroot
  # Clone this repository
  git clone https://github.com/AnymPedia/Live-2D-Widget.git
  ```
-If your host cannot be connected with `ssh` (such as a general virtual host), please select `Download ZIP`, upload to the host via `ftp` etc., and then unzip it to the directory of the website.
-If you are deploying a static blog using tools such as Hexo, please execute the aforementioned `git clone` command in the blog source file (ie `source`) directory. When the blog is redeployed, the relevant files will be automatically uploaded to the corresponding path. In order to prevent these files from being incorrectly modified by the Hexo plug-in, you may need to set skip_render.

In this way, the entire project can be accessed from the public network through your server IP or domain name. You might as well try to open files such as `autoload.js` and `live2d.min.js` through the browser normally, and confirm that the contents of these files are complete and correct.
If everything is normal, just modify some configurations next. (It needs to be modified through the text editor on the server; you can also complete this step locally before uploading to the server)
Modify the constant `live2d_path` in `autoload.js` to the URL of the directory `Live-2D-Widget`. For example, if you can pass
```
https://example.com/path/to/Live-2D-Widget/live2d.min.js
```
Access to `live2d.min.js`, then change the value of `live2d_path` to
```
https://example.com/path/to/Live-2D-Widget/
```
The `/` at the end of the path must be added. For details, please refer to the comments in `autoload.js`.
After finishing, add in the interface where you want to add the live 2D character
```xml
<script src="https://example.com/path/to/Live-2D-Widget/autoload.js"></script>
```
It can be loaded.
