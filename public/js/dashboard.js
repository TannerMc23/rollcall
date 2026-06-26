document.addEventListener('DOMContentLoaded', function () {
  var toggleBtn = document.getElementById('toggleAddTire');
  var cancelBtn = document.getElementById('cancelAddTire');
  var addForm = document.getElementById('addTireForm');

  var editForm = document.getElementById('editTireForm');
  var cancelEditBtn = document.getElementById('cancelEditTire');

  if (toggleBtn && addForm) {
    toggleBtn.addEventListener('click', function () {
      addForm.classList.toggle('hidden');
      if (editForm) editForm.classList.add('hidden');
    });
  }

  if (cancelBtn && addForm) {
    cancelBtn.addEventListener('click', function () {
      addForm.classList.add('hidden');
    });
  }

  if (cancelEditBtn && editForm) {
    cancelEditBtn.addEventListener('click', function () {
      editForm.classList.add('hidden');
    });
  }

  document.querySelectorAll('.btn-edit-tire').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tire = JSON.parse(btn.getAttribute('data-tire'));
      editForm.action = '/tires/' + tire.id + '/edit';
      editForm.querySelector('#edit_brand').value = tire.brand;
      editForm.querySelector('#edit_size').value = tire.size;
      editForm.querySelector('#edit_type').value = tire.type;
      editForm.querySelector('#edit_quantity').value = tire.quantity;
      editForm.querySelector('#edit_price').value = tire.price;
      editForm.querySelector('#edit_low_stock_threshold').value = tire.low_stock_threshold;
      if (addForm) addForm.classList.add('hidden');
      editForm.classList.remove('hidden');
    });
  });
});
