"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var productModal;
var delProductModal;
var app = {
  // 資料
  data: function data() {
    return {
      products: [],
      axios: {
        url: 'https://vue3-course-api.hexschool.io/api',
        api_path: 'jemmanine'
      },
      tempProdcut: {
        imagesUrl: []
      },
      tempImage: ''
    };
  },
  // 方法
  methods: {
    // 取得商品
    getProductList: function getProductList() {
      var _this = this;

      // [API]: /api/:api_path/products?page=:page
      // [參數]: @api_path = 'jemmanine'
      // @page 當前第幾頁(分頁參數)
      // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D
      var url = "".concat(this.axios.url, "/").concat(this.axios.api_path, "/admin/products?page=1");
      axios.get(url).then(function (response) {
        var success = response.data.success; // 排錯

        if (success) {
          _this.products = response.data.products;
        } else {
          var message = response.data.message;
          alert(message);
        }
      })["catch"](function (err) {
        alert(err);
      });
    },
    // 刪除磣品
    // [API]: /api/:api_path/admin/product/:product_id
    // [說明]: @api_path = 'thisismycourse2'
    // [方法]: delete
    deleteProductItem: function deleteProductItem() {
      var _this2 = this;

      var id = this.tempProdcut.id;
      var url = "".concat(this.axios.url, "/").concat(this.axios.api_path, "/admin/product/").concat(id);
      axios["delete"](url).then(function (response) {
        var success = response.data.success;

        if (success) {
          _this2.getProductList();

          delproductModal.hide();
        } else {
          alert(success);
        }
      });
    },
    // 編輯選單
    deleteProductItemDialog: function deleteProductItemDialog(item) {
      this.tempProdcut = _objectSpread({}, item);
      delProductModal.show();
    },
    // 編輯商品
    // [API]: /api/:api_path/admin/product/:id
    // [方法]: put
    // [說明]: id(String)、title(String)、category(String)、unit(String)、origin_price(Number)、price(Number) 為必填欄位
    // @api_path = 'thisismycourse2'
    // @id = '-L9tH8jxVb2Ka_DYPwng'
    editProductItem: function editProductItem() {
      var _this3 = this;

      // 如果沒有商品 就新增商品
      if (this.tempProdcut.id === undefined) {
        // 新增產品
        var url = "".concat(this.axios.url, "/").concat(this.axios.api_path, "/admin/product");
        var requestData = {
          data: this.tempProdcut
        };
        axios.post(url, requestData).then(function (response) {
          var success = response.data.success;

          if (success) {
            _this3.getProductList();

            productModal.hide();
          } else {
            var message = response.data.message;
            alert(message);
          }
        })["catch"](function (err) {
          alert(err);
        });
      } // 有商品 進入編輯狀態
      else {
          var id = this.tempProdcut.id;

          var _url = "".concat(this.axios.url, "/").concat(this.axios.api_path, "/admin/product/").concat(id);

          var _requestData = {
            data: this.tempProdcut
          };
          axios.put(_url, _requestData).then(function (response) {
            var success = response.data.success;

            if (success) {
              _this3.getProductList();

              productModal.hide();
            } else {
              var message = response.data.message;
              alert(message);
            }
          })["catch"](function (err) {
            alert(err);
          });
        }
    },
    editProductItemDialog: function editProductItemDialog(item) {
      this.tempProdcut = _objectSpread({}, item);
      productModal.show();
    },
    addProductItemDialog: function addProductItemDialog() {
      this.tempProdcut = {
        category: "",
        content: "",
        description: "",
        imageUrl: "",
        imagesUrl: [],
        is_enabled: 1,
        num: 1,
        origin_price: 0,
        price: 0,
        title: "",
        unit: "個"
      };
      this.tempImage = '';
      productModal.show();
    },
    deleteImageItem: function deleteImageItem(index) {
      this.tempProdcut.imagesUrl.splice(index, 1);
    },
    addImageItem: function addImageItem(index) {
      this.tempProdcut.imagesUrl.push(this.tempImage);
    },
    bindingModal: function bindingModal() {
      var myProductModal = document.querySelector("#productModal");
      var myDelProductModal = document.querySelector("#delProductModal");
      productModal = new bootstrap.Modal(myProductModal);
      delProductModal = new bootstrap.Modal(myDelProductModal);
    }
  },
  // 生命週期
  mounted: function mounted() {
    axios.defaults.headers.common.Authorization = Cookies.get('token');
    this.getProductList();
    this.bindingModal();
  }
};
Vue.createApp(app).mount("#app");