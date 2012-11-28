function loginUser(username, password, success, error) {
  $.ajax({
    url: '/login.php',
    type: 'POST',
    data: {
      username: $('#login-username').val(),
      password: $('#login-password').val(),
    },
    success: function(data) {
      if (typeof success === 'function') {
        success();
      }
    },
    error: function(xhr, status) {
      if (typeof error === 'function') {
        error();
      }
    },
  });
  return false;
}

function testLogin() {
  $.ajax({
    url: '/ajax.php',
    type: 'GET',
    dataType: 'json',
    data: {
      action: 'index',
    },
    success: function(data) {
      console.log(data);
      console.log('logged in');
    },
    error: function(xhr, status) {
      console.log('not logged in');
    },
  });
}
