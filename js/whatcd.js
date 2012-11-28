function loginUser(username, password, success, error) {
  // success(); return false; // debug without live gazelle

  $.ajax({
    url: '../login.php',
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

function testLogin(callback) {
  // callback is called with true for logged in
  // or false for not

  // callback(true); return; // debug without live gazelle
  $.ajax({
    url: '../ajax.php',
    type: 'GET',
    dataType: 'json',
    data: {
      action: 'index',
    },
    success: function(data) {
      console.log(data);
      console.log('logged in');
      if (typeof callback === 'function') {
        callback(true);
      }
    },
    error: function(xhr, status) {
      console.log('not logged in');
      if (typeof callback === 'function') {
        callback(false);
      }
    },
  });
}
