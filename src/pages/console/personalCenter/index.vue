<template>
  <div class="personalCenter">
    <el-dialog
      v-model="state.visibleWallet"
      title="Import Wallet"
    >
      <div>
        <div>
          <span>Current Wallet：</span>
          <span>{{address}}</span>
        </div>
        <!-- <div class="wallet-title">请输入你的新钱包地址</div>
        <div style="margin-top: 20px">
          <el-input v-model="state.input" placeholder="请输入你的新钱包地址" />
        </div> -->
        <el-tabs v-model="state.activeName">
          
          <el-tab-pane label="Import mnemonics" name="first">
            <div>
              <el-input
                v-model="state.textarea"
                :rows="3"
                resize="none"
                type="textarea"
                placeholder="Please enter the words in order, 12 words in total, separated by spaces"
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
                placeholder="请输入私钥（长度为64的十六进制字符串）"
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
    <div class="subtitle">Personal Center</div>
    <div>
      <el-card>
        <div class="card-title">
          <div class="wallet">Wallets</div>
          <div class="right-action">
            <a href="javascript:;" @click="state.visibleWallet = true">Switch Wallets</a>
            <a href="javascript:;" @click="logout">Logout</a>
          </div>
        </div>
        <div class="copy">
          <span>{{address}}</span>
          <img @click="copy" src="@/assets/image/copy-icon.png" />
        </div>
        <div class="card-list">
          <div class="card-item">
            <div class="card-title">Balance</div>
            <div class="fil-amount">0 FIL</div>
            <div class="rmb-amount">≈¥ 0</div>
          </div>
          <div class="card-item">
            <div class="card-title">Accumulated earnings</div>
            <div class="fil-amount">0 FIL</div>
            <div class="rmb-amount">≈¥ 0</div>
          </div>
        </div>
        <p class="tips">You can import TitanNetwork wallet to your software/hardware wallet to withdraw your earnings.</p>
      </el-card>
    </div>
    <div class="subtitle" style="margin-top:20px">Transfer History</div>
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="date" label="Sender"/>
      <el-table-column prop="name" label="Time"/>
      <el-table-column prop="address" label="GAS" />
      <el-table-column prop="address" label="Net Income" />
    </el-table>
  </div>
  <input :value="address" id="copyDom" />
</template>

<script lang='ts' setup>
  import { ref, reactive, computed } from 'vue';
  import { ElMessage } from "element-plus";
  import { useUserStore } from '@/store/modules/user';
  import { useRouter } from 'vue-router';
  import {
      generateMnemonic,
      validateMnemonic
  } from '@scure/bip39';
  
  import { wordlist } from '@scure/bip39/wordlists/english';
  // @ts-ignore
  import { keyDeriveFromSeed, keyDerive, keyRecover } from '@zondax/filecoin-signing-tools';
  const router = useRouter();
  const state = reactive<any>({
    visibleWallet: false,
    activeName: 'first',
    password: '',
    textarea: '',
    input: '',
    tableData: []
  })
  const copy = () => {
    var copyDom:any = document.getElementById('copyDom');
    copyDom.select();
    document.execCommand('copy');
    ElMessage.success('success');
  }
  const userStore = useUserStore()
  let address = computed(() => userStore.address)
  const logout = () => {
    userStore.$patch((state) => {
      state.address = ''
    })
    router.replace('/login');
  }
  const login = async (mnemonic: string) => {
    if (!validateMnemonic(mnemonic, wordlist)) {
      return ElMessage.error('请输入正确的助记词');
    }
    const keys = await keyDerive(mnemonic, `m/44'/461'/0'/0/0`, '', 'en');
    userStore.$patch((state) => {
      state.address = keys.address
    })
    state.visibleWallet = false;
    state.textarea = '';
    state.password = '';
    ElMessage.success('切换成功');
  }
  const exportIn = async () => {
    // const extendedKey = await keyRecover(ArrayBuffer('dJdy0LJ6R9LALvkDlYLs2Rx008wKJ0bclfDcxvJy9sk='), false);
    // console.log(extendedKey)
    if (state.activeName === 'first') {
      if (!state.textarea.trim()) return ElMessage.error('请输入助记词');
      let mnemonic = state.textarea.trim();
      login(mnemonic)
    }
    if (state.activeName === 'second') {
      if (!state.password.trim()) return ElMessage.error('请输入秘钥');
      let keys = state.password.trim();
      console.log(keys)
      const extendedKey = await keyRecover(keys, false)
      console.log(extendedKey)
    } 
    
  }
</script>

<style lang='scss' scoped>
  #copyDom{
    position: fixed;
    left: -1000px;
  }
  .wallet-title{
    margin-top: 20px;
    font-size: 16px;
    color: #000;
  }
  .tips{
    margin-top: 20px;
    font-size: 12px;
  }
  .card-title{
    display: flex;
    justify-content: space-between;
    .wallet{
      font-weight: 500;
      color: rgba(0,0,0,.85);
    }
    .right-action{
      a{
        text-decoration: underline;
        margin-left: 20px;
      }
    }
  }
  .copy{
    display: flex;
    align-items: center;
    margin-top: 20px;
    img{
      width: 20px;
      height: 20px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
  .card-list{
    display: flex;
    margin-top: 20px;
    .card-item{
      margin-right: 48px;
      .card-title{
        font-size: 14px;
        color: rgba(0,0,0,.65);
      }
      .fil-amount{
        font-weight: 500;
        font-size: 16px;
        color: #000;
        margin-top: 6px;
      }
      .rmb-amount{
        font-size: 14px;
        color: rgba(0,0,0,.85);
        margin-top: 6px;
      }
    }
  }
</style>