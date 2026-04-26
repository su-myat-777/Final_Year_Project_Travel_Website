document.addEventListener('DOMContentLoaded', function () {
  redirectIfAuthenticated();

  const signinPanel = document.getElementById('signin-panel');
  const signupPanel = document.getElementById('signup-panel');
  const signinTab = document.getElementById('show-signin');
  const signupTab = document.getElementById('show-signup');
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const feedback = document.getElementById('auth-feedback');

  function showPanel(panel) {
    signinPanel.classList.remove('active');
    signupPanel.classList.remove('active');
    signinTab.classList.remove('active');
    signupTab.classList.remove('active');

    panel.classList.add('active');
    if (panel === signinPanel) {
      signinTab.classList.add('active');
    } else {
      signupTab.classList.add('active');
    }

    feedback.textContent = '';
  }

  signinTab.addEventListener('click', function (e) {
    e.preventDefault();
    showPanel(signinPanel);
  });

  signupTab.addEventListener('click', function (e) {
    e.preventDefault();
    showPanel(signupPanel);
  });

  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      feedback.textContent = 'Invalid email or password.';
      return;
    }

    setCurrentUser({ id: user.id, name: user.name, email: user.email });
    window.location.href = 'index.html';
  });

  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const users = getUsers();

    if (users.some((u) => u.email === email)) {
      feedback.textContent = 'This email is already registered.';
      return;
    }

    const newUser = { id: Date.now(), name: name || 'Traveler', email, password };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    window.location.href = 'index.html';
  });
});
