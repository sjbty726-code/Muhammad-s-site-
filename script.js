const SUPABASE_URL = "https://mhmexfesomuoqjvdcdro.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_I5BFkAltAJhoZ83U6S8K0g_sHY5Z5XX";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const verifyForm = document.getElementById("verifyForm");

const message = document.getElementById("message");

let verificationEmail = "";

function showMessage(text, success = false) {
    message.textContent = text;
    message.style.color = success ? "green" : "red";
}

loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    verifyForm.classList.add("hidden");

    showMessage("");
});

registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    verifyForm.classList.add("hidden");

    showMessage("");
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document
        .getElementById("registerUsername")
        .value.trim();

    const displayName = document
        .getElementById("registerName")
        .value.trim();

    const email = document
        .getElementById("registerEmail")
        .value.trim();

    const password = document
        .getElementById("registerPassword")
        .value;

    showMessage("جاري إنشاء الحساب...", true);

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username,
                    display_name: displayName
                }
            }
        });

        if (error) {
            throw error;
        }

        verificationEmail = email;

        registerForm.classList.add("hidden");
        verifyForm.classList.remove("hidden");

        showMessage(
            "تم إنشاء الحساب. أرسلنا رمز تحقق من 6 أرقام إلى بريدك الإلكتروني.",
            true
        );

    } catch (error) {
        showMessage("حدث خطأ: " + error.message);
    }
});

verifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const code = document
        .getElementById("verificationCode")
        .value.trim();

    if (!/^\d{6}$/.test(code)) {
        showMessage("أدخل رمز التحقق المكوّن من 6 أرقام.");
        return;
    }

    showMessage("جاري التحقق...", true);

    try {
        const { data, error } = await supabaseClient.auth.verifyOtp({
            email: verificationEmail,
            token: code,
            type: "signup"
        });

        if (error) {
            throw error;
        }

        showMessage(
            "تم تأكيد البريد الإلكتروني وإنشاء الحساب بنجاح.",
            true
        );

        verifyForm.reset();

        setTimeout(() => {
            loginTab.click();
        }, 1500);

    } catch (error) {
        showMessage("رمز التحقق غير صحيح أو انتهت صلاحيته: " + error.message);
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document
        .getElementById("loginEmail")
        .value.trim();

    const password = document
        .getElementById("loginPassword")
        .value;

    showMessage("جاري تسجيل الدخول...", true);

    try {
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            throw error;
        }

        showMessage("تم تسجيل الدخول بنجاح.", true);

        console.log("المستخدم الحالي:", data.user);

    } catch (error) {
        showMessage("حدث خطأ: " + error.message);
    }
});
