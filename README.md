# Fisan

New version of the Fisa library

I created it when I was in eighth grade, so it's to be expected that it's not perfect

Currently, the library is just an abstraction layer for the File System Access API; it doesn't implement high-level functions like copy/paste. In the future, I will create all the missing features with another library coupled to this one, using IndexedDB. Now, Fisan reads directory entries in real time.

## DOCS

### Folders

```javascript
// Open a folder

let filesystem;
new Fisan().openFolder().then(function(result){
  filesystem = result;
})

// Folder methods

folder.getName();
folder.getType();
folder.getSize();
folder.getParent();

folder.delete(int mode);
folder.rename(string newName);
folder.move(FisanFolder newParent);

folder.list(function readCallback);

folder.newFolder(string name);
folder.newFile(string name);
```

### Files

```javascript
// Open a file

let file;
new Fisan().openFile().then(function(result){
  file = result;
})

// File methods

file.getName();
file.getType();
file.getSize();
file.getParent();

file.delete(int mode);
file.rename(string newName);
file.move(FisanFolder newParent);

file.save();
file.download(string downloadFileName);

file.read();
file.newWritable();
file.write(any data);
file.closeWritable();
```
