# Redux Documentation

## Location
The primary store is found at @/store/store.js (Let this be ~)  

## Structure
Built with ducks storage structure ( Action & Reducers all from a single file, seperated by purpose )
### ~/store.js
#### Summary
Store
#### Included
Middleware utilized are:
* Redux Persist

### ~/ducks/appstore.js
#### Summary
Store the current application state -- This includes past open records, currently opened repo, branch, and current diff view mode.  
  
For more details about appstore see [here](./appstore.md)

### ~/ducks/repo.js
#### Summary

For more details about repo see [here](./repo.md)

### ~/ducks/stage.js
#### Summary

For more details about stage see [here](./stage.md)

### ~/ducks/user.js
#### Summary

For more details about user see [here](./user.md)

### ~/ducks/index.js

For more details about appstore see [here](./index.md)
