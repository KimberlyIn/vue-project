"use strict";

var productModal;
var delProductModal;
var app = {
  // 資料
  data: function data() {
    return {
      signin: {
        username: '',
        password: ''
      },
      axios: {
        url: 'https://vue3-course-api.hexschool.io/'
      }
    };
  },
  // 方法
  methods: {
    userSignin: function userSignin() {
      // 排錯
      if (this.signin.username.trim() === '' || this.signin.password.trim() === '') {
        alert('請輸入帳號密碼');
        return;
      }

      var url = "".concat(this.axios.url, "admin/signin");
      axios.post(url, this.signin).then(function (response) {
        var success = response.data.success; // console.log(success);

        if (success) {
          // 另一種時間設定
          // const token = response.data.token;
          // Cookies.set('token', token);
          // alert('登入成功');
          // location.href = "products.html";
          var _response$data = response.data,
              token = _response$data.token,
              expired = _response$data.expired;
          document.cookie = "hexToken=".concat(token, "; expires=").concat(new Date(expired), "/");
          window.location = 'products.html';
        } else {
          var message = response.data.message;
          alert(message);
        }
      })["catch"](function (error) {
        alert('系統生錯誤，請稍後再試');
      });
    }
  },
  created: function created() {}
};
Vue.createApp(app).mount('#app');