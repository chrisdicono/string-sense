const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-section');
const signupForm = document.getElementById('signup-section');

// set initial properties
loginTab.style.background = 'linear-gradient(135deg, #c8efff, #85b1da)';
signupTab.style.background = 'none';
loginForm.style.display = 'block';
signupForm.style.display = 'none';

loginTab.addEventListener('click', () => {
    loginTab.style.background = 'linear-gradient(135deg, #c8efff, #85b1da)';
    signupTab.style.background = 'none';
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

signupTab.addEventListener('click', () => {
    signupTab.style.background = 'linear-gradient(135deg, #c8efff, #85b1da)';
    loginTab.style.background = 'none';
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});
