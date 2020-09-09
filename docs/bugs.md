# 8/6/20
## Fixed as of 8/6/20
On parsing a file with spaces, the file name was causing the regex to improperly match. As of this time, replace the regex to parse for any charecter instaead of [^ ].

# 9/9/20
When trying to migrate to libgit2, there is complaints that node modules are incompatible. May need to try https://github.com/electron/electron-rebuild