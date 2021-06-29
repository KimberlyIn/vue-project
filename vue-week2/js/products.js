const app = {
    data: {
        url: 'https://vue3-course-api.hexschool.io/',
        path: 'jemmanine',
        productData: []
    },
    init() {
        // 取出 token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        const getProductAll = `${this.data.url}api/${this.data.path}/products/all`;
        //API
        axios.get(getProductAll)
        .then((res) => {
            // console.log(res);
            if(res.data.success){
                // 不是很懂 this.data 指的是哪裡
                this.data.productData = res.data.products;
                this.render();
            } else {
                alert('您尚未登入');
            }
        })
        .catch((err) => {
            console.log(err);
        });
        
    },
    render(){
        const productListDom = document.getElementById('productList');
        const productCountDom = document.getElementById('productCount');
        let str = '';
        this.data.productData.forEach((item) => {
            str += `<tr>
                <td>${item.title}</td>
                <td width="120">
                ${item.origin_price}
                </td>
                <td width="120">
                ${item.price}
                </td>
                <td width="100">
                <span class="">${item.is_enabled ? "啟用" : "未啟用"}</span>
                </td>
                <td width="120">
                <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-action="remove" data-id="${item.id}"> 刪除 </button>
                </td>
            </tr>`;
            productListDom.innerHTML = str;
            productCountDom.textContent = this.data.productData.length;
        });
    }
};
app.init();