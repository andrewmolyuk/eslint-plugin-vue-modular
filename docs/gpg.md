# Setting up GPG-signed commits

Create and/or locate a GPG key:

```sh
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long
```

Configure git to sign commits:

```sh
git config user.signingkey <KEYID>
git config commit.gpgSign true
# optional global
git config --global commit.gpgSign true
```

Export and add the public key to GitHub:

```sh
gpg --armor --export <KEYID>
```

Copy the output and add it to GitHub under Settings → SSH and GPG keys → New GPG key.
