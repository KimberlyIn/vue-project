// 直接掛載 vue.esm-browser.js
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
  // 資料
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  // 函式方法
  methods: {
    // 登入帳號
    login() {
      // 定義 api 路徑
      const api = 'https://vue3-course-api.hexschool.io/admin/signin';
      // 開始 api 串接
      // 回傳 data 裡面的 username 及 password
      axios.post(api, this.user)
      .then((response) => {
        // 判斷 success 的布林值
        if(response.data.success) {
          // 定義 token, expired
          const { token, expired } = response.data;
          // 寫入 cookie token
          // expires 設置有效時間
          document.cookie = `token=${token};expires=${new Date(expired)}; path=/`;
          // 連接商品頁面
          window.location = 'products.html';
        } else {
          alert(response.data.message);
        }
      })
      // 錯誤提示
      .catch((error) => {
        alert(error);
      });
    },
  },
})
.mount('#app');
