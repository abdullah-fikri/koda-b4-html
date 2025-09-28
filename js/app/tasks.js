define(["jquery", "moment"], function ($, moment) {
  let tasks = [];
  let currentSortBy = "terbaru";

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

  function createTasks() {
    loadTasks();
    $("#taskCheckbox").empty();

    let sortedTasks = sortTasks(currentSortBy);

    sortedTasks.forEach((element, index) => {
      let originalIndex = tasks.findIndex(
        (task) =>
          task.namaTugas === element.namaTugas &&
          task.tanggal === element.tanggal &&
          task.deskripsi === element.deskripsi
      );

      let dataUser = $(`
        <div class="flex mt-4 items-center gap-[10px]">
          <input type="checkbox" name="check" id="check-${originalIndex}" />
          <label for="check-${originalIndex}" class="checkbox"><span></span></label>
          <div class="task-checkbox-container-product-${originalIndex}">
            <div class="flex flex-col md:flex-row">
              <label for="check-${originalIndex}" class="text-[#293028] font-medium text-lg cursor-pointer">
                ${element.namaTugas}
              </label>
              <div class="flex items-center ml-auto">
                <span class="inline-flex md:ml-4 ml-0 px-3 py-2 text-xs font-medium text-[#FF5F26] bg-[#FFEBD3] rounded-[30px]">
                  ${element.tanggal}
                </span>
                <img class="h-6 w-6 ml-2 cursor-pointer hover:opacity-80" src="/assets/option.png" alt="option" id="option-${originalIndex}">
                <p class="rounded-sm text-[#7A7F83] hidden" id="optionText-${originalIndex}">option</p>
              </div>
            </div>
            ${
              element.deskripsi
                ? `<div class="text-sm font-normal text-[#7A7F83] mt-2">${element.deskripsi}</div>`
                : ""
            }
          </div>
          <img src="/assets/Arrow - Down 2.svg" alt="arrow" class="ml-auto w-6 h-6 cursor-pointer" id="arrow-${originalIndex}" />
        </div>

        <!-- Subtask container (hidden by default) -->
        <div class="subtask-container bg-[#F5F5F5] rounded-lg mt-2 hidden p-3" id="subtask-${originalIndex}">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium text-base text-[#293038]">SUBTASK</span>
            <button 
              class="btn-tambah-subtask rounded-[50px] border px-[10px] py-[6px] flex gap-2.5 items-center bg-white"
              data-task="${originalIndex}">
              <img src="/assets/Plus-orange.png" />
              <span class="text-[#FF5F26] hidden md:block">Tambah</span>
            </button>
          </div>
          <div class="subtask-list space-y-2" id="subtask-list-${originalIndex}">
            ${(element.subtasks || [])
              .map(
                (st, i) => `
                  <div class="flex items-center">
                    <input type="checkbox" ${st.selesai ? "checked" : ""} 
                           id="check-point-subtask-${originalIndex}-${i}"
                           class="subtask-checkbox">
                    <span class="ml-2 ${
                      st.selesai ? "line-through text-gray-400" : ""
                    }">
                      ${st.nama}
                    </span>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `);
      $("#taskCheckbox").append(dataUser);
    });
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
    if (!tasks[taskIndex]) {
      return false;
    }

    if (!tasks[taskIndex].subtasks) {
      tasks[taskIndex].subtasks = [];
    }

    tasks[taskIndex].subtasks.push({
      nama: namaSubtask,
      selesai: false,
    });

    saveTasks();
    createTasks();
  }

  function updateSubtaskStatus(taskIndex, subIndex, completed) {
    if (tasks[taskIndex] && tasks[taskIndex].subtasks[subIndex]) {
      tasks[taskIndex].subtasks[subIndex].selesai = completed;
      saveTasks();
      createTasks();
    }
  }

  // Fungsi untuk mengupdate teks tombol sort
  function updateSortButtonText(sortBy) {
    let buttonText = "By Tanggal";
    switch (sortBy) {
      case "tanggal":
        buttonText = "By Tanggal";
        break;
      case "time":
        buttonText = "By Time";
        break;
      case "terbaru":
        buttonText = "Terbaru";
        break;
    }
    $("#btnByTanggal span").text(buttonText);
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

      $("#inputNamaTugas").on("keypress", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          if (!$("#check-tugas").is(":checked")) {
            alert("Centang checkbox dulu sebelum menambahkan tugas!");
            return;
          }

          let inputNamaTugas = $("#inputNamaTugas").val().trim();
          let inputDeskripsiTugas = $("#deskripsi").val().trim();
          let inputDate = $("#inputDate").val().trim();

          if (!inputNamaTugas) {
            alert("Nama tugas tidak boleh kosong!");
            return;
          }

          let date = moment(inputDate, "DD-MM-YYYY");
          if (!date.isValid()) {
            alert("Masukkan data dengan format yang benar (22-12-2024)");
            return;
          }
          let format = date.format("DD/MM/YYYY");

          addTask(inputNamaTugas, inputDeskripsiTugas, format);

          $("#inputNamaTugas").val("");
          $("#deskripsi").val("");
          $("#inputDate").val("");
          $("#check-tugas").prop("checked", false);
        }
      });

      $(document).on("click", ".btn-tambah-subtask", function (e) {
        e.preventDefault();
        e.stopPropagation();

        let index = parseInt($(this).data("task"));

        if (isNaN(index)) {
          return;
        }

        let namaSubtask = prompt("Masukkan nama subtask:");

        if (namaSubtask && namaSubtask.trim() !== "") {
          let success = addSubtask(index, namaSubtask.trim());
        }
      });

      $(document).on("change", ".subtask-checkbox", function () {
        let id = this.id;
        let ids = id.split("-");

        if (ids.length >= 5) {
          let taskIndex = parseInt(ids[3]);
          let subIndex = parseInt(ids[4]);

          updateSubtaskStatus(taskIndex, subIndex, this.checked);
        }
      });
    },
    getTasks: () => tasks,
    addSubtask: addSubtask,
    updateSubtaskStatus: updateSubtaskStatus,
  };
});
