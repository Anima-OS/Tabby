![Activity Level](https://img.shields.io/badge/status-active-brightgreen.svg?style=flat-square)
![Stability](https://anima-os.github.io/stabl-badges/experimental.svg)
![Travis Status](https://travis-ci.org/mozilla/qbrt.svg?branch=master)
[![Taskcluster Status](https://github.taskcluster.net/v1/repository/mozilla/qbrt/master/badge.svg)](https://github.taskcluster.net/v1/repository/mozilla/qbrt/master/latest)
[![Greenkeeper Status](https://badges.greenkeeper.io/mozilla/qbrt.svg)](https://greenkeeper.io/)

![Logo](logo.svg)

![Wordmark](wordmark.svg)

Quokka App Runtime
===

**Tabby** is an app runtime (similar to Electron, nw.js, Yode and qbrt) on top of Quokka.
It is designed to enable the development of secure, flexible, multiplatform applications using
common web technologies (HTML, JS, CSS) and a well documented API.

# Usage

## Installation

>TODO

## Launching a PWA (Progressive Web App)

```bash
tabby https://mobile.twitter.com
```

Which will start a process and load the URL into a native window:

![Twitter PWA](https://gist.githubusercontent.com/Happy-Ferret/9736a95e1b118f82d3d284843ad9b9e4/raw/099cb70e4df7371f882d3374a1eb01373b2c45f6/Screenshot.png)

URLs loaded in this way don't have privileged access to the system.
They're treated as web content, not application chrome.

## Launching a desktop application

To load a desktop app with system privileges, point tabby at a local directory
containing a ``package.json`` app manifest.

```bash
tabby run path/to/my/app/
```

For an example, clone qbrt's repo and try its example/ app, which will start
a process and load the app into a privileged context, giving it access
to Gecko's APIs for opening windows and loading web content along with system
integration APIs for file manipulation, networking, process management, etc.:

```bash
git clone https://github.com/mozilla/qbrt.git
qbrt run qbrt/example/
```

(Another good example is
the [shell app](https://github.com/mozilla/qbrt/tree/master/shell)
that qbrt uses to load URLs.)

To package an app for distribution, invoke the *package* command,
which creates a platform-specific package containing both your app's resources
and the Gecko runtime:

```bash
qbrt package path/to/my/app/
```

# Caveats

While qbrt itself is written in Node.js, it doesn't provide Node.js APIs
to apps. Unprivileged URLs have access to Web APIs, and privileged apps
also have access to Gecko's APIs.

qbrt doesn't yet support runtime version management (i.e. being able to specify
which version of Gecko to use, and to switch between them). At the time
you install it, it downloads the latest nightly build of Firefox.
(You can update that nightly build by reinstalling qbrt.)

The packaging support is primitive. qbrt creates a shell script (batch script
on Windows) to launch your app, and it packages your app using
a platform-specific format (ZIP on Windows, DMG on Mac, and tar/gzip on Linux).
But it doesn't set icons nor most other package meta-data, and it doesn't create
auto-installers nor support signing the package.

In general, qbrt is immature and unstable! It's appropriate for testing,
but it isn't yet mature and stable enough for you to ship apps with it.

# Contributing

Contributions of all kinds are welcome! As are all contributors. We only ask
that you treat other contributors with care and respect and observe Mozilla's
[Community Participation Guidelines](https://www.mozilla.org/en-US/about/governance/policies/participation/).
