// 直接掛載 vue.esm-browser.js
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// 定義 api 路徑及 token
const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'jemmanine';

// 用來塞一個空值得概念，跟 undefined 有點類似
let productModal = null;
let delProductModal = null;

createApp({
  // 資料
  data() {
    return {
      // 用來放商品的空陣列
      products: [],
      // 暫存單筆資料的意思 主要不希望動到原始資料
      tempProduct: {
        // 避免出錯的第二層 也可以不寫
        imagesUrl: [],
      },
      pagination: {},
      // 用 isNew 來判斷是新增還是刪除
      isNew: false,
    }
  },
  // 取得 token
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    // 排錯
    if (token === '') {
      alert('您尚未登入請重新登入。');

      // 回到登入頁面
      window.location = 'index.html';
    }

    // Bearer 取得的 Token
    axios.defaults.headers.common.Authorization = token;
    // 重新登入畫面
    this.getData();
  },
  // 方法
  methods: {
    // 取得商品列表
    getData(page = 1) {
      const url = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then((response) => {
          // 如果回傳的是 true 
          if (response.data.success) {
            // ★★★ 問 這裡是將 products, pagination 存到 cookie 嗎
            const { products, pagination } = response.data;
            // ★★★ 問 這裡的意思是就會抓到 products 的分頁資料嗎
            this.products = products;
            this.pagination = pagination;
          } else {
            alert(response.data.message);
            // 回到登入畫面
            window.location = 'index.html';
          }
        })
    },
    // 按鈕判斷
    openModal(isNew, item) {
      // 當 isNew 是 new 的時候就執行新增
      if(isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        // 呈現在畫面上
        productModal.show();
      } else if(isNew === 'edit') {
        // 避免資料被覆蓋 使用淺拷貝方式 拷貝出一個新的物件 內容會代入 item
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if(isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
  },
})
  // 分頁元件
  .component('pagination', {
    // ★★★ 問 不太清楚 template 是從哪裡來的 
    template: '#pagination',
    props: {
      // ★★★ 問 不懂pages這個物件的意思 
      pages:{
        type: Object,
        default() {
          return { 
          }
        }
      }
    },
    methods: {
      emitPages(item) {
        this.$emit('emit-pages', item);
        console.log(item); // 會抓到頁數
      },
    },
  })
  // 產品新增/編輯元件
  .component('productModal', {
    template: '#productModal',
    props: {
      product: {
        type: Object,
        default() {
          return { 
            imagesUrl: [],
          }
        }
      },
      // 問 這一段是判斷 確認按鈕是新增還是編輯嗎
      isNew: {
        type: Boolean,
        default: false,
      },
    },
    // 問 這段不是很懂
    data() {
      return {
        modal: null,
      };
    },
    mounted() {
      // 套用 bootstrap 樣式
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        // 問 keyboard backdrop 不太明白意思
        keyboard: false,
        backdrop: 'static'
      });
    },
    methods: {
      updateProduct() {
        // 新增商品
        let api = `${apiUrl}/api/${apiPath}/admin/product`;
        let httpMethod = 'post';
        // 當不是新增商品時則切換成編輯商品 API
        if (!this.isNew) {
          api = `${apiUrl}/api/${apiPath}/admin/product/${this.product.id}`;
          httpMethod = 'put';
        }

        axios[httpMethod](api, { data: this.product }).then((response) => {
          if(response.data.success){
            alert(response.data.message);
            this.hideModal();
            this.$emit('update');
          } else {
            alert(response.data.message);
          }
        }).catch((error) => {
          console.log(error)
        });
      },
      createImages() {
        this.product.imagesUrl = [];
        this.product.imagesUrl.push('');
      },
      openModal() {
        productModal.show();
      },
      hideModal() {
        productModal.hide();
      },
    },
  })
  // 產品刪除元件
  .component('delProductModal', {
    template: '#delProductModal',
    props: {
      item: {
        type: Object,
        default() {
          return { 
          }
        }
      }
    },
    data() {
      return {
        modal: null,
      };
    },
    mounted() {
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false,
        backdrop: 'static',
      });
    },
    methods: {
      delProduct() {
        axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${this.item.id}`).then((response) => {
          if(response.data.success){
            alert(response.data.message);
            this.hideModal();
            this.$emit('update');
          } else {
            alert(response.data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      openModal() {
        delProductModal.show();
      },
      hideModal() {
        delProductModal.hide();
      },
    },
  })
  .mount('#app')