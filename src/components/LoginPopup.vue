<template>

    <div class="login-container" v-show="showLogin">

        <!--登录导航栏-->
        <div class="login-header">
            <img src="@/assets/叉号.png" @click="$emit('close')" class="close-login">
        </div>


        <!--登录内容区-->
        <div class="login-content">
            <!--扫码登录(左)-->
            <div class="left-login">
                <p>扫描二维码登录</p>
                <img src="@/assets/二维码.png" class="qrcode-img">
            </div>


            <!--登录方式(右)-->
            <div class="right-login">

                <div class="right-login-header">
                    <button @click="passworLogin" class="login-opt-btn">密码登录</button>
                    <button @click="smsLogin" class="login-opt-btn">短信登录</button>
                </div>


                <div class="right-login-content">
                    <!-- 密码登录表单 -->
                    <div class="login-form" v-show="loginTab === 'password'">

                        <div class="form-group">
                            <input type="text" v-model="username" autocomplete="off" placeholder="请输入用户名"
                                class="form-input">
                        </div>
                        <div class="form-group">
                            <input type="password" v-model="password" autocomplete="new-password" placeholder="请输入密码"
                                class="form-input">
                        </div>
                        <button class="login-btn" @click="login">登录</button>
                    </div>


                    <!-- 短信登录表单 -->
                    <div class="login-form" v-show="loginTab === 'sms'">


                        <div class="form-group phone-group">
                            <div class="phone-prefix">+86</div>
                            <input type="text" v-model="phone" placeholder="请输入手机号" class="form-input phone-input">
                        </div>

                        <div class="form-group code-group">
                            <input type="text" v-model="code" placeholder="请输入验证码" class="form-input code-input">
                            <button class="code-btn" @click="getCode" :disabled="isCounting">
                                {{ countdown > 0 ? `${countdown}s后重新获取` : '获取验证码' }}
                            </button>
                        </div>

                        <button class="login-btn" @click="login">{{ loginTab === 'sms' ? '登录/注册' : '登录' }}</button>
                    </div>


                    <div class="other-login">
                        <p style="text-align: center; margin-top: 20px; margin-bottom: 15px;">其他登录方式</p>
                        <div class="know-login">
                            <img src="@/assets/微信.png" alt=""><span>微信登录</span>
                            <img src="@/assets/微博.png" alt=""><span>微博登录</span>
                            <img src="@/assets/QQ.png" alt=""><span>QQ登录</span>
                        </div>
                    </div>

                </div>

            </div>


        </div>
        <!--登录底部提示区-->
        <div class="login-footer">

            <img src="@/assets/left.jpg">
            <span>未注册过哔哩哔哩的手机号，我们将自动帮你注册账号登录或晚餐注册即代表你同一用户协议和隐私政策</span>
            <img src="@/assets/right.jpg">

        </div>


    </div>





</template>

<script setup lang="ts">

import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'



const props = defineProps(['redirectPath'])



let router = useRouter()


const showLogin = ref(true)
const loginTab = ref('password')
const phone = ref('')
const username = ref('')
const password = ref('')

const isCounting = ref(false)
const countdown = ref(0)
const code = ref('')
const emit = defineEmits(['close', 'loginSuccess']);


async function getCode() {
    // 校验手机号是否为空
    if (!phone.value || phone.value.trim() === '') {
        ElMessage({
            message: '手机号不能为空',
            type: 'warning',
            duration: 3000
        });
        return;
    }


    // 校验手机号格式是否合理（简单的11位数字校验，可根据实际需求调整）
    if (!isValidPhone(phone.value)) {
        return
    }

    try {
        const response = await axios.get('http://localhost:8888/api/user/code', {
            params: {
                phone: phone.value
            }
        })
        // 请求成功时的弹窗
        ElMessage({
            message: '验证码已发送',
            type: 'success',
            duration: 3000 // 弹窗显示3秒
        })
        // 如果需要处理响应数据，可以在这里添加更多逻辑
        return response.data

    } catch (error) {
        // 请求失败时的弹窗
        ElMessage({
            message: error.response?.data?.message || '获取验证码失败，请稍后重试',
            type: 'error',
            duration: 3000
        })
        // 可以选择抛出错误给调用者处理
        throw error
    }

}

function isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/; // 中国大陆手机号正则
    if (!phoneRegex.test(phone)) {
        ElMessage({
            message: '请输入有效的手机号码',
            type: 'warning',
            duration: 3000
        });
        return false;
    }

    return true;
}


async function login() {
    //校验手机号或验证码是否为空
    if (!phone.value || phone.value.trim() === '' || !code.value || code.value.trim() === '') {
        ElMessage({
            message: '手机号或验证码不能为空',
            type: 'warning',
            duration: 3000
        });
        return;
    }


    if (code.value.length != 6) {
        ElMessage({
            message: '验证码位数错误',
            type: 'warning',
            duration: 3000
        });
        return;
    }


    if (!isValidPhone(phone.value)) {
        return
    }


    //校验通过,发送axios请求

    try {
        let response = await axios.post('http://localhost:8888/api/user/login', {
            code: code.value,
            phone: phone.value
        })

        if ((response).status === 200 && response.data.code === 200) {
            //请求成功的逻辑

            const token =JSON.stringify(response.data.data.token)
            console.log(typeof token)
            localStorage.setItem("authorization", token)

            ElMessage({
                message: '登录成功',
                type: 'success',
                duration: 2000 // 弹窗显示3秒
            }) 
            //登录成功,关闭弹窗
            setTimeout(() => {
                emit('close')
            }, 500)

            emit("loginSuccess", {
                avatar: response.data.data.avatar,
                redirectPath: props.redirectPath,
                userId: response.data.data.id
            })

        } else {
            //请求失败的逻辑

        }

    } catch (error) {

    }


}


function passworLogin() {
    loginTab.value = "password"
}


function smsLogin() {
    loginTab.value = "sms"
}


</script>

<style scoped>
* {
    box-sizing: border-box;
}

.login-container {
    width: 800px;
    border: 1px solid black;
    border-radius: 5px;
    padding: 20px;
    background-color: #fff;
}

.login-header {
    display: flex;
    justify-content: flex-end;
    /* 水平方向靠右对齐 */
    align-items: center;
    /* 如果需要垂直居中 */
}

.close-login {
    width: 20px;
    height: auto;
}



.login-content {
    display: flex;
}



.left-login {
    display: flex;
    /* 启用 flex 布局 */
    flex-direction: column;
    /* 使子元素在垂直方向排列 */
    justify-content: center;
    /* 垂直方向上居中对齐 */
    align-items: center;
    /* 水平方向上居中对齐 */
    text-align: center;
    /* 如果你希望文字也居中 */
    height: 100%;
    /* 保证容器有足够的高度来实现垂直居中 */
    margin-left: 80px;

}

.left-login .qrcode-img {
    margin-top: 20px;

    width: 220px;
    height: auto;
}

.right-login {
    flex: 2.6;
}

.right-login-header {
    width: 100%;
    display: flex;
    justify-content: center;
}

.right-login-header button {
    margin-left: 20px;
    margin-right: 20px;
}

.right-login-content {
    width: 100%;
    max-width: 365px;
    margin: 0 auto;
    padding: 20px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-title {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: normal;
}

.form-group {
    position: relative;
}

.form-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-input:focus {
    border-color: #00a1d6;
    outline: none;
}

/* 手机号输入组样式 */
.phone-group {
    display: flex;
    align-items: center;
}

.phone-prefix {
    padding: 0 12px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-right: none;
    border-radius: 4px 0 0 4px;
    height: 42px;
    line-height: 42px;
    color: #666;
}

.phone-input {
    border-radius: 0 4px 4px 0;
}

/* 验证码输入组样式 */
.code-group {
    display: flex;
    gap: 10px;
}

.code-input {
    flex: 1;
}

.code-btn {
    padding: 0 15px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #00a1d6;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s;
}

.code-btn:hover {
    background: #e5e5e5;
}

.code-btn:disabled {
    color: #999;
    cursor: not-allowed;
    background: #f5f5f5;
}

/* 登录按钮样式 */
.login-btn {
    width: 100%;
    padding: 7px;
    background: #00a1d6;
    text-align: center;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 17px;
    cursor: pointer;
}

.login-btn:hover {
    background: #008fc7;
}

.login-opt-btn {
    all: unset;
    cursor: pointer;
}

.know-login {
    display: flex;
    justify-content: center;
    align-items: center;
    /* 使所有子元素在垂直方向上居中对齐 */
    font-size: 13px;
}

.know-login img {
    width: 35px;
    margin-right: 5px;
    /* 给图片和文字之间添加一点间距 */
}


.know-login span {
    margin-right: 10px;
    /* 让文字和下一个图片之间有间距 */
}

.other-login {
    text-align: center;
    align-items: center;
}


.login-footer {
    display: flex;
    /* 使用 flex 布局 */
    justify-content: space-between;
    /* 使子元素分布在两端，一个紧靠左边，一个紧靠右边 */
    align-items: center;
    /* 如果你想让图片垂直居中对齐 */
}

.login-footer img {
    width: 90px;
}


.login-footer span {
    padding-top: 20px;
    width: 370px;
}
</style>
