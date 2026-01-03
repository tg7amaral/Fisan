//
//  FisaJS a lib to access user 
//  file system with JS in Browser.
//  
//  License: WL
//  WL: Without license.
//


let FISANFile = function(FisaObject,handle,isRoot,parent){
    let self = this;
    self.handle = handle;
    self.writable = null;

    if(isRoot){
        self.parent = "root";
    }else{
        self.parent = parent;
    }
    
    let FisaPath = FisaObject;

    self.getName = function(){
        return self.handle.name;
    }
    self.getType = function(){
        return "file";
    }
    self.getSize = async function(){
        let file = await self.handle.getFile();
        return file.size;
    }
    self.getParent = function(){
        return self.parent;
    }
    self.delete = function(type){
        let textError = `This file cannot be removed`;

        if(type == 0 || type == undefined){
            self.handle.remove();
        }else{
            type == 1
                ? self.parent.handle.removeEntry(self.getName())
                : console.error(textError);
        }
    }
    self.rename = function(name,type){
        self.handle.move(name);
    }
    self.move = function(newParent,type){
        self.handle.move(newParent.handle);
    }
    self.newWritable = async function(options = null){
        self.writable = await self.handle.createWritable(options);
    }
    self.write = async function(data){
        self.writable.write(data);
    }
    self.closeWritable = async function(){
        await self.writable.close();
        self.writable = null;
    }
    self.read = async function(){
        return await self.handle.getFile();
    }
    self.save = async function(options){
        let thisFile = await self.handle.getFile();
        let content = await thisFile.arrayBuffer();

        let newFile = await window.showSaveFilePicker(options ?? {});

        let write = await newFile.createWritable();
        await write.write(content);
        await write.close();
    }
    self.download = async function(name){
        self.read().then(function(result){
            let link = document.createElement("a");

            link.download = name === undefined ? self.getName() : name;
            link.href = URL.createObjectURL(result);

            link.click();
            link.remove();
        });
    }
}

let FISANFolder = function(FisaObject,handle,isRoot,parent = null){
    let self = this;
    self.handle = handle;
    self.entries = [];

    if(isRoot){
        self.parent = "root";
    }else{
        self.parent = parent;
    }
    
    let FisaPath = FisaObject;

    self.getName = function(){
        return self.handle.name;
    }
    self.getType = function(){
        return "folder";
    }
    self.getSize = async function(){
        return await FisaPath.measureFolder(self);
    }
    self.getParent = function(){
        return self.parent;
    }
    self.delete = function(type){
        let textError = `This folder cannot be removed`;

        if(type == 0 || type == undefined){
            self.handle.remove();
        }else{
            type == 1
                ? self.folder.handle.removeEntry(self.name,{recursive:true})
                : console.error(textError);
        }
    }
    self.rename = async function(name){
        self.handle.move(name);
    }
    self.list = async function(listCallback){
        for await(const entrie of self.handle.values()){
            if(entrie.kind === "file"){
                await listCallback(new FISANFile(self,entrie,false,self));
            }else if(entrie.kind === "directory"){
                await listCallback(new FISANFolder(self,entrie,false,self));
            }
        }
    }
    self.newFolder = async function(name){
        let textError = `This folder cannot create folders`;

        if(name == undefined){
            return console.error(textError);
        }

        await self.handle.getDirectoryHandle(name,{create:true});
    }
    self.newFile = async function(name){
        let textError = `This folder cannot create files`;

        if(name == undefined || content == undefined){
            return console.error(textError);
        }

        await self.handle.getFileHandle(name,{create:true});
    }
    self.move = function(newParent){
        self.handle.move(newParent);
    }
}

let Fisan = function(){
    let self = this;

    self.objectSize = 0;

    self.openFile = async function(options){
        let currentFile = await window.showOpenFilePicker(options ?? {});
        let openedFiles = [];

        if(currentFile.length > 1){
            for(let index in currentFile){
                openedFiles.push(new FISANFile(self,currentFile[index],true));
            }
            return openedFiles;
        }else{
            return new FISANFile(self,currentFile[0],true);
        }
    }
    self.openFolder = async function(options){        
        let thisFolder = await window.showDirectoryPicker(options ?? {});

        return new FISANFolder(self,thisFolder,true);
    }
    self.measureFolder = async function(folder){
        let totalSize = 0;

        await folder.list(async (entrie) => {
            if (entrie.getType() === "folder") {
                totalSize += await self.measureFolder(entrie);
            } else {
                const file = await entrie.handle.getFile();
                totalSize += file.size;
            }
        });

        return totalSize;
    }
}