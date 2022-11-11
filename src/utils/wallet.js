import { FilecoinSigner } from '@blitslabs/filecoin-js-signer'
const filecoin_signer = new FilecoinSigner()
import { validateMnemonic } from 'bip39'

async function run() {

// 生成助记词, 128位熵生成12个单词的助记词， 256位熵生成 24个单词助记词
    const strength = 256
 const mnemonic = await filecoin_signer.wallet.generateMnemonic(strength)

    // const mnemonic = "wisdom liberty result disagree rally invite round bless item stock cake tiger duty result video upper into length bird alert ticket tool original give"
    console.log(mnemonic)

// 校验助记词
    if (!validateMnemonic(mnemonic)) {
        console.log('invalid mnemonic')
        return
    }

// 导入助记词生成 filecoin 钱包地址和私钥
    const network = 'mainnet'
    const keys = await filecoin_signer.wallet.keyDerive(mnemonic, `m/44'/461'/0'/0/0`, network)

    console.log(keys._address)
    console.log(Buffer.from(keys._privateKey, 'hex').toString('base64'))
}

export default run