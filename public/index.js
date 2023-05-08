"use strict";
exports.__esModule = true;
var CryptoJS = require("crypto-js");
var Block = /** @class */ (function () {
    function Block(id, hash, previousHash, data, timestamp) {
        this.id = id;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
    Block.calculateBlockHash = function (id, previousHash, data, timestamp) { return CryptoJS.SHA256(id + previousHash + data + timestamp).toString(); };
    Block.validateStructure = function (aBlock) {
        return typeof aBlock.id === 'number' && typeof aBlock.hash === 'string' && typeof aBlock.previousHash === 'string' && typeof aBlock.data === 'string' && typeof aBlock.timestamp === 'number';
    };
    return Block;
}());
var genesisBlock = new Block(0, "dg7sfjf8", "", "first block", 123456);
var blockchain = [genesisBlock];
var getBlockchain = function () { return blockchain; };
var getLastBlock = function () { return blockchain[blockchain.length - 1]; };
var getTimeStamp = function () { return Math.round(new Date().getTime() / 1000); };
var createNewBlock = function (data) {
    var lastBlock = getLastBlock();
    var newId = lastBlock.id + 1;
    var newTimestamp = getTimeStamp();
    var newHash = Block.calculateBlockHash(newId, lastBlock.hash, data, newTimestamp);
    var newBlock = new Block(newId, newHash, lastBlock.hash, data, newTimestamp);
    addBlock(newBlock);
    return newBlock;
};
var getHashForBlock = function (aBlock) { return Block.calculateBlockHash(aBlock.id, aBlock.previousHash, aBlock.data, aBlock.timestamp); };
var isBlockValid = function (candidateBlock, lastBlock) {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    }
    else if (lastBlock.id + 1 !== candidateBlock.id) {
        return false;
    }
    else if (lastBlock.hash !== candidateBlock.previousHash) {
        return false;
    }
    else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    }
    return true;
};
var addBlock = function (candidateBlock) {
    if (isBlockValid(candidateBlock, getLastBlock())) {
        blockchain.push(candidateBlock);
    }
};
createNewBlock('second block');
createNewBlock('third block');
createNewBlock('fourth block');
console.log(getBlockchain());
