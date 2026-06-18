document.addEventListener('DOMContentLoaded', function () {
  var toggleBtn = document.getElementById('toggleAddTire');
  var cancelBtn = document.getElementById('cancelAddTire');
  var form = document.getElementById('addTireForm');

  if (toggleBtn && form) {
    toggleBtn.addEventListener('click', function () {
      form.classList.toggle('hidden');
    });
  }

  if (cancelBtn && form) {
    cancelBtn.addEventListener('click', function () {
      form.classList.add('hidden');
    });
  }
});
