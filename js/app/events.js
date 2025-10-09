define(["jquery", "app/tasks"], function ($, tasksModule) {
  let completedTasks = [];

  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

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

    completedTasks.forEach((task, index) => {
      let el = $(`
       <>
          <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <input type="checkbox" id="completed-${index}" class="peer hidden" checked />
            <label for="completed-${index}" class="checkbox">
              <span></span>
            </label>
            <span class="text-base md:text-lg text-[#293038] font-medium line-through opacity-70">${escapeHTML(
              task.namaTugas
            )}</span>
            <img class="ml-auto w-6 h-6" src="/assets/Arrow - Down 2.svg" alt="Icon panah" />
          </div>
        </>
      `);
      $("#contentTerselesaikan").append(el);
    });
  }

  function init() {
    $(document).on("change", "[id^='check-point-subtask']", function () {
      $(`label[for='${this.id}']:not(.checkbox)`).toggleClass(
        "line-through opacity-60",
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

    $(document).on("change", ".task-main-checkbox", function () {
      if (this.checked) {
        let indexTask = $(this).data("index");
        let dataTasks = tasksModule.getTasks();

        if (indexTask !== undefined && dataTasks[indexTask]) {
          if (confirm("Pindahkan tugas ke Terselesaikan?")) {
            completedTasks.push(dataTasks[indexTask]);
            saveCompleted();

            dataTasks.splice(indexTask, 1);
            localStorage.setItem("user", JSON.stringify(dataTasks));

            tasksModule.init();
            renderCompleted();
          } else {
            $(this).prop("checked", false);
          }
        }
      }
    });

    $("#arrowTerselesaikan").on("click", function () {
      let $arrow = $(this);
      let $content = $("#contentTerselesaikan");

      $content.slideToggle(200);

      if ($arrow.attr("src") === "/assets/Arrow - Right 2.png") {
        $arrow.attr("src", "/assets/Arrow - Down 2.svg");
      } else {
        $arrow.attr("src", "/assets/Arrow - Right 2.png");
      }
    });
  }

  return { init, renderCompleted };
});
