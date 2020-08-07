# 8/6/20
## Fixed as of 8/6/20
On parsing a file with spaces, the file name was causing the regex to improperly match. As of this time, replace the regex to parse for any charecter instaead of [^ ].
