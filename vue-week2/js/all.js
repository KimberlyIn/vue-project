const url = 'https://vue3-course-api.hexschool.io/'; 
const path = 'jemmanine';

const emailInput = document.querySelector('#username');
const pwInput = document.querySelector('#password');
const loginBtn = document.querySelector('#login');


//* 登入驗證

loginBtn.addEventListener('click', login);

function login(e) {
    const username = emailInput.value;
    const password = pwInput.value;

    const user = {
        username,
        password
    }
    e.preventDefault();
    console.log(user);

    // #1 發送 API 至遠端並登入（並儲存 Token）

    axios.post(`${url}/admin/signin`, user)
        .then(res => {
            console.log(res);
            if (res.data.success) {
                // console.log(res.data.success); // true
                // const token = res.data.token;
                // const expired = res.data.expired;
                const { token, expired } = res.data;
                // console.log(token, expired);
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}/`;
                window.location = 'products.html';
            } else {
                alert(res.data.message);
            }  
        })
        .catch((err) => {alert("登入失敗");});
}
