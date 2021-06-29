let productModal;
let delProductModal;



const app = {
    // 資料
    data() {
        return {
            signin: {
                username: '',
                password: ''
            },
            axios: {
                url: 'https://vue3-course-api.hexschool.io/'
            }
        }
    },
    // 方法
    methods: {
        userSignin() {
            // 排錯
            if(this.signin.username.trim() === '' || this.signin.password.trim() === ''){
                alert('請輸入帳號密碼');
                return;
            }
            const url = `${this.axios.url}admin/signin`;
            axios.post(url, this.signin)
                .then(response => {
                    const success = response.data.success;
                    // console.log(success);
                    if(success){
                        // 另一種時間設定
                        // const token = response.data.token;
                        // Cookies.set('token', token);
                        // alert('登入成功');
                        // location.href = "products.html";
                        const { token, expired } = response.data;
                        document.cookie = `hexToken=${token}; expires=${new Date(expired)}/`;
                        window.location = 'products.html';
                    } else {
                        const message = response.data.message;
                        alert(message);
                    }
                })
                .catch((error)=> {
                    alert('系統生錯誤，請稍後再試');
                })
        }
    },
    created(){
    },
}
Vue.createApp(app).mount('#app');