# @/store
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

### ~/ducks/configStore.js
#### Summary

For more details about configStore see [here](./configStore.md)

### ~/ducks/controlStore.js
#### Summary
Store the current application state
  
For more details about controlStore see [here](./controlStore.md)



### ~/ducks/displayStateStore.js
#### Summary

For more details about displayStateStore see [here](./displayStateStore.md)

### ~/ducks/gitStore.js
#### Summary

For more details about gitStore see [here](./gitStore.md)

### ~/ducks/index.js

For more details about store index see [here](./index.md)
