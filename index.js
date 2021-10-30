const { ethers } = require("ethers");
const { BigNumber } = require("ethers");
const cliProgress = require('cli-progress');
const fs = require('fs');

const bscProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")

const fantomProvider = new ethers.providers.JsonRpcProvider("https://rpc.fantom.network/")

const ethProvider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`)

const ethPairs = ["0x6371efe5cd6e3d2d7c477935b7669401143b7985"]

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const ABI = [{"inputs":[{"internalType":"contract IBentoBoxV1","name":"bentoBox_","type":"address"},{"internalType":"contract IERC20","name":"magicInternetMoney_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint128","name":"accruedAmount","type":"uint128"}],"name":"LogAccrue","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"share","type":"uint256"}],"name":"LogAddCollateral","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"part","type":"uint256"}],"name":"LogBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],"name":"LogExchangeRate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newFeeTo","type":"address"}],"name":"LogFeeTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"share","type":"uint256"}],"name":"LogRemoveCollateral","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"part","type":"uint256"}],"name":"LogRepay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"feeTo","type":"address"},{"indexed":false,"internalType":"uint256","name":"feesEarnedFraction","type":"uint256"}],"name":"LogWithdrawFees","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"BORROW_OPENING_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COLLATERIZATION_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LIQUIDATION_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"accrue","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accrueInfo","outputs":[{"internalType":"uint64","name":"lastAccrued","type":"uint64"},{"internalType":"uint128","name":"feesEarned","type":"uint128"},{"internalType":"uint64","name":"INTEREST_PER_SECOND","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"skim","type":"bool"},{"internalType":"uint256","name":"share","type":"uint256"}],"name":"addCollateral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"bentoBox","outputs":[{"internalType":"contract IBentoBoxV1","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"borrow","outputs":[{"internalType":"uint256","name":"part","type":"uint256"},{"internalType":"uint256","name":"share","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collateral","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8[]","name":"actions","type":"uint8[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"datas","type":"bytes[]"}],"name":"cook","outputs":[{"internalType":"uint256","name":"value1","type":"uint256"},{"internalType":"uint256","name":"value2","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"exchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"data","type":"bytes"}],"name":"init","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"users","type":"address[]"},{"internalType":"uint256[]","name":"maxBorrowParts","type":"uint256[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"contract ISwapper","name":"swapper","type":"address"}],"name":"liquidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"magicInternetMoney","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"masterContract","outputs":[{"internalType":"contract CauldronV2Flat","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"contract IOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracleData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"reduceSupply","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"share","type":"uint256"}],"name":"removeCollateral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"skim","type":"bool"},{"internalType":"uint256","name":"part","type":"uint256"}],"name":"repay","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newFeeTo","type":"address"}],"name":"setFeeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalBorrow","outputs":[{"internalType":"uint128","name":"elastic","type":"uint128"},{"internalType":"uint128","name":"base","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCollateralShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"},{"internalType":"bool","name":"direct","type":"bool"},{"internalType":"bool","name":"renounce","type":"bool"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"updateExchangeRate","outputs":[{"internalType":"bool","name":"updated","type":"bool"},{"internalType":"uint256","name":"rate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userBorrowPart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userCollateralShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawFees","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const fetchAddresses = async (provider, pairs, blockStartNumber, blockEndNumber, path) => {
    let currentBlockNumber = blockEndNumber ? blockEndNumber : await provider.getBlockNumber()
    let completeBorrowArray = []
    let i = 0
    let temp_path = "temp-" + path

    if (fs.existsSync(temp_path)) {
        let tempObj = JSON.parse(fs.readFileSync(temp_path, 'utf8'))
        currentBlockNumber = tempObj.blockNumber
        i = tempObj.i
        completeBorrowArray = tempObj.completeBorrowArray
    }
    console.log("--- FETCHING EVENTS ---")
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(pairs.length, i);
    for(;i<pairs.length; i+=1) {
        bar1.update(i+1);
        const slpPair = new ethers.Contract(pairs[i], ABI, provider)
        for(var j = blockStartNumber; j < currentBlockNumber; j+=5000) {
            let z = j + 5000 < currentBlockNumber ? j + 5000 - 1 : currentBlockNumber
            //console.log(pairs[i], "startNumber", j, "endNumber", z)
            let mintArray = await slpPair.queryFilter(slpPair.filters.LogBorrow(), j, z)
            completeBorrowArray.push(...mintArray)
        }
        let temp = {}
        temp.completeBorrowArray = completeBorrowArray
        temp.i = i+1
        temp.blockNumber = currentBlockNumber
        fs.writeFileSync(temp_path, JSON.stringify(temp, null, 4))
    }
    bar1.stop();

    
    let borrowers = {}
    console.log("--- INDEXING Borrows ---")
    bar1.start(completeBorrowArray.length, 0);

    for(let k = 0; k < completeBorrowArray.length; k++) {
        bar1.update(k+1);
        let number = BigNumber.from(completeBorrowArray[k].args[2])
        const account = completeBorrowArray[k].args[0]
        if(!(account in borrowers)){
            borrowers[account] = {
                amount: number,
                borrowedAmount: Math.ceil(Number(ethers.utils.formatUnits(number))),
                fee: Math.ceil(Number(ethers.utils.formatUnits(number)) * 0.01)
            }
        } else {
            borrowers[account].amount = borrowers[account].amount.add(number)
            borrowers[account].borrowedAmount = Math.ceil(Number(ethers.utils.formatUnits(borrowers[account].amount))),
            borrowers[account].fee = Math.ceil(Number(ethers.utils.formatUnits(borrowers[account].amount)) * 0.01)
        }
    }

    let totalAmount = 0

    for (account in borrowers) {
        delete borrowers[account].amount
        totalAmount += borrowers[account].borrowedAmount
    }

    bar1.stop()

    let addresses = {}
    addresses.cutOffBlock = currentBlockNumber
    addresses.borrowers = borrowers
    addresses.totalNumber = Object.keys(borrowers).length
    addresses.totalAmount = totalAmount
    addresses.totalFees = Math.floor(totalAmount * 0.01)

    console.log("total", addresses.totalNumber)

    fs.writeFileSync(path, JSON.stringify(addresses, null, 4))
}

//fetchAddresses(bscProvider, 5205069, undefined, "bsc.json")


fetchAddresses(ethProvider, ethPairs, 13505014 , undefined, "borrow.json")