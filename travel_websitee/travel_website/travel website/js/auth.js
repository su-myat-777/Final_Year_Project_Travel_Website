function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function isAuthenticated() {
  return !!getCurrentUser();
}

function redirectIfNotAuthenticated() {
  const isLoginPage = window.location.pathname.endsWith('login.html');
  if (!isAuthenticated() && !isLoginPage) {
    window.location.href = 'login.html';
  }
}

function redirectIfAuthenticated() {
  const isLoginPage = window.location.pathname.endsWith('login.html');
  if (isAuthenticated() && isLoginPage) {
    window.location.href = 'index.html';
  }
}

function updateHeaderAuth() {
  const currentUser = getCurrentUser();
  const signinBtn = document.getElementById('signin-btn');
  const signupBtn = document.getElementById('signup-btn');
  const signoutBtn = document.getElementById('signout-btn');
  const userGreeting = document.getElementById('user-greeting');

  if (!signinBtn || !signupBtn || !signoutBtn || !userGreeting) {
    return;
  }

  if (currentUser) {
    signinBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    signoutBtn.style.display = 'inline-block';
    userGreeting.style.display = 'inline-block';
    userGreeting.textContent = `Hello, ${currentUser.name}!`;
  } else {
    signinBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    signoutBtn.style.display = 'none';
    userGreeting.style.display = 'none';
  }
}

function logoutAndRedirect() {
  clearCurrentUser();
  window.location.href = 'login.html';
}
