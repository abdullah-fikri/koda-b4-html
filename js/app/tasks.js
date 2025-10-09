define(["jquery", "moment"], function ($, moment) {
  let tasks = [];
  let currentSortBy = "terbaru";

  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function saveTasks() {
    localStorage.setItem("user", JSON.stringify(tasks));
  }

  function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("user")) || [];
  }

  function sortTasks(sortBy) {
    let sortedTasks = [...tasks];
    switch (sortBy) {
      case "tanggal":
        sortedTasks.sort((a, b) => {
          let dateA = moment(a.tanggal, "DD/MM/YYYY");
          let dateB = moment(b.tanggal, "DD/MM/YYYY");
          if (!dateA.isValid() && !dateB.isValid()) return 0;
          if (!dateA.isValid()) return 1;
          if (!dateB.isValid()) return -1;
          return dateA.diff(dateB);
        });
        break;
      case "time":
        sortedTasks.sort((a, b) => {
          let dateA = moment(a.tanggal, "DD/MM/YYYY");
          let dateB = moment(b.tanggal, "DD/MM/YYYY");
          if (!dateA.isValid() && !dateB.isValid()) return 0;
          if (!dateA.isValid()) return 1;
          if (!dateB.isValid()) return -1;
          return dateB.diff(dateA);
        });
        break;
      case "terbaru":
      default:
        sortedTasks.reverse();
        break;
    }
    return sortedTasks;
  }

  function createTaskHTML(element, originalIndex) {
    return `
      <div class="bg-white rounded-lg p-3 md:p-4">
        <div class="grid grid-cols-[auto_1fr_auto] gap-2.5 md:gap-3 items-start">
          <input type="checkbox" id="check-${originalIndex}" class="task-main-checkbox peer hidden" data-index="${originalIndex}" />
          <label for="check-${originalIndex}" class="checkbox"><span></span></label>
          
          <div class="flex flex-col gap-2 min-w-0">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <label for="check-${originalIndex}" class="text-base md:text-lg font-medium text-[#293028] cursor-pointer">
                ${escapeHTML(element.namaTugas)}
              </label>
              <div class="flex items-center gap-2">
                <span class="inline-flex px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-[#FF5F26] bg-[#FFEBD3] rounded-full">
                  ${escapeHTML(element.tanggal)}
                </span>
                <button class="option-btn hover:opacity-70 transition-opacity" data-index="${originalIndex}" aria-label="Opsi tugas">
                  <img src="/assets/option.png" alt="Icon opsi" class="w-6 h-6" />
                </button>
              </div>
            </div>

            ${
              element.deskripsi
                ? `<p class="text-sm md:text-base text-[#7A7F83]">${escapeHTML(
                    element.deskripsi
                  )}</p>`
                : ""
            }

            <div class="bg-[#F5F5F5] rounded-lg p-3 mt-2 hidden" id="subtask-${originalIndex}">
              <div class="flex justify-between items-center mb-3">
                <span class="font-medium text-sm md:text-base text-[#293038]">SUBTASK</span>
                <button class="flex items-center gap-2 px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors btn-add-subtask" data-index="${originalIndex}">
                  <img src="/assets/Plus-orange.png" alt="" class="w-4 h-4" />
                  <span class="text-[#FF5F26] hidden md:inline">Tambah</span>
                </button>
              </div>
              <div class="space-y-2" id="subtask-list-${originalIndex}">
                ${(element.subtasks || [])
                  .map(
                    (st, i) => `
                  <div class="flex items-center gap-2">
                    <input type="checkbox" ${st.selesai ? "checked" : ""} 
                          id="subtask-${originalIndex}-${i}" 
                          class="subtask-checkbox peer hidden" 
                          data-task="${originalIndex}" 
                          data-sub="${i}" />
                    <label for="subtask-${originalIndex}-${i}" class="checkbox"><span></span></label>
                    <label for="subtask-${originalIndex}-${i}" class="cursor-pointer text-sm md:text-base ${
                      st.selesai ? "line-through opacity-60" : ""
                    }">
                      ${escapeHTML(st.nama)}
                    </label>
                  </div>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
          
          <button class="arrow-toggle hover:opacity-70 transition-opacity" data-index="${originalIndex}" aria-label="Toggle subtask">
            <img src="/assets/Arrow - Down 2.svg" alt="Icon panah" class="w-6 h-6 arrow-img" />
          </button>
        </div>
      </div>
    `;
  }

  function createTasks() {
    loadTasks();
    $("#taskCheckbox").empty();
    const fragment = $(document.createDocumentFragment());
    let sortedTasks = sortTasks(currentSortBy);
    sortedTasks.forEach((element) => {
      let originalIndex = tasks.findIndex(
        (task) =>
          task.namaTugas === element.namaTugas &&
          task.tanggal === element.tanggal &&
          task.deskripsi === element.deskripsi
      );
      let dataUser = $(createTaskHTML(element, originalIndex));
      fragment.append(dataUser);
    });
    $("#taskCheckbox").append(fragment);
  }

  function addTask(nama, deskripsi, tanggal) {
    tasks.push({
      namaTugas: nama,
      deskripsi: deskripsi,
      tanggal,
      subtasks: [],
    });
    saveTasks();
    createTasks();
  }

  function addSubtask(taskIndex, namaSubtask) {
    if (!tasks[taskIndex]) return false;
    if (!tasks[taskIndex].subtasks) tasks[taskIndex].subtasks = [];
    tasks[taskIndex].subtasks.push({ nama: namaSubtask, selesai: false });
    saveTasks();
    createTasks();
    return true;
  }

  function updateSubtaskStatus(taskIndex, subIndex, completed) {
    if (tasks[taskIndex] && tasks[taskIndex].subtasks[subIndex]) {
      tasks[taskIndex].subtasks[subIndex].selesai = completed;
      saveTasks();
      createTasks();
    }
  }

  function updateSortButtonText(sortBy) {
    let buttonText = "Terbaru";
    switch (sortBy) {
      case "tanggal":
        buttonText = "By Tanggal";
        break;
      case "time":
        buttonText = "By Time";
        break;
      case "terbaru":
      default:
        buttonText = "Terbaru";
        break;
    }
    $("#btnByTanggal span").first().text(buttonText);
  }

  function handleFormSubmit() {
    $("#errorNamaTugas").text("");
    $("#errorTanggal").text("");

    if (!$("#check-tugas").is(":checked")) {
      $("#errorNamaTugas").text(
        "Centang checkbox dulu sebelum menambahkan tugas!"
      );
      return;
    }

    let inputNamaTugas = $("#inputNamaTugas").val().trim();
    let inputDeskripsiTugas = $("#deskripsi").val().trim();
    let inputDate = $("#inputDate").val().trim();

    if (!inputNamaTugas) {
      $("#errorNamaTugas").text("Nama tugas harus diisi!");
      return;
    }

    let date = moment(inputDate, "DD-MM-YYYY", true);
    if (!date.isValid()) {
      $("#errorTanggal").text("Masukkan tanggal dengan format DD-MM-YYYY");
      return;
    }
    let format = date.format("DD/MM/YYYY");

    let safeNamaTugas = escapeHTML(inputNamaTugas);
    let safeDeskripsi = escapeHTML(inputDeskripsiTugas);

    addTask(safeNamaTugas, safeDeskripsi, format);

    $("#inputNamaTugas").val("");
    $("#deskripsi").val("");
    $("#inputDate").val("");
    $("#check-tugas").prop("checked", false);
    $("#formTambahTugas").hide();
  }

  return {
    init: function () {
      createTasks();

      $(document).on("change", 'input[name="sortOption"]', function () {
        currentSortBy = this.value;
        updateSortButtonText(currentSortBy);
        createTasks();
        $("#sortByTanggal").hide();
      });

      $(`input[name="sortOption"][value="${currentSortBy}"]`).prop(
        "checked",
        true
      );
      updateSortButtonText(currentSortBy);

      $("#formTambahTugas").on("submit", function (e) {
        e.preventDefault();
        handleFormSubmit();
      });

      $("#inputNamaTugas, #inputDate").on("keypress", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleFormSubmit();
        }
      });

      $(document).on("click", ".btn-add-subtask", function (e) {
        e.preventDefault();
        e.stopPropagation();
        let index = parseInt($(this).data("index"));
        if (isNaN(index)) return;

        let namaSubtask = prompt("Masukkan nama subtask:");
        if (namaSubtask && namaSubtask.trim() !== "") {
          addSubtask(index, escapeHTML(namaSubtask.trim()));
        }
      });

      $(document).on("change", ".subtask-checkbox", function () {
        let taskIndex = $(this).data("task");
        let subIndex = $(this).data("sub");
        updateSubtaskStatus(taskIndex, subIndex, this.checked);
      });

      $(document).on("click", ".arrow-toggle", function (e) {
        e.preventDefault();
        e.stopPropagation();
        let index = $(this).data("index");
        let $img = $(this).find(".arrow-img");
        let $subtask = $(`#subtask-${index}`);

        if ($img.attr("src") === "/assets/Arrow - Down 2.svg") {
          $img.attr("src", "/assets/arrowUp.png");
        } else {
          $img.attr("src", "/assets/Arrow - Down 2.svg");
        }

        $subtask.slideToggle();
      });
    },
    getTasks: () => tasks,
    addSubtask: addSubtask,
    updateSubtaskStatus: updateSubtaskStatus,
  };
});
