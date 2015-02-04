nesh-history-search
===================

Search through your nesh history with `Ctrl-R`. Bash-like.


Installation
------------

```bash
npm install -g nesh
nesh --enable nesh-history-search
```


Usage
-----

Run `nesh` (or `nesh -c` for CoffeeScript).

Hit `Ctrl-R` and start typing, hit any non-printable key to exit search mode.
The key would be also passed to shell, so you can hit `Enter` to execute current command.
You can hit `Ctrl-R` while in search mode to find previous matches.
