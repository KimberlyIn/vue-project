//預設匯出
export default {
	// 匯入 #userProductModal
	template: '#userProductModal',
	// 使用 props 將外部資料匯入
	props: {
		product: {
			// 問 不太清楚是 type: Object 是什麼
			type: Object,
			// 問 default() 這個函式運作的用意
			default() {
				return {
				}
			}
		}
	},
	data() {
		// 商品資料要使用的
		return {
			status: {},
			modal: '',
			qty: 1,
		}
	},
	mounted() {
		// bootstrap 樣式
		this.modal = new bootstrap.Modal(this.$refs.modal, {
			keyboard: false,
			backdrop: 'static'
		});
	},
	methods: {
		// modal 呈現狀態
		openModal() {
			this.modal.show();
		},
		hideModal() {
			this.modal.hide();
		},
	},
}