let productModal;
let delProductModal;

const app = {
    // 資料
    data() {
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
        }
    },
    // 方法
    methods: {
        // 取得商品
        getProductList() {
            // [API]: /api/:api_path/products?page=:page
            // [參數]: @api_path = 'jemmanine'
            // @page 當前第幾頁(分頁參數)
            // https://github.com/hexschool/vue3-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D
            const url = `${this.axios.url}/${this.axios.api_path}/admin/products?page=1`;
            axios.get(url)
            .then(response => {
                const success = response.data.success;
                // 排錯
                if(success){
                    // 顯示為 true 才放資料 這些是為了確定一定會得到資料做的判斷
					// 這裡會回傳 response.data 裡面的 products
                    this.products = response.data.products; 
                } else {
                    const message = response.data.message;
                    alert(message);
                }
            })
            .catch(err => {
                alert(err);
            })
        },
        // 刪除磣品
        // [API]: /api/:api_path/admin/product/:product_id
        // [說明]: @api_path = 'thisismycourse2'
        // [方法]: delete
        deleteProductItem() {
            const id = this.tempProdcut.id;
            const url = `${this.axios.url}/${this.axios.api_path}/admin/product/${id}`;
            axios.delete(url)
                .then(response => {
                    const success = response.data.success;
                    if(success){
                        this.getProductList();
                        delproductModal.hide();
                    } else {
                        alert(success);
                    }
                })
        },
        // 編輯選單
        deleteProductItemDialog(item){
            this.tempProdcut = { ...item };
            delProductModal.show();
        },
        // 編輯商品
        // [API]: /api/:api_path/admin/product/:id
        // [方法]: put
        // [說明]: id(String)、title(String)、category(String)、unit(String)、origin_price(Number)、price(Number) 為必填欄位
        // @api_path = 'thisismycourse2'
        // @id = '-L9tH8jxVb2Ka_DYPwng'
        editProductItem() {
            // 如果沒有商品 就新增商品
            if(this.tempProdcut.id === undefined){
                // 新增產品
                const url = `${this.axios.url}/${this.axios.api_path}/admin/product`;
                const requestData = {
                    data: this.tempProdcut
                }
                axios.post(url, requestData)
                .then(response => {
                    const success = response.data.success;
                    if(success){
                        this.getProductList();
                        productModal.hide();
                    } else {
                        const message = response.data.message;
                        alert(message);
                    }
                })
                .catch((err) => {
                    alert(err);
                })
            }
            // 有商品 進入編輯狀態
            else {
                const id = this.tempProdcut.id;
                const url = `${this.axios.url}/${this.axios.api_path}/admin/product/${id}`;
                const requestData = {
                    data: this.tempProdcut
                }
                axios.put(url, requestData)
                    .then(response => {
                        const success = response.data.success;
                        if(success) {
                            this.getProductList();
                            productModal.hide();
                        } else {
                            const message = response.data.message;
                            alert(message);
                        }
                    })
                    .catch((err) => {
                        alert(err);
                    })
            }
        },
        editProductItemDialog(item){
            this.tempProdcut = { ...item };
            productModal.show();
        },
        addProductItemDialog() {
            this.tempProdcut = {
                category: "",
                content: "",
                description: "",
                imageUrl: "",
                imagesUrl: [
                ],
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
        deleteImageItem(index) {
            this.tempProdcut.imagesUrl.splice(index, 1);
        },
        addImageItem(index) {
            this.tempProdcut.imagesUrl.push(this.tempImage);
        },
        bindingModal() {
            const myProductModal = document.querySelector("#productModal");
            const myDelProductModal = document.querySelector("#delProductModal");
            productModal = new bootstrap.Modal(myProductModal);
            delProductModal = new bootstrap.Modal(myDelProductModal);
        }
    },
    // 生命週期
    mounted() {
        axios.defaults.headers.common.Authorization = Cookies.get('token');
        this.getProductList();
        this.bindingModal();
    },
}
Vue.createApp(app).mount("#app");