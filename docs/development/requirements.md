# Requirements

1. [Environment](#environment)
   1. [Upgrading to newer versions of development environments](#upgrading-to-newer-versions-of-development-environments)
2. [Other](#other)

## Environment

| Language | Version | Package |
| -------- | ------- | ------- |

I recommended using [VS Code](https://code.visualstudio.com/).

If you are on Windows, I highly recommend installing [msys2](http://www.msys2.org/). After installation, run the following from the `msys2` shell:

```plaintext
pacman -Syu
pacman -S base-devel
pacman -S mingw-w64-x86_64-toolchain
pacman -S mingw-w64-x86_64-cmake
```

### Upgrading to newer versions of development environments

#### Broken Python `.venv` after a Homebrew Python upgrade

If Homebrew upgrades Python (e.g. 3.13 → 3.14), it removes the old `python@<version>` directory. A `.venv` created against the old version breaks in one of two ways:

- The VS Code `create-blog-metadata` task (and any `./.venv/bin/python` call) fails with `no such file or directory` because `.venv/bin/python` / `python3` still symlink to the removed interpreter.
- Scripts fail with `ModuleNotFoundError` because a rebuilt `.venv` starts empty.

The reliable fix is to rebuild the venv from scratch:

```bash
rm -rf .venv
python3 -m venv .venv
.venv/bin/pip install -r website/scripts/python-requirements.txt
```

Confirm with `.venv/bin/python website/scripts/create_blog_metadata.py`.

## Other

1. For those who may not wish to use VSCode and instead prefer a simple text editor
   1. There is a `Makefile` at the root of this repository for building and running tests.
   2. Instructions will be provided at a later time for command line usage to add new problems, run tests, etc.
2. I do not recommend using any sort of bloated IDE. They tend to add a lot of files simply for their specific plumbing.
