var Listly = function() {

  function Listly() {
    var self = this;
    self.tasks = [];

    function addTask(task_name) {
      self.tasks.push(task_name);
      if (save()) {
        $('#tasks').append('<li class="list-group-item">' + task_name + '</li>');
        return true;
      }
      else {
        return false;
      }
    }

    function load() {
      self.tasks = JSON.parse(localStorage.tasks);
      $.each(self.tasks, function(index, task_name) {
        $('#tasks').append('<li class="list-group-item">' + task_name + '</li>');
      });
    }

    function save() {
      try {
        return (localStorage.tasks = JSON.stringify(self.tasks));
      }
      catch(err) {
        return false;
      }
    }

    load();

    $('form#new_task').on('submit', function(ev) {
      ev.preventDefault();
      var field = $(this.task_name);
      var task_name = field.val();

      if (addTask(task_name)) {
        field.val('');
      }
      field.focus().select();
    });
  }

  return Listly;
}();

var listly = new Listly();
