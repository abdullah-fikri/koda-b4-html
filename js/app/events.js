define(["jquery", "app/tasks"], function ($, tasksModule) {
  let completedTasks = [];

  function saveCompleted() {
    localStorage.setItem("completed", JSON.stringify(completedTasks));
  }

  function loadCompleted() {
    completedTasks = JSON.parse(localStorage.getItem("completed")) || [];
  }

  function renderCompleted() {
    loadCompleted();
    $("#contentTerselesaikan").empty();

    if (completedTasks.length === 0) {
      $("#contentTerselesaikan").append(
        `<p class="text-sm text-gray-500">Belum ada tugas terselesaikan</p>`
      );
      return;
    }

    completedTasks.forEach((task) => {
      let el = $(`
          <div class="flex items-center gap-2.5 mt-2 rounded px-3 py-2">
            <img src="/assets/ceklist.png" alt="ceklist" class="w-5 h-5" />
            <span class="text-lg text-[#293038] font-medium line-through">${
              task.namaTugas
            }</span>
            <span class="text-sm text-gray-400">${task.tanggal || ""}</span>
            <img class="ml-auto" src="/assets/Arrow - Down 2.svg" alt="arrow-down" />
          </div>
        `);
      $("#contentTerselesaikan").append(el);
    });
  }

  function init() {
    $("input[id^='check-point-subtask']").change(function () {
      $(`label[for='${this.id}']`).toggleClass(
        "line-through text-[#293038]",
        this.checked
      );
    });

    $("#taskCheckbox")
      .on("mouseenter", "[id^='option-']", function () {
        let index = this.id.split("-")[1];
        $(`#optionText-${index}`).show();
      })
      .on("mouseleave", "[id^='option-']", function () {
        let index = this.id.split("-")[1];
        $(`#optionText-${index}`).hide();
      });

    loadCompleted();
    renderCompleted();

    $(document).on("click", ".menu-delete", function () {
      let indexTask = $(".popup-dinamis").attr("data-index");
      let dataTasks = tasksModule.getTasks();

      if (indexTask !== undefined && dataTasks[indexTask]) {
        if (confirm("Yakin ingin menyelesaikan tugas ini?")) {
          completedTasks.push(dataTasks[indexTask]);
          saveCompleted();

          dataTasks.splice(indexTask, 1);
          localStorage.setItem("user", JSON.stringify(dataTasks));

          tasksModule.init();
          renderCompleted();
        }
      }
    });
  }

  return { init, renderCompleted };
});
