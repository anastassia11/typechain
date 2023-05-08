import * as CryptoJS from "crypto-js";

class Block {
    public id: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    static calculateBlockHash = (
        id: number,
        previousHash: string,
        data: string,
        timestamp: number
    ): string => CryptoJS.SHA256(id + previousHash + data + timestamp).toString()

    static validateStructure = (aBlock: Block): boolean => {
        return typeof aBlock.id === 'number' && typeof aBlock.hash === 'string' && typeof aBlock.previousHash === 'string' && typeof aBlock.data === 'string' && typeof aBlock.timestamp === 'number';
    }
    constructor(
        id: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number
    ) {
        this.id = id;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, "dg7sfjf8", "", "first block", 123456)

let blockchain: [Block] = [genesisBlock];

const getBlockchain = (): [Block] => blockchain;

const getLastBlock = (): Block => blockchain[blockchain.length - 1];

const getTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
    const lastBlock: Block = getLastBlock();
    const newId: number = lastBlock.id + 1;
    const newTimestamp: number = getTimeStamp();
    const newHash: string = Block.calculateBlockHash(
        newId,
        lastBlock.hash,
        data,
        newTimestamp
    );
    const newBlock: Block = new Block(
        newId,
        newHash, lastBlock.hash,
        data,
        newTimestamp
    );
    addBlock(newBlock);
    return newBlock;
};

const getHashForBlock = (aBlock: Block): string => Block.calculateBlockHash(aBlock.id, aBlock.previousHash, aBlock.data, aBlock.timestamp)

const isBlockValid = (candidateBlock: Block, lastBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    } else if (lastBlock.id + 1 !== candidateBlock.id) {
        return false;
    } else if (lastBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    }
    return true;
};

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLastBlock())) {
        blockchain.push(candidateBlock)
    }
};

createNewBlock('second block');
createNewBlock('third block');
createNewBlock('fourth block');

console.log(getBlockchain())

