import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const getBalanceBtn = document.getElementById("getBalance")
const withdrawBtn = document.getElementById("withdraw")
withdrawBtn.onclick = withdraw
connectButton.onclick = connect
fundButton.onclick = fund
getBalanceBtn.onclick = getBalance
const ethAmountField = document.getElementById("ethAmount")
console.log(ethers)
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected"
    } else {
        fundButton.innerHTML = "Please Install Metamask"
    }
}

async function fund() {
    const ethAmount = ethAmountField.value
    if (typeof window.ethereum !== "undefined") {
        // console.log("inside")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (err) {
            console.log(err)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((res, rej) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`,
            )
            res()
        })
    })

    // return new Promise()
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        // console.log("inside")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        // console.log(signer)
        // const contract = new ethers.Contract(contractAddress, abi, signer)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...")
        // console.log("inside")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (err) {
            console.log(err)
        }
    }
}
