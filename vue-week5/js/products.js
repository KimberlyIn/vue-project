// 具名匯出
import userProductModal from './userProductModal.js';

// 驗證項目
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// 可參考 vue-cli\src\main.js
// 定義驗證規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  // 載入繁體中文語系
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'jemmanine';


Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      // 放商品 產品列表
      products: [],
      // 單一產品 做 props 使用的
      product: {},
      // 用戶資料
      // 結帳頁面需要
      // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E7%B5%90%E5%B8%B3%E9%A0%81%E9%9D%A2
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      // 放購物車物件資料
      cart: {},
    };
  },
  // 匯入之後以元件的方式啟用
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    // 取得商品列表
    // [API]: /api/:api_path/products?page=:page
    // [參數]: @api_path = 'thisismycourse2'
    //       @page 當前第幾頁(分頁參數)
    // [方法]: get
    // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%8F%96%E5%BE%97%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios.get(url)
      .then((response) => {
          if(response.data.success) {
            console.log(response.data.products);
            // 這裡會回傳 response.data 裡面的 products
            this.products = response.data.products;
          } else {
            alert(response.data.message);
          }
      });
    },
    // 取得商品資料
    // 單一商品細節
    // [API]: /api/:api_path/products/all
    // [參數]: @api_path = 'thisismycourse2'
    // [方法]: get
    // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%96%AE%E4%B8%80%E5%95%86%E5%93%81%E7%B4%B0%E7%AF%80
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
      // 阻止用戶一直去點擊 loadingStatus.loadingItem 如果等於 id 就會變成 disabled 的狀態
      this.loadingStatus.loadingItem = id;
      axios.get(url)
      .then((response) => {
        if(response.data.success) {
          // 資料取得完成以後 disabled 狀態才會消失
          this.loadingStatus.loadingItem = '';
          this.product = response.data.product;
          this.$refs.userProductModal.openModal();
        } else {
          // 跳出預設訊息
          alert(response.data.message);
        }
      });
    },
    // 加入購物車
    // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%8A%A0%E5%85%A5%E8%B3%BC%E7%89%A9%E8%BB%8A
    // [API]: /api/:api_path/cart
    // [方法]: post
    // [說明]: product_id(String)、qty(Number) 為必填欄位
    addToCart(id, qty = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.loadingStatus.loadingItem = id;
      // 購物車結構
      const cart = {
        product_id: id,
        qty,
      };

      // 彈出 userProductModal
      this.$refs.userProductModal.hideModal();
      // [參數]: { "data": { "product_id":"-L9tH8jxVb2Ka_DYPwng","qty":1 } }
      axios.post(url, { data: cart })
      .then((response) => {
        if(response.data.success) {
          this.loadingStatus.loadingItem = '';
          alert(response.data.message);
          // 重新渲染購物車列表
          this.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
    // 更新購物車
    // [API]: /api/:api_path/cart/:id
    // [方法]: put
    // [說明]: product_id(String)、qty(Number) 為必填欄位
    // [參數]: { "data": { "product_id":"-L9tH8jxVb2Ka_DYPwng","qty":1 } }
    // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E6%9B%B4%E6%96%B0%E8%B3%BC%E7%89%A9%E8%BB%8A
    updateCart(data) {
      this.loadingStatus.loadingItem = data.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
      // 購物車商品規格
      const cart = {
        // product_id 抓取 data 裡面的 product_id
        product_id: data.product_id,
        qty: data.qty,
      };
      axios.put(url, { data: cart })
      .then((response) => {
        // 如果回傳的是 true 就跳出更新購物車訊息
        if(response.data.success) {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          // 重新渲染購物車
          // 可參考 getData 的概念
          this.getCart();
        } else {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
        }
      });
    },
    // 刪除全部購物車
    // [API]: /api/:api_path/carts
    // [方法]: delete
    // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%88%AA%E9%99%A4%E5%85%A8%E9%83%A8%E8%B3%BC%E7%89%A9%E8%BB%8A
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url)
      .then((response) => {
        if(response.data.success) {
          alert(response.data.message);
          this.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
    // 取得購物車列表
    // [API]: /api/:api_path/cart
    // [方法]: get
    // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%8F%96%E5%BE%97%E8%B3%BC%E7%89%A9%E8%BB%8A%E5%88%97%E8%A1%A8
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url)
      .then((response) => {
        if(response.data.success) {
          // 從 response.data 取得 data 代入 this.cart 
          this.cart = response.data.data;
        } else {
          alert(response.data.message);
        }
      });
    },
    // 刪除某一筆購物車資料
    // [API]: /api/:api_path/cart/:id
    // [方法]: delete
    // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%88%AA%E9%99%A4%E6%9F%90%E4%B8%80%E7%AD%86%E8%B3%BC%E7%89%A9%E8%BB%8A%E8%B3%87%E6%96%99
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url)
      .then((response) => {
        if(response.data.success){
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
    // 結帳頁面
    // [API]: /api/:api_path/order
    // [方法]: post
    // [說明]: 建立訂單後會把所選的購物車資訊刪除, user 物件為必要
    //       name(String)、email(String)、tel(String)、address(String) 為必填欄位
    // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E7%B5%90%E5%B8%B3%E9%A0%81%E9%9D%A2
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      // 定義 order 為 data 裡面的 from
      const order = this.from;
      // { data: order } 結帳頁面 API 規則
      axios.post(url, { data: order })
      .then((response) => {
        if(response.data.success) {
          alert(response.data.message);
          // 直接對 this.$refs.form 進行 resetForm()
          // 什麼是 resetForm() 
          // 問 這裡的意思我理解為 透過 $refs 直接取得動元素並執行 resetForm() 函式
          this.$refs.form.resetForm();
          this.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
  },
  // 直接執行購物車及商品列表
  created() {
    this.getProducts();
    this.getCart();
  }
})
// 表單驗證
.component('userProductModal', userProductModal)
.mount('#app');