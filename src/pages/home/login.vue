<template>
  <el-dialog
    v-model="state.dialogVisible"
    title="Warning message"
  >
    <div>
      <p>1. We do not store your private keys or mnemonics in this web wallet. You are solely responsible for your funds.</p>
      <p>2. Please make sure to back up your private key or keystroke and do not give it to anyone. If you lose your backup, we will not be able to recover your funds. </p>
      <p>3. Please make sure to keep your anti-virus software and operating system updated. Protect against phishing and other possible attacks.</p>
      <p>4. If you use a mnemonic to import your wallet, please make sure it is absolutely correct. Slight differences may result in different addresses.</p>
    </div>
    <div class="network-protocol">
      <el-checkbox v-model="state.checked">
        <a href="">I have read and agree to the Tiannetwork Agreement</a>
      </el-checkbox>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createWallet">{{state.loginType == 1 ? 'Create a wallet' : 'Importing a wallet'}}</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="state.visibleMnemonic"
    title="Mnemonic Words"
  >
    <div>
      <p>Please copy these words in order and save them to a safe place</p>
      <div class="mnemonic">
        <div class="mnemonic-item" v-for="(item, index) in state.mnemonicList" :key="index"><span>{{index + 1}}</span>{{item}}</div>
      </div>
      <p>The mnemonic or private key is the only way to recover your wallet. Once lost, it cannot be recovered. Do not use screenshots to save them.</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createMnemonic">Regenerate</el-button>
        <el-button type="primary" @click="nextStep">I have backed up, next step</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="state.visibleSelectMnemonic"
    title="Mnemonic Words"
  >
    <div>
      <p>Click on the mnemonics below and make sure the order matches the order of the mnemonics you backed up</p>
      <div class="select-mnemonic">
        <el-tag
        v-for="(tag, index) in state.selectMnemonic"
        :key="index"
        class="ml-2 mb-2"
        closable
        size="large"
        @close="closeTag(index)"
      >
        {{ tag }}
      </el-tag>
      </div>
      <div class="mnemonic cursor">
        <div class="mnemonic-item" @click="selectMnemonic(item)" v-for="(item, index) in state.mnemonicList" :key="index"><span>{{index + 1}}</span>{{item}}</div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="createAddress">Next step</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="state.visibleLogin"
    title="Import Wallet"
  >
    <div>
      <el-tabs v-model="state.activeName">
        <el-tab-pane label="Import of mnemonics" name="first">
          <div>
            <el-input
              v-model="state.textarea"
              :rows="3"
              resize="none"
              type="textarea"
              placeholder="Please enter the mnemonic words in order, 12 words in total, separated by spaces"
            />
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="私钥导入" name="second">
          <div>
            <el-input
              v-model="state.password"
              :rows="3"
              resize="none"
              type="textarea"
              placeholder="请输入私钥（base64字符串）"
            />
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="exportIn" type="primary">Import</el-button>
      </span>
    </template>
  </el-dialog>
  <div class="login">
    <div class="login-content">
      <div class="title">Login with Wallet</div>
      <div class="wallet-type">
        <div @click="showNetworkModal(1)">Create a wallet</div>
        <div @click="showNetworkModal(2)">Importing a wallet</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref, reactive, watch, computed } from 'vue';
  import { ElMessage } from "element-plus";
  import { useUserStore } from '@/store/modules/user';
  
  import {
      generateMnemonic,
      validateMnemonic
  } from '@scure/bip39';
  
  import { wordlist } from '@scure/bip39/wordlists/english';
  // @ts-ignore
  import { keyDeriveFromSeed, keyDerive, keyRecover } from '@zondax/filecoin-signing-tools';
  
  // import * as abc from '@zondax/filecoin-signing-tools';
  import router from '@/routers';
  // console.log(Buffer)
  // console.log(abc)
  // // import { storeToRefs } from 'pinia';
  const userStore = useUserStore();
  const state = reactive<any>({
    dialogVisible: false,
    checked: false,
    visibleMnemonic: false,
    mnemonicList: [],
    selectMnemonic: [],
    visibleSelectMnemonic: false,
    visibleLogin: false,
    activeName: 'first',
    password: '',
    textarea: '',
    loginType: 1,
    u32: null
  })
  
  const selectMnemonic = (item: string) => {
    if (state.selectMnemonic.length === 12) return;
    state.selectMnemonic.push(item);
  }
  const closeTag = (index: number) => {
    state.selectMnemonic.splice(index, 1)
  }
  const createWallet = () => {
    if (!state.checked) return ElMessage.error('Please agree to the agreement');
    
    state.dialogVisible = false;
    if (state.loginType == 1) {
      createMnemonic();
      return state.visibleMnemonic = true;
    } 
    state.visibleLogin = true;
    
    
  }
  const nextStep = () => {
    state.mnemonicList = state.mnemonicList.sort(() => Math.random() - 0.5);
    state.visibleMnemonic = false;
    state.visibleSelectMnemonic = true;

  }
  const showNetworkModal = async (type: number) => {
  
    state.dialogVisible = true;
    state.loginType = type;
  }
  const createMnemonic = async () => {
    const mnemonic = generateMnemonic(wordlist);
    console.log(mnemonic)
    state.mnemonicList = mnemonic.split(' ');
  }
  const login = async (mnemonic: string) => {
    if (!validateMnemonic(mnemonic, wordlist)) {
      return ElMessage.error('Please enter the correct mnemonic');
    }
    const keys = await keyDerive(mnemonic, `m/44'/461'/0'/0/0`, '', 'en');
    userStore.$patch((state) => {
      state.address = keys.address
    })
    state.u32 = keys.private_raw;
    // console.log(keys);
    router.push('/console/overview')
  }
  const createAddress = async () => {
    login(state.selectMnemonic.join(' '))
    // const keys = await keyDerive(state.selectMnemonic.join(' '), `m/44'/461'/0'/0/0`, '', 'en');
    // console.log(keys)
    // // if (!bip39.validateMnemonic(state.selectMnemonic.join(' '), wordlist)) {
    // //   return ElMessage.error('请输入正确的助记词')
    // // }
    // // const network = 'mainnet';
    // // const keys = await filecoin_signing.keyDerive(state.mnemonicList.join(' '), `m/44'/461'/0'/0/0`, network);
    
    // console.log(keys.address)
  }
  const exportIn = async () => {
    // const extendedKey = await keyRecover(ArrayBuffer('dJdy0LJ6R9LALvkDlYLs2Rx008wKJ0bclfDcxvJy9sk='), false);
    // console.log(extendedKey)
    if (state.activeName === 'first') {
      if (!state.textarea.trim()) return ElMessage.error('Please enter a mnemonic');
      let mnemonic = state.textarea.trim();
      login(mnemonic)
    }
    if (state.activeName === 'second') {
      
      if (!state.password.trim()) return ElMessage.error('Please enter the key');
      let keys = state.password.trim();
      const extendedKey = await keyRecover(keys, false)
      console.log(extendedKey)
      console.log(keys)
      
    } 
    
  }
  watch(() => state.visibleLogin, () => {
    state.textarea = '';
    state.password = '';
    state.activeName = 'first';
  })
  watch(() => state.dialogVisible, () => {
    state.checked = false;
  })
  watch(() => state.visibleSelectMnemonic, () => {
    state.selectMnemonic = [];
  })
</script>


<style lang='scss' scoped>
  
  .select-mnemonic{
    border: 1px solid #78b7e3;
    min-height: 100px;
    margin: 10px 0;
    border-radius: 8px;
    padding: 8px;
  }
  .mnemonic{
    display: flex;
    flex-wrap: wrap;
    &.cursor{
      .mnemonic-item{
        cursor: pointer;
      }
    }
    .mnemonic-item{
      width: 140px;
      height: 80px;
      border: 1px solid #ccc;
      border-radius: 6px;
      margin-right: 8px;
      margin-bottom: 8px;
      position: relative;
      text-align: center;
      line-height: 80px;
      color: #000000d9;
      font-weight: 600;
      font-size: 20px;
      span{
        position: absolute;
        left: 8px;
        top: 8px;
        height: 16px;
        line-height: 16px;
        font-size: 14px;
        color: #000000;
        font-weight: normal;
      }
    }
  }
  .network-protocol{
    a{
      text-decoration: underline;
    }
  }
  .login{
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 200px);
    .login-content{
      .title{
        text-align: center;
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
      }
      .wallet-type{
        display: flex;
        margin-top: 30px;
        div{
          width: 180px;
          height: 200px;
          text-align: center;
          line-height: 200px;
          cursor: pointer;
          border-radius: 6px;
          &:nth-child(1){
            background: rgba($color: #000000, $alpha: 0.8);
            color: #fff;
            margin-right: 30px;
          }
          &:nth-child(2){
            border: 1px solid #ccc;
          }
        }
      }
    }
  }
</style>